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

    #meetingId      // The unique id used to identify the meeting and generate the URL
    #meetingName    // The name under which the meeting is displayed in the GUI
    #settings       // additional settings, maybe not necessary
    #memberList     // the 

    /**
     * 
     * 
     */
    constructor() {

    } 

    getId() {
        return this.#meetingId;
    }

    getName() {
        return this.#meetingName;
    }

    




}