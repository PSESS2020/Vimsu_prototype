const TypeChecker = require('../../client/shared/TypeChecker.js');
const db = require('../../../../config/db');
const FriendList = require('../models/FriendList.js');
const ParticipantService = require('./ParticipantService');


/**
 * The Friend List Service
 * @module FriendListService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class FriendListService {

    /**
     * @static Gets all friends of a participant from the database
     * @method module:FriendListService#loadFriendList
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {FriendList | boolean} Friendlist instance if participant is found, otherwise false
     */
    static loadFriendList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: 1 }).then(async par => {
            if (par) {
                let memberList = par.friendIds;
                let memberBusinessCards = [];
                
                await memberList.forEach(async memberId => {

                    memberBusinessCards.push(await ParticipantService.getBusinessCard(memberId, conferenceId, vimsudb));

                });
                
                return Promise.all(memberBusinessCards).then( () => {
                    return new FriendList(memberBusinessCards);
                })
            }
            else {
                console.log("participant with participantId " + participantId + " is not found in collection participants_" + conferenceId);
                return false;
            }
        })
    }

    /**
     * @static store friend in the database
     * @method module:FriendListService#storeFriend
     * 
     * @param {String} participantId participant ID
     * @param {String} friendId friend ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if stored successfully, otherwise false
     */
    static storeFriend(participantId, friendId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: friendId }).then(res => {
            return res;
        })
    }

    /**
     * @static remove friend from the database
     * @method module:FriendListService#removeFriend
     * 
     * @param {String} participantId participant ID
     * @param {String} friendId friend ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if removed successfully, otherwise false
     */
    static removeFriend(participantId, friendId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(friendId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: friendId }).then(res => {
            return res;
        })
    }

    /**
     * @static remove all friends from the database
     * @method module:FriendListService#removeAllFriends
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if removed successfully, otherwise false
     */
    static removeAllFriends(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { friendIds: { $exists: true } }).then(res => {
            return res;
        })
    }
} 