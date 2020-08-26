const TypeChecker = require('../../client/shared/TypeChecker.js');
const ParticipantService = require('./ParticipantService');
const db = require('../../../../config/db');

module.exports = class RankListService {

    /**
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static #getRankList = function(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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

    /**
     * 
     * @param {String} conferenceId 
     * @param {number} lastRank 
     * @param {db} vimsudb 
     */
    static getRankListWithUsername(conferenceId, lastRank, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(lastRank);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getRankList(conferenceId, vimsudb).then(rankList => {
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

    /**
     * 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static getRank(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getRankList(conferenceId, vimsudb).then(rankList => {
            let idx = rankList.findIndex(ppant => ppant.participantId === participantId);
            if (idx < 0) {
                throw new Error(participantId + " is not in ranklist")
            }
            return rankList[idx].rank;
        })
    }
} 