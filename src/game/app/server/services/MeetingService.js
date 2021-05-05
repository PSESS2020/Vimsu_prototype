const TypeChecker = require('../../client/shared/TypeChecker.js');
const ObjectId = require('mongodb').ObjectID;
const Settings = require('../utils/Settings.js');
const db = require('../../../../config/db');
const Meeting = require('../models/Meeting.js');

/**
 * The Meeting Service
 * @module MeetingService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Meetingservice {


    /**
     * To implement:
     * - New Meeting                        [X]
     * - Check for Meeting                  [X]
     * - Load all meetings of ppant         [X]
     * - Load specific meeting              [X]
     * - Add participant to meeting         [X]
     * - remove ppant                       [X]
     * - remove all meetings (clean db)     [X]
     */

    /**
     * Initializes meeting for whole conference if it does not exist already and returns it
     * 
     * @static @method module:MeetingService#getConferenceMeeting
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Meeting} Conference meeting
     */
    static getConferenceMeeting(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("meetings_" + conferenceId, { name: Settings.CONFERENCE_MEETINGNAME }).then(conferenceMeetingData => {
            if (conferenceMeetingData) {
                return new Meeting(conferenceMeetingData.meetingId, conferenceMeetingData.name, conferenceMeetingData.members, conferenceMeetingData.password);
            } else {
                console.log("Conference meeting did not exist.");

                //get all exisiting participants from db
                return vimsudb.findAllInCollection("participants_" + conferenceId).then(participants => {
                    let memberIdList = [];
                    participants.forEach(ppant => {
                        memberIdList.push(ppant.participantId);
                    });

                    return this.newMeeting(memberIdList, Settings.CONFERENCE_MEETINGNAME, conferenceId, vimsudb);
                });
            }       
        });
    }

    /**
     * Load a map that contains all meetings belonging to the passed
     * conference stored in the database, indexed by their names.
     * 
     * @static @method module:MeetingService#loadMeetingMap
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     * @returns {Map} map from meeting name to meeting
     */
    static loadMeetingMap(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);
        
        var meetingMap = new Map();

        return vimsudb.findAllInCollection("meetings_" + conferenceId).then(async meetings => {
            meetings.forEach(meeting => {
                meetingMap.set(meeting.name, new Meeting(meeting.meetingId, meeting.name, meeting.members, meeting.password));
            })
            return meetingMap;
        })
    }

    /**
     * Creates a new meeting in the database and returns a
     * Meeting-instance corresponding to it
     * 
     * @static @method module:MeetingService#newMeeting
     * 
     * @param {String[]} memberIdList 
     * @param {String} meetingName 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Meeting} Meeting instance 
     */
    static newMeeting(memberIdList, meetingName, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(memberIdList, Array);
        memberIdList.forEach(id => {
            TypeChecker.isString(id);
        });
        TypeChecker.isString(meetingName);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        if(!this.existsMeeting(memberIdList, meetingName, conferenceId, vimsudb)) {
            console.log("Meeting with name " + meetingName + " already exists in database.");
            return false;
        }

        var meeting = {
            meetingId: new ObjectId().toHexString(),
            name: meetingName,
            members: memberIdList,
            password: new ObjectId().toHexString()
        }

        memberIdList.forEach(participantId => {
            vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIDList: meeting.meetingId });
        });
            
        return vimsudb.insertOneToCollection("meetings_" + conferenceId, meeting).then(res => {
            console.log("meeting saved");
            return new Meeting(meeting.meetingId, meeting.name, meeting.members, meeting.password);
        })
    }

    /**
     * Check if a meeting with the specified name and memberlist already
     * exists in the database.
     * @static @method module:MeetingService#existsMeeting
     * 
     * @param {String[]} memberIdList 
     * @param {String} meetingName 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Meeting} Returns the meeting if it exists or false if not 
     */
    static existsMeeting(memberIdList, meetingName, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(memberIdList, Array);
        memberIdList.forEach(id => {
            TypeChecker.isString(id);
        });
        TypeChecker.isString(meetingName);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("meetings_" + conferenceId, 
            { name: meetingName, members: memberIdList }).then(meeting => {
            if (meeting) {
                return meeting;
            } else {
                console.log("No meeting with name " + meetingName + " could be found in database.");
                return false;
            }
        })
    }

    /**
     * Loads all meetings a specific participant 
     * is a member of from the database. The way
     * this works is without a ppantId, as this
     * method is called with a list of meetingIds
     * from the ppant's database entry.
     * @static @method module:MeetingService#loadMeetingList
     * 
     * @param {String[]} meetingIDList 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     * 
     * @return {Meetings} The list of meetings the participant is in.
     */
    static loadMeetingList(meetingIDList, conferenceId, vimsudb) {
        TypeChecker.isInstanceOf(meetingIDList, Array);
        meetingIDList.forEach(id => {
            TypeChecker.isString(id);
        })
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        let meetings = [];
        return Promise.all(meetingIDList.map(async meetingId => {
            var meeting = await vimsudb.findOneInCollection("meetings_" + conferenceId, { meetingId: meetingId });
            meetings.push(new Meeting(
                meeting.meetingId,
                meeting.name,
                meeting.members,
                meeting.password
            ));
        })).then(res => {
            return meetings;
        })

    }
    
    /**
     * Checks whether a meeting-entry with the passed id already exists
     * in the database. If yes, it returns a Meeting-instance corresponding
     * to the entry.
     * @static @method module:MeetingService#loadMeeting
     * 
     * @param {String} meetingId 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Meeting} Meeting instance 
     */
    static loadMeeting(meetingId, conferenceId, vimsudb) {
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("meetings_" + conferenceId, { meetingId: meetingId }).then(meeting => {

            if (meeting) {
                return new Meeting(meeting.meetingId, 
                    meeting.name, 
                    meeting.members,
                    meeting.password);
                } else {
                    console.log("Could not find meeting with id " + meetingId);
                }
        })
    }

    /**
     * Attempts to add a new partcipant to the specified meeting-entry
     * and returns whether it was successful or not.
     * @static @method module:MeetingService#addParticipant
     * 
     * @param {String} meetingId 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Boolean} Whether the operation was successful or not 
     */
    static addParticipant(meetingId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(participantId);
        TypeChecker.isInstanceOf(vimsudb, db);
        
        return vimsudb.insertToArrayInCollection("meetings_" + conferenceId, { meetingId: meetingId }, { members: participantId }).then(res => {
            if (res) {
                // Add meeting to the participant's list of meetings
                return vimsudb.insertToArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIDList: meetingId }).then(res => {
                    if (res) {
                        return true;
                    } else {
                        return false;
                    }
                })
            } else {
                return false;
            }
        })
    }

    /**
     * Attempts to remove a new partcipant to the specified meeting-entry
     * and returns whether it was successful or not.
     * If the meeting has no more members left afterwards, the meeting
     * entry is deleted as well.
     * @static @method module:MeetingService#removeParticipant
     * 
     * @param {String} meetingId 
     * @param {String} participantId 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Boolean} Whether the operation was successful or not 
     */
    static removeParticipant(meetingId, participantId, conferenceId, vimsudb) {
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(participantId);
        TypeChecker.isInstanceOf(vimsudb, db);
        
        // First, we attempt to remove the ppant from the members of
        // the meeting
        return vimsudb.deleteFromArrayInCollection("meetings_" + conferenceId, { meetingId: meetingId }, { members: participantId }).then(res => {
            var dbRes = res;

            // then, we attempt to remove the meeting from the meeting
            // list of the participant
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, { participantId: participantId }, { meetingIDList: meetingId }).then(res => {
                
                // Finally, we now check whether there are any meeting
                // members left. If not, we delete the meeting entry.
                return vimsudb.findOneInCollection("meetings_" + conferenceId, { meetingId: meetingId }, { members: 1 }).then(meeting => {
                    if (meeting && dbRes) {
                        if (meeting.members.length < 1) {
                            return vimsudb.deleteOneFromCollection("meetings_" + conferenceId, { meetingId: meetingId }).then(res => {
                                if (res) {
                                    console.log("Meeting with id " + meetingId + " was deleted from database.");
                                } else {
                                    console.log("Meeting with id " + meetingId + " could not be deleted from database.");
                                }
                                return res;
                            })
                        }
                        return true;
                    } else {
                        console.log("No meeting with id " + meetingId + " could be found in database.");
                        return false;
                    }
                })
            })
        })
    }

    /**
     * Deletes all meetings from database.
     * @static @method module:MeetingService#cleanMeetings
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     * 
     * @returns {Boolean} Whether the operation was successful.
     */
    static cleanMeetings(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        // Delete all meetings from database
        return vimsudb.deleteAllFromCollection("meetings_" + conferenceId).then(meetRes => {
            // Delete all meetings from the participant entries
            return vimsudb.deleteFromArrayInCollection("participants_" + conferenceId, {}, { meetingIDList: { $exists: true } }).then(res => {
                if (meetRes && res) {
                    console.log("All meetings have been deleted from database.");
                }
                return meetRes
            })
        })
    }
    
    /**
     * Deletes the meeting with the passed id from the database.
     * @static @method module:MeetingService#removeMeeting
     * 
     * @param {String} meetingId 
     * @param {String} conferenceId 
     * @param {db} vimsudb
     * 
     * @returns {Boolean} Whether the operation was successful. 
     */
    static removeMeeting(meetingId, conferenceId, vimsudb) {
        TypeChecker.isString(meetingId);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);
        
        // Find the meeting in the database.
        return vimsudb.findOneInCollection("meetings_" + conferenceId, { meetingId: meetingId }, { members: 1 }).then(meeting => {
            if (meeting) {
                /* Remove every member from the meeting. After this loop
                 * has concluded, the meeting should no longer exist in
                 * the database. */
                meeting.members.forEach(ppantId => {
                    this.removeParticipant(meetingId, ppantId, conferenceId, vimsudb);
                })

                // Check whether the meeting has been successfully been
                // removed
                return vimsudb.findOneInCollection("meetings_" + conferenceId, { meetingId: meetingId }, { members: 1 }).then(resFirst => {
                    // The loop did for some reason fail to remove
                    // the meeting.
                    if (resFirst) {
                        // So now we remove it manually
                        return vimsudb.deleteOneFromCollection("meetings_" + conferenceId, { meetingId: meetingId }).then(resSecond => {
                            if (resSecond) {
                                console.log("Meeting with id " + meetingId + " was deleted from database.");
                            } else {
                                // Oh no, the manual deleteion failed!
                                // This should honestly never happen.
                                console.log("Meeting with id " + meetingId + " could not be deleted from database.");
                            }
                            return resSecond;
                        })
                    } else {
                        // Meeting has been successfully removed
                        return true;
                    }
                })
            } else {
                // If no meeting with the passed id could be found
                console.log("No meeting with id " + meetingId + " could be found in database.");
                return false;            
            } 
        })
    }
}
