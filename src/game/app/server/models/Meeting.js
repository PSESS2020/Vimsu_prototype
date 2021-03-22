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
    #URL            // URL under which to find the video-meeting
    #meetingName    // The name under which the meeting is displayed in the GUI
    #settings       // additional settings, maybe not necessary
    #memberIdList     // the 

    /**
     * 
     * 
     */
    constructor(id, name, members) {
        this.#meetingId = id;
        this.#meetingName = name;
        this.#memberIdList = members;
        this.#URL = this.#generateURL(id, name);
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

    getURL() {
        return this.#URL;
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