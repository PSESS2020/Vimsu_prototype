const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class FriendRequestListService {
    static storeSentFriendRequest(participantId, receiverId, conferenceId) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.sent': receiverId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static storeReceivedFriendRequest(participantId, senderId, conferenceId) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.received': senderId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static removeSentFriendRequest(participantId, receiverId, conferenceId) {
        TypeChecker.isString(receiverId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.sent': receiverId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static removeReceivedFriendRequest(participantId, senderId, conferenceId) {
        TypeChecker.isString(senderId);
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.sent': senderId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static getReceivedRequestList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.received': 1}).then(par => {
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
        })
    }

    static getSentRequestList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {'friendRequestId.sent': 1}).then(par => {
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
        })
    }
} 