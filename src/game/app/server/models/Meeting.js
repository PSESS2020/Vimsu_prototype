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

    #meetingName
    #ownerId
    #settings
    #memberList

    /**
     * 
     * 
     */
    constructor() {

    }

    getMeetingName() {
        return this.#meetingName;
    }

    




}