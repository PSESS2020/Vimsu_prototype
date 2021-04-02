const ShirtColor = require("../../client/shared/ShirtColor.js");
const TypeChecker = require("../../client/shared/TypeChecker.js");
const GroupChat = require("../models/GroupChat.js");

/**
 * The Group Model
 * @module Group
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Group {

    #name;
    #shirtColor;
    #groupMemberIDs;
    #groupChat;
    #meeting

    /* TODO: Meeting functionality is still missing */


    /**
    * Creates a group instance
     * @constructor module:Group
     * 
     * @param {String} name unique name of this group
     * @param {ShirtColor} shirtColor shirtColor every group member wears
     * @param {String[]} groupMemberIDs array of starting group member IDs
     * @param {GroupChat} groupChat chat of this group
     */
    constructor(name, shirtColor, groupMemberIDs, groupChat) {
        TypeChecker.isString(name);
        TypeChecker.isEnumOf(shirtColor, ShirtColor);
        TypeChecker.isInstanceOf(groupMemberIDs, Array);
        groupMemberIDs.forEach(groupMemberID => {
            TypeChecker.isString(groupMemberID);
        });
        TypeChecker.isInstanceOf(groupChat, GroupChat)

        this.#name = name;
        this.#shirtColor = shirtColor;
        this.#groupMemberIDs = groupMemberIDs;
        this.#groupChat = groupChat;
    }

    /**
     * Gets unique group name
     * @method module:Group#getName
     * 
     * @return {String} name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets group shirt color
     * @method module:Group#getShirtColor
     * 
     * @return {ShirtColor} shirtColor
     */
    getShirtColor() {
        return this.#shirtColor;
    }

    /**
     * Gets group member IDs
     * @method module:Group#getGroupMemberIDs
     * 
     * @return {String[]} groupMemberIDs
     */
    getGroupMemberIDs() {
        return this.#groupMemberIDs;
    }

    /**
     * Gets group chat
     * @method module:Group#getGroupChat
     * 
     * @return {GroupChat} groupChat
     */
     getGroupChat() {
        return this.#groupChat;
    }

    /**
     * Gets the meeting belonging to the group.
     * @method module:Group#getMeeting
     * 
     * @returns {Meeting} 
     */
    getMeeting() {
        return this.#meeting;
    }

    /**
     * Sets the meeting belonging to the Group-instance to the passed
     * meeting-instance.
     * @method module:Group#setMeeting
     * 
     * @param {Meeting} meeting 
     */
    setMeeting(meeting) {
        this.#meeting = meeting;
    }

    /**
     * Adds ppantID to groupMemberIDs
     * @method module:Group#addGroupMember
     * 
     * @param {String} ppantID participantID
     */
    addGroupMember(ppantID) {
        TypeChecker.isString(ppantID);

        if (!this.#groupMemberIDs.includes(ppantID)) {
            this.#groupMemberIDs.push(ppantID);
            this.#groupChat.addParticipant(ppantID);
        }
    }

    /**
     * Removes ppantID from groupMemberIDs
     * @method module:Group#removeGroupMember
     * 
     * @param {String} ppantID participantID
     */
    removeGroupMember(ppantID) {
        TypeChecker.isString(ppantID);

        let index = this.#groupMemberIDs.indexOf(ppantID);

        if (index !== -1)
            this.#groupMemberIDs.splice(index, 1);     
            
        this.#groupChat.removeParticipant(ppantID);
    }

    /**
     * Checks if ppant with ppantID is currently in this group
     * @method module:Group#includesGroupMember
     * 
     * @param {String} ppantID participant ID
     * @return {boolean} true if ppant is group member, false otherwise
     */
    includesGroupMember(ppantID) {
        TypeChecker.isString(ppantID);

        for (let i = 0; i < this.#groupMemberIDs.length; i++) { 
            if (this.#groupMemberIDs[i] === ppantID) {
                return true;
            }
        }
        return false;
    }
}