const TypeChecker = require('../../utils/TypeChecker.js');
const dbconf = require('../../../../config/dbconf');

var vimsudb = dbconf.getDB()

module.exports = class FriendListService {
    static getFriendList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: 1}).then(par => {

                if (par) {
                    return par.friendId;
                }
                else {
                    console.log("participant with participantId " + participantId + " is not found in collection participants_" + conferenceId);
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })

    }

    static storeFriend(participantId, friendId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);


            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: friendId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static storeFriends(participantId, friendIds, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: {$each: friendIds}}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static removeFriend(participantId, friendId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);


            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: friendId}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }
} 