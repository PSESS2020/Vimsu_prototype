const TypeChecker = require('../../client/shared/TypeChecker.js');
const db = require('../../../../config/db')

module.exports = class FriendListService {
    
    /**
     * 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static getFriendList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: 1 }).then(par => {
            if (par) {
                return par.friendIds;
            }
            else {
                console.log("participant with participantId " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} participantId 
     * @param {String} friendId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static storeFriend(participantId, friendId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: friendId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * 
     * @param {String} participantId 
     * @param {String} friendId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeFriend(participantId, friendId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: friendId }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeAllFriends(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: { $exists: true } }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }
} 