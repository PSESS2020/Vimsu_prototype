const TypeChecker = require('../../client/shared/TypeChecker.js');
const Group = require('../models/Group.js');
const GroupChat = require('../models/GroupChat.js');
const ShirtColor = require('../../client/shared/ShirtColor.js');
const ChatService = require('./ChatService.js');
const db = require('../../../../config/db.js');
const MeetingService = require('./MeetingService.js');
const Meeting = require('../models/Meeting.js');

/**
 * The Group Service
 * @module GroupService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 module.exports = class GroupService {

    /**
     * Returns map from groupName to groupInstance for conference with passed conferenceId
     * @static @method module:GroupService#getGroupMap
     * 
     * @param {String} conferenceId 
     * @param {db} vimsudb 
     * 
     * @returns {Map} map from groupName to group
     */
     static getGroupMap(conferenceId, vimsudb) {
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findAllInCollection("groups_" + conferenceId).then(async groups => {
            var groupMap = new Map();

            await groups.forEach(group => {
                return ChatService.loadChat(group.groupChatID, conferenceId, vimsudb).then(groupChat => {
                    return MeetingService.loadMeeting(group.groupMeetingID, conferenceId, vimsudb).then(groupMeeting => {
                        groupMap.set(group.groupName, new Group(group.groupName, group.groupColor, group.memberIDs, groupChat, groupMeeting));
                    });                    
                });
            });

            return groupMap;
        });
    }

    /**
     * creates a new group instance and saves it in the database
     * @static @method module:ChatService#createGroup
     * 
     * @param {String} groupName group name
     * @param {ShirtColor} groupColor group color
     * @param {String[]} memberIDs memberIDs
     * @param {GroupChat} groupChat chat of group
     * @param {Meeting} groupMeeting meeting of group
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {Group} Group instance
     */
    static createGroup(groupName, groupColor, memberIDs, groupChat, groupMeeting, conferenceId, vimsudb) {
        TypeChecker.isString(groupName);
        TypeChecker.isEnumOf(groupColor, ShirtColor);
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(memberID => {
            TypeChecker.isString(memberID);
        });
        TypeChecker.isInstanceOf(groupChat, GroupChat)
        TypeChecker.isInstanceOf(groupMeeting, Meeting)
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        var group = {
            groupName: groupName,
            groupColor: groupColor,
            memberIDs: memberIDs, 
            groupChatID: groupChat.getId(),
            groupMeetingID: groupMeeting.getId()
        }

        return vimsudb.insertOneToCollection("groups_" + conferenceId, group).then(res => {
            console.log("group saved in DB");
            return new Group(groupName, groupColor, memberIDs, groupChat, groupMeeting);

        })
    }

    /**
     * deletes group from database
     * @static @method module:ChatService#deleteGroup
     * 
     * @param {String} groupName group name
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if deleted successfully, otherwise false
     */
     static deleteGroup(groupName, conferenceId, vimsudb) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("groups_" + conferenceId, { groupName: groupName }).then(res => {
            console.log("group with groupName " + groupName + " deleted");
            return res;
        })
    }

    /**
     * adds group member to group in database
     * @static @method module:ChatService#addGroupMember
     * 
     * @param {String} groupName group name
     * @param {String} memberID ID of new member
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if inserted successfully, otherwise false
     */
     static addGroupMember(groupName, memberID, conferenceId, vimsudb) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(memberID);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        // TODO: add member to meeting

        return vimsudb.insertToArrayInCollection("groups_" + conferenceId, { groupName: groupName }, { memberIDs: memberID }).then(res => {
            return res;
        })
    }

    /**
     * removes group member from group in database
     * @static @method module:ChatService#removeGroupMember
     * 
     * @param {String} groupName group name
     * @param {String} memberID ID of new member
     * @param {String} conferenceId conference ID
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if deleted successfully, otherwise false
     */
    static removeGroupMember(groupName, memberID, conferenceId, vimsudb) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(memberID);
        TypeChecker.isString(conferenceId);
        TypeChecker.isInstanceOf(vimsudb, db);

        // TODO remove member from meeting

        return vimsudb.deleteFromArrayInCollection("groups_" + conferenceId, { groupName: groupName }, { memberIDs: memberID }).then(res => {

            //check if this group still has a member, if not, delete it
            return vimsudb.findOneInCollection("groups_" + conferenceId, { groupName: groupName }).then(group => {
                if (group.memberIDs.length < 1) {
                    this.deleteGroup(groupName, conferenceId, vimsudb);
                }
                return res;
            })
        })
    }
 }