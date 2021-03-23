const TypeChecker = require('../../client/shared/TypeChecker.js');

/**
 * The Meeting Model
 * @module Meeting
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 * 
 * 
 */
module.exports = class Meeting{

    #meetingId      // The unique id used to identify the meeting with
    #meetingName    // The name under which the meeting is displayed in the
                    // GUI
    #password       // the "password" used to join the meeting
    #memberIdList   // the list of id of members of the meeting

    /**
     * 
     * 
     */
    constructor(id, name, members, password) {
        this.#meetingId = id;
        this.#meetingName = name;
        this.#memberIdList = members;
        this.#password = password;
    } 

    /**
     * Simple getter.
     * @method module:Meeting#getId
     * 
     * @returns {String} The id of this meeting
     */
    getId() {
        return this.#meetingId;
    }

    /**
     * Simple getter.
     * @method module:Meeting#getName
     * 
     * @returns {String} The name of this meeting
     */
    getName() {
        return this.#meetingName;
    }

    /**
     * Simple getter.
     * @method module:Meeting#getMemberIdList
     * 
     * @returns {String[]} The ppantIDs of all members of this meeting
     */
    getMemberIdList() {
        return this.#memberIdList;
    }

    /**
     * Simple getter.
     * @method module:Meeting#getPassword
     * 
     * @returns {String} The password of this meeting
     */
    getPassword() {
        return this.#password;
    }

    /**
     * Adds the passed ppantId to the memberIdList
     * @method module:Meeting#addMember
     * 
     * @param {String} ppantId 
     */
    addMember(ppantId) {
        TypeChecker.isString(ppantId);
        this.#memberIdList.push(ppantId);
    }

    /**
     * Removes the passed ppantId from the memberIdList,
     * if it is present.
     * @method module:Meeting#removeMember
     * 
     * @param {String} ppantId
     * @returns {Boolean} Whether the operation was successful or not 
     */
    removeMember(ppantId) {
        TypeChecker.isString(ppantId);
        this.#memberIdList.forEach(memberId => {
            if (memberId === ppantId) {
                let index = this.#memberIdList.indexOf(memberId);
                this.#memberIdList.splice(index, 1);
                return true;
            }
        });
        return false;
    }

}