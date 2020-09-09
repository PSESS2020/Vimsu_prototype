const TypeChecker = require('../../client/shared/TypeChecker.js');
const db = require('../../../../config/db');

/**
 * The Friend Request List Service
 * @module FriendRequestListService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FriendRequestListService {

    /**
     * @static Stores sent friend request in the database
     * @method module:FriendRequestListService#storeSentFriendRequest
     * 
     * @param {String} ownParticipantId own participant ID, i.e. the one who sent the request
     * @param {String} receiverId participant ID who got the request
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if data stored successfully, otherwise false
     */
    static storeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static Stores received friend request in the database
     * @method module:FriendRequestListService#storeReceivedFriendRequest
     * 
     * @param {String} ownParticipantId own participant ID, i.e. the one who got the request
     * @param {String} senderId participant ID who sent the request
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if data stored successfully, otherwise false
     */
    static storeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static Removes sent friend request from the database
     * @method module:FriendRequestListService#removeSentFriendRequest
     * 
     * @param {String} ownParticipantId own participant ID, i.e. the one who sent the request
     * @param {String} receiverId participant ID who got the request
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if data removed successfully, otherwise false
     */
    static removeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    /**
     * @static Removes all sent friend requests of a participant from the database
     * @method module:FriendRequestListService#removeAllSentFriendRequests
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if data removed successfully, otherwise false
     */
    static removeAllSentFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.sent': { $exists: true } }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static Removes received friend request from the database
     * @method module:FriendRequestListService#removeReceivedFriendRequest
     * 
     * @param {String} ownParticipantId own participant ID, i.e. the one who got the request
     * @param {String} senderId participant ID who sent the request
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if data removed successfully, otherwise false
     */
    static removeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static Removes all received friend requests of a participant from the database
     * @method module:FriendRequestListService#removeAllReceivedFriendRequests
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance 
     * 
     * @return {boolean} true if data removed successfully, otherwise false
     */
    static removeAllReceivedFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.received': { $exists: true } }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static Gets all received friend requests of a participant
     * @method module:FriendRequestListService#getReceivedRequestList
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Array | boolean} received friend requests if participant is found, otherwise false
     */
    static getReceivedRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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
     * @static Gets all sent friend requests of a participant
     * @method module:FriendRequestListService#getSentRequestList
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Array | boolean} sent friend requests if participant is found, otherwise false
     */
    static getSentRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

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