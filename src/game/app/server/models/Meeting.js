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

    getId() {
        return this.#meetingId;
    }

    getName() {
        return this.#meetingName;
    }

    getMemberIdList() {
        return this.#memberIdList;
    }

    getPassword() {
        return this.#password;
    }

    addMember(ppantId) {
        TypeChecker.isString(ppantId);
        this.#memberIdList.push(ppantId);
    }

    removeMember(ppantId) {
        TypeChecker.isString(ppantId);
        this.#memberIdList.forEach(memberId => {
            if (memberId === ppantId) {
                let index = this.#memberIdList.indexOf(memberId);
                this.#memberIdList.splice(index, 1);
            }
        });
    }

    #generateURL = function(id, name) {
        // TODO
    }




}