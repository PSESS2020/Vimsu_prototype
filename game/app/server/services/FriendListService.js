const TypeChecker = require('../../client/shared/TypeChecker.js');

module.exports = class FriendListService {
    static getFriendList(participantId, conferenceId, vimsudb) {
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

    static storeFriend(participantId, friendId, conferenceId, vimsudb) {
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

    static storeFriends(participantId, friendIds, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);


            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: {$each: friendIds}}).then(res => {

                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })

    }

    static removeFriend(participantId, friendId, conferenceId, vimsudb) {
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

    static removeAllFriends(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendIds: {$exists: true}}).then(res => {
            return true;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }
} 