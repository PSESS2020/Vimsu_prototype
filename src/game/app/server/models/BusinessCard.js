const TypeChecker = require('../../client/shared/TypeChecker.js');

/**
 * The Business Card Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class BusinessCard {

    #participantId;
    #username;
    #forename;

    /**
     * Creates an instance of BusinessCard
     * @module BusinessCard
     * 
     * @param {String} participantId participant ID
     * @param {String} username participant username
     * @param {String} forename participant forename
     */
    constructor(participantId, username, forename) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(username);
        TypeChecker.isString(forename);

        this.#participantId = participantId;
        this.#username = username;
        this.#forename = forename;
    }

    /**
     * Gets participant ID
     * @method module:BusinessCard#getParticipantId
     * 
     * @return {String} participantId
     */
    getParticipantId() {
        return this.#participantId;
    }

    /**
     * Gets participant username
     * @method module:BusinessCard#getUsername
     * 
     * @return {String} username
     */
    getUsername() {
        return this.#username;
    }

    /**
     * Gets participant forename
     * @method module:BusinessCard#getForename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }
}