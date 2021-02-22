if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
}

/**
 * The Business Card Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class BusinessCardClient {

    #participantId;
    #username;
    #forename;

    /**
     * Creates an instance of Business Card on client-side
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
     * 
     * @return {String} participantId
     */
    getParticipantId() {
        return this.#participantId;
    }

    /**
     * Gets participant username
     * 
     * @return {String} username
     */
    getUsername() {
        return this.#username;
    }

    /**
     * Gets participant forename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = BusinessCardClient;
}