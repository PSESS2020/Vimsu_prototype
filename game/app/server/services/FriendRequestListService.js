const TypeChecker = require('../../client/shared/TypeChecker.js');


module.exports = class FriendRequestListService {
    static storeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static storeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static removeSentFriendRequest(ownParticipantId, receiverId, conferenceId, vimsudb) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.sent': receiverId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static removeAllSentFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.sent': { $exists: true } }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    static removeReceivedFriendRequest(ownParticipantId, senderId, conferenceId, vimsudb) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: ownParticipantId }, { 'friendRequestIds.received': senderId }).then(res => {

            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })

    }

    static removeAllReceivedFriendRequests(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { 'friendRequestIds.received': { $exists: true } }).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    static getReceivedRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


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

    static getSentRequestList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


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