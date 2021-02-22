const TypeChecker = require('../../client/shared/TypeChecker.js');
const db = require('../../../../config/db');
const MeetingList = require('../models/MeetingList.js');
const ParticipantService = require('./ParticipantService');


/**
 * The Meeting List Service
 * @module MeetingListService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class MeetingListService {

    /**
     * @static Gets all meetings of a participant from the database
     * @method module:MeetingListService#loadMeetingList
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {MeetingList | boolean} Meetinglist instance if participant is found, otherwise false
     */
    static loadMeetingList(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIds: 1 }).then(async par => {
            if (par) {
                let memberList = par.meetingIds;
                let memberBusinessCards = [];
                
                await memberList.forEach(async memberId => {

                    memberBusinessCards.push(await ParticipantService.getBusinessCard(memberId, conferenceId, vimsudb));

                });
                
                return Promise.all(memberBusinessCards).then( () => {
                    return new MeetingList(memberBusinessCards);
                })
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
     * @static store meeting in the database
     * @method module:MeetingListService#storeMeeting
     * 
     * @param {String} participantId participant ID
     * @param {String} meetingId meeting ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if stored successfully, otherwise false
     */
    static storeMeeting(participantId, meetingId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIds: meetingId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static remove meeting from the database
     * @method module:MeetingListService#removeMeeting
     * 
     * @param {String} participantId participant ID
     * @param {String} meetingId meeting ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if removed successfully, otherwise false
     */
    static removeMeeting(participantId, meetingId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIds: meetingId }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }

    /**
     * @static remove all meetings from the database
     * @method module:MeetingListService#removeAllMeetings
     * 
     * @param {String} participantId participant ID
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if removed successfully, otherwise false
     */
    static removeAllMeetings(participantId, conferenceId, vimsudb) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIds: { $exists: true } }).then(res => {
            return res;
        }).catch(err => {
            console.error(err);
            return false;
        })
    }
} 