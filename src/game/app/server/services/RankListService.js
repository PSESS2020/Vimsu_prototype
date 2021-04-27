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
     * @param {Number} currentRankListLength current rank list length on rank list board
     * @param {Number} lastRank last rank on rank list board
     * @param {Number} lastPoints last points on rank list board
     * @param {Number} lastPointsLength number of participants with last points
     * 
     * @return {Object} rank list
     */
    static #getRankList = function (conferenceId, vimsudb, currentRankListLength, lastRank, lastPoints, lastPointsLength) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);
        TypeChecker.isInt(currentRankListLength);
        TypeChecker.isInt(lastRank);
        TypeChecker.isInt(lastPoints);
        TypeChecker.isInt(lastPointsLength);

        const LIMIT = 21;

        return vimsudb.findInCollection("participants_" + conferenceId, { isModerator: false }, { participantId: 1, points: 1 }, { points: -1, participantId: 1 }, currentRankListLength, LIMIT).then(rankList => {
            let lastIndex;
            let nextRank;

            //determine number of participants with last points
            for (let i = 0; i < rankList.length; i++) {
                lastIndex = i;

                if (rankList[i].points === lastPoints) {
                    lastPointsLength++;
                    rankList[i].rank = lastRank;
                } else {
                    nextRank = lastRank + lastPointsLength;
                    rankList[i].rank = nextRank;
                    break;
                }
            }

            let rank = nextRank;
            let counter = 1;

            for (let i = lastIndex + 1; i < rankList.length; i++, ++counter) {
                if (i > 0 && rankList[i].points < rankList[i - 1].points) {
                    // increase rank only if current points less than previous
                    rank = nextRank + counter;
                }

                rankList[i].rank = rank;
            }

            return rankList;
        })
    }

    /**
     * @static gets rank list with participant usernames
     * @method module:RankListService#getRankListWithUsername
     * 
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * @param {Number} currentRankListLength current rank list length on rank list board
     * @param {Number} lastRank last rank on rank list board
     * @param {Number} lastPoints last points on rank list board
     * 
     * @return {Object} rank list with usernames
     */
    static getRankListWithUsername(conferenceId, vimsudb, currentRankListLength, lastRank, lastPoints, lastPointsLength) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);
        TypeChecker.isInt(currentRankListLength);
        TypeChecker.isInt(lastRank);
        TypeChecker.isInt(lastPoints);
        TypeChecker.isInt(lastPointsLength);

        return this.#getRankList(conferenceId, vimsudb, currentRankListLength, lastRank, lastPoints, lastPointsLength).then(rankList => {
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

        return this.#getRankList(conferenceId, vimsudb, 0, 1, 0, 0).then(rankList => {
            let idx = rankList.findIndex(ppant => ppant.participantId === participantId);
            return idx >= 0 ? rankList[idx].rank : undefined;
        })
    }
}