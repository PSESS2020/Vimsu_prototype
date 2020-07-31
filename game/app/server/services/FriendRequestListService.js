const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');

var vimsudb = dbconf.getDB();



module.exports = class FriendRequestListService {
    static storeSentFriendRequest(ownParticipantId, receiverId, conferenceId) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);

            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: ownParticipantId}, {'friendRequestIds.sent': receiverId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static storeReceivedFriendRequest(ownParticipantId, senderId, conferenceId) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: ownParticipantId}, {'friendRequestIds.received': senderId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static removeSentFriendRequest(ownParticipantId, receiverId, conferenceId) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: ownParticipantId}, {'friendRequestIds.sent': receiverId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static removeReceivedFriendRequest(ownParticipantId, senderId, conferenceId) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(ownParticipantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: ownParticipantId}, {'friendRequestIds.received': senderId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static getReceivedRequestList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestIds.received': 1}).then(par => {

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

    static getSentRequestList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestIds.sent': 1}).then(par => {

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