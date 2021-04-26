const TypeChecker = require('../../client/shared/TypeChecker.js');
const ParticipantService = require('./ParticipantService');
const db = require('../../../../config/db');

/**
 * The Rank List Service
 * @module RankListService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RankListService {

    /**
     * @private @static gets rank list from the database
     * @method module:RankListService#getRankList
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Object} rank list
     */
    static #getRankList = function (conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findInCollection("participants_" + conferenceId, { isModerator: false }, { participantId: 1, points: 1 }, { points: -1 }).then(rankList => {
            let rank = 1;
            for (let i = 0; i < rankList.length; i++) {
                // increase rank only if current points less than previous
                if (i > 0 && rankList[i].points < rankList[i - 1].points) {
                    rank = i + 1;
                }
                rankList[i].rank = rank;
            }
            return rankList;
        })
    }

    /**
     * @static gets rank list with participant usernames, splices the list until the lastRank
     * @method module:RankListService#getRankListWithUsername
     * 
     * @param {String} conferenceId conference ID
     * @param {number} lastRank last rank to be shown in the rank list
     * @param {db} vimsudb db instance
     * 
     * @return {Object} rank list until place lastRank
     */
    static getRankListWithUsername(conferenceId, lastRank, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInt(lastRank);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getRankList(conferenceId, vimsudb).then(rankList => {
            let rankListLength = 1;

            for (let i = rankList.length - 1; i >= 0; i--) {
                if (rankList[i].rank <= lastRank) {
                    rankListLength = rankListLength + i;
                    rankList = rankList.slice(0, rankListLength);
                    break;
                }
            }

            return Promise.all(rankList.map(async ppant => {
                ppant.username = await ParticipantService.getUsername(ppant.participantId, conferenceId, vimsudb);
            })).then(res => {
                return rankList;
            })
        })
    }

    /**
     * @static gets rank of a participant
     * @method module:RankListService#getRank
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {number} participant's rank
     */
    static getRank(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getRankList(conferenceId, vimsudb).then(rankList => {
            let idx = rankList.findIndex(ppant => ppant.participantId === participantId);
            return idx >= 0 ? rankList[idx].rank : undefined;
        })
    }
}