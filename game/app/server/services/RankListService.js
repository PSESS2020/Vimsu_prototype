const TypeChecker = require('../../client/shared/TypeChecker.js');
const ParticipantService = require('./ParticipantService');

module.exports = class RankListService {
    static getRankList(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);


        return vimsudb.findInCollection("participants_" + conferenceId, {}, { participantId: 1, points: 1 }).then(ppants => {
            var rankList = ppants.sort((a, b) => b.points - a.points);

            var rank = 1;
            for (var i = 0; i < rankList.length; i++) {
                // increase rank only if current points less than previous
                if (i > 0 && rankList[i].points < rankList[i - 1].points) {
                    rank = i + 1;
                }
                rankList[i].rank = rank;
                rankList[i].self = false;
            }
            return rankList;
        }).catch(err => {
            console.error(err);
        })

    }

    static getRankListWithUsername(conferenceId, lastRank, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(lastRank);

        return this.getRankList(conferenceId, vimsudb).then(rankList => {
            var rankListLength = 1;
            for (var i = rankList.length - 1; i >= 0; i--) {
                
                if (rankList[i].rank <= lastRank) {
                    rankListLength = rankListLength + i;
                    rankList = rankList.slice(0, rankListLength);
                    break;
                }
            }

            return Promise.all(rankList.map(async ppant => {
                const username = await ParticipantService.getUsername(ppant.participantId, conferenceId, vimsudb)
                ppant.username = username;
            })).then(res => {
                return rankList;
            })
        }).catch(err => {
            console.error(err);
        })
    }

    static getRank(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return this.getRankList(conferenceId, vimsudb).then(rankList => {
            let idx = rankList.findIndex(ppant => ppant.participantId === participantId);
            if (idx < 0) {
                throw new Error(participantId + " is not in ranklist")
            }
            return rankList[idx].rank;
        })/*.catch(err => {
            console.error(err);
        })*/
    }
} 