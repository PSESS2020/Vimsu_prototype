if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
    ShirtColor = require('../shared/ShirtColor.js');
}

/**
 * The Participant Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ParticipantClient {

    id;
    position;
    direction;
    displayName;
    isVisible;
    isModerator;
    shirtColor;

    /**
     * Creates an instance of participant on client-side
     * 
     * @param {String} id participant ID
     * @param {String} displayName name that is displayed above avatar
     * @param {PositionClient} position participant position
     * @param {Direction} direction participant avatar direction
     * @param {boolean} isVisible participant avatar visibility
     * @param {boolean} isModerator participant avatar moderator status
     * @param {ShirtColor} shirtColor participant avatar shirt color
     */
    constructor(id, displayName, position, direction, isVisible, isModerator, shirtColor) {
        TypeChecker.isString(id);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isString(displayName);
        TypeChecker.isBoolean(isVisible);
        TypeChecker.isBoolean(isModerator);
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.id = id;
        this.position = position;
        this.direction = direction;
        this.displayName = displayName;
        this.isVisible = isVisible;
        this.isModerator = isModerator;
        this.shirtColor = shirtColor;
    }

    /**
     * Gets participant ID
     * 
     * @return {String} id
     */
    getId() {
        return this.id;
    }

    /**
     * Gets participant position
     * 
     * @return {PositionClient} position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Gets participant moderator status
     * 
     * @return {boolean} true if moderator, otherwise false
     */
    getIsModerator() {
        return this.isModerator;
    }

    /**
     * Sets moderator status
     * 
     * @param {boolean} isMod moderator status
     */
    setIsModerator(isMod) {
        TypeChecker.isBoolean(isMod);
        this.isModerator = isMod;
    }

    /**
     * Sets participant position
     * 
     * @param {PositionClient} position position
     */
    setPosition(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.position = position;
    }

    /**
     * Gets participant avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.direction;
    }

    /**
     * Sets participant avatar direction
     * 
     * @param {Direction} direction direction
     */
    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.direction = direction;
    }

    /**
     * Gets participant display name
     * 
     * @return {String} displayName
     */
    getDisplayName() {
        return this.displayName;
    }

    /**
     * Gets participant avatar visibility
     * 
     * @return {boolean} true if avatar is visible, otherwise false
     */
    getIsVisible() {
        return this.isVisible;
    }

    /**
     * Sets participant avatar visibility
     * 
     * @param {boolean} isVisible 
     */
    setIsVisible(isVisible) {
        TypeChecker.isBoolean(isVisible);
        this.isVisible = isVisible;
    }

    /**
     * Gets avatar shirt color
     * 
     * @return {ShirtColor} shirt color
     */
    getShirtColor() {
        return this.shirtColor;
    }

    /**
     * Sets avatar shirt color
     * 
     * @param {ShirtColor} shirtColor new shirt color
     */
    setShirtColor(shirtColor) {
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.shirtColor = shirtColor;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ParticipantClient;
}
