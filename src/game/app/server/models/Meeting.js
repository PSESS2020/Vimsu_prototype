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

    #meetingId      
    #meetingName    
    #password       
    #memberIdList   

    /**
     * Creates an Meeting instance
     * @constructor module:Meeting
     * 
     * @param {String} id The unique id used to identify the meeting with
     * @param {String} name The name under which the meeting is displayed in the GUI
     * @param {String[]} memberIDs the list of id of members of the meeting
     * @param {String} password the "password" used to join the meeting
     */
    constructor(id, name, memberIDs, password) {
        TypeChecker.isString(id);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(memberID => {
            TypeChecker.isString(memberID);
        })
        TypeChecker.isString(password);

        this.#meetingId = id;
        this.#meetingName = name;
        this.#memberIdList = memberIDs;
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
     * @returns {Boolean} Whether the operation was successful or not 
     */
    addMember(ppantId) {
        TypeChecker.isString(ppantId);
        if(!this.#memberIdList.includes(ppantId)) {
            this.#memberIdList.push(ppantId);
            return true;
        }
        return false;
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

    /**
     * Checks if ppant with ppantID is currently in this meeting
     * @method module:Meeting#includesMember
     * 
     * @param {String} ppantID participant ID
     * @return {boolean} true if ppant is meeting member, false otherwise
     */
    includesMember(ppantID) {
        TypeChecker.isString(ppantID);

        return this.#memberIdList.includes(ppantID);
    }
}