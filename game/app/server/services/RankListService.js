const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');
const ParticipantService = require('./ParticipantService');

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class RankListService {
    static getRankList(conferenceId) {
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findInCollection("participants_" + conferenceId, {}, {participantId: 1, points: 1}).then(ppants => {
                var rankList = ppants.sort((a,b) => b.points - a.points);

                var rank = 1;
                for (var i = 0; i < rankList.length; i++) {
                    // increase rank only if current points less than previous
                    if (i > 0 && rankList[i].points < rankList[i - 1].points) {
                        rank++;
                    }
                    rankList[i].rank = rank;
                    rankList[i].self = false;
                }
                return rankList;
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static getRankListWithUsername(conferenceId, lastRank) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(lastRank);

        return this.getRankList(conferenceId).then(async rankList => {
            var rankListLength = 1;

            for(var i = rankList.length - 1; i >= 0; i--){
                if(rankList[i].rank === lastRank) {
                    rankListLength = rankListLength + i;
                    break;
                }
            }    

            rankList.slice(0, rankListLength);
            await Promise.all(rankList.map(async ppant => {
                const username = await ParticipantService.getUsername(ppant.participantId, conferenceId)
                ppant.username = username;
            }));
            return rankList;
        }).catch(err => {
            console.error(err);
        })
    }

    static getRank(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return this.getRankList(conferenceId).then(rankList => {
            let idx = rankList.findIndex(ppant => ppant.participantId === participantId);
            if (idx < 0) {
                throw new Error(participantId + " is not in ranklist")
            }
            return rankList[idx].rank;
        }).catch(err => {
            console.error(err);
        })
    }
} 