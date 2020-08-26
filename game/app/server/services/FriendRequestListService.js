const TypeChecker = require('../../client/shared/TypeChecker.js');
const db = require('../../../../config/db');

module.exports = class FriendRequestListService {

    /**
     * 
     * @param {String} ownParticipantId 
     * @param {String} receiverId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static storeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    /**
     * 
     * @param {String} ownParticipantId 
     * @param {String} senderId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static storeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    /**
     * 
     * @param {String} ownParticipantId 
     * @param {String} receiverId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {

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
    static removeAllSentFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.sent': { $exists: true } }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * 
     * @param {String} ownParticipantId 
     * @param {String} senderId 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static removeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {

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
    static removeAllReceivedFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.received': { $exists: true } }).then(res => {
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
    static getReceivedRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.received': 1 }).then(par => {

            if (par) {
                return par.friendRequestId.received;
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
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     */
    static getSentRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb ,db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.sent': 1 }).then(par => {

            if (par) {
                return par.friendRequestId.sent;
            }
            else {
                console.log("participant with participantId " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }
} 