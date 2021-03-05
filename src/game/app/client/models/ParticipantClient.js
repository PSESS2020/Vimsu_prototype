if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
}

/**
 * The Participant Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ParticipantClient {

    #id;
    #position;
    #direction;
    #forename;
    #isVisible;
    #isModerator;

    /**
     * Creates an instance of participant on client-side
     * 
     * @param {String} id participant ID
     * @param {String} forename participant forename
     * @param {PositionClient} position participant position
     * @param {Direction} direction participant avatar direction
     * @param {boolean} isVisible participant avatar visibility
     * @param {boolean} isModerator participant avatar moderator status
     */
    constructor(id, forename, position, direction, isVisible, isModerator) {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isString(forename);
        TypeChecker.isBoolean(isVisible);
        TypeChecker.isBoolean(isModerator);

        this.#id = id;
        this.#position = position;
        this.#direction = direction;
        this.#forename = forename;
        this.#isVisible = isVisible;
        this.#isModerator = isModerator;
    }

    /**
     * Gets participant ID
     * 
     * @return {String} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets participant position
     * 
     * @return {PositionClient} position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets participant moderator status
     * 
     * @return {boolean} true if moderator, otherwise false
     */
    getIsModerator() {
        return this.#isModerator;
    }

    /**
     * Sets moderator status
     * 
     * @param {boolean} isMod moderator status
     */
    setIsModerator(isMod) {
        TypeChecker.isBoolean(isMod);
        this.#isModerator = isMod;
    }

    /**
     * Sets participant position
     * 
     * @param {PositionClient} position position
     */
    setPosition(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    /**
     * Gets participant avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Sets participant avatar direction
     * 
     * @param {Direction} direction direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    /**
     * Gets participant forename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }

    /**
     * Gets participant avatar visibility
     * 
     * @return {boolean} true if avatar is visible, otherwise false
     */
    getIsVisible() {
        return this.#isVisible;
    }

    /**
     * Sets participant avatar visibility
     * 
     * @param {boolean} isVisible 
     */
    setisVisible(isVisible) {
        TypeChecker.isBoolean(isVisible);
        this.#isVisible = isVisible;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ParticipantClient;
}
