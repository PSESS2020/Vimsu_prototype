if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
    ShirtColor = require('../shared/ShirtColor.js');
}

/**
 * The NPC Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCClient {

    id;
    name;
    position;
    direction;
    shirtColor;

    /**
     * Creates an instance of NPC on client-side
     * 
     * @param {number} id NPC ID
     * @param {String} name NPC name
     * @param {PositionClient} position NPC position
     * @param {Direction} direction NPC avatar direction
     * @param {ShirtColor} shirtColor NPC shirt color
     */
    constructor(npcData) {

        const { id, name, cordX, cordY, direction, shirtColor } = npcData

        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isInt(cordX);
        TypeChecker.isInt(cordY);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isEnumOf(shirtColor, ShirtColor);

        this.id = id;
        this.name = name;
        this.position = new PositionClient(cordX, cordY);
        this.direction = direction;
        this.shirtColor = shirtColor;
    }

    /**
     * Gets NPC ID
     * 
     * @return {number} id
     */
    getId() {
        return this.id;
    }

    /**
     * Gets NPC name
     * 
     * @return {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * Gets NPC position
     * 
     * @return {PositionClient} position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Gets NPC avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.direction;
    }

    /**
     * Gets NPC shirt color
     * 
     * @return {ShirtColor} shirt color
     */
    getShirtColor() {
        return this.shirtColor;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCClient;
}