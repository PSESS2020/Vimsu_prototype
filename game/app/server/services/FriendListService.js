const TypeChecker = require('../../utils/TypeChecker.js');
const Position = require('../models/Position.js');
const Participant = require('../models/Participant')
const Settings = require('../../utils/Settings.js');
const ObjectId = require('mongodb').ObjectID;
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

module.exports = class FriendListService {
    static getFriendList(participantId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("participants_" + conferenceId, {participantId: participantId}, {friendId: 1}).then(par => {
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
        })
    }

    static storeFriend(participantId, friendId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendId: friendId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static storeFriends(participantId, friendIds, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.insertToArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendId: {$each: friendIds}}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }

    static removeFriend(participantId, friendId, conferenceId) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);

        return getDB().then(res => {
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {participantId: participantId}, {friendId: friendId}).then(res => {
                return true;
            }).catch(err => {
                console.error(err);
                return false;
            })
        })
    }
} 