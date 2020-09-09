if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
}

/**
 * The NPC Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCClient {

    #id;
    #name;
    #position;
    #direction;

    /**
     * Creates an instance of NPC on client-side
     * 
     * @param {number} id NPC ID
     * @param {String} name NPC name
     * @param {PositionClient} position NPC position
     * @param {Direction} direction NPC avatar direction
     */
    constructor(id, name, position, direction) {
        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isEnumOf(direction, Direction);

        this.#id = id;
        this.#name = name;
        this.#position = position;
        this.#direction = direction;
    }

    /**
     * Gets NPC ID
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets NPC name
     * 
     * @return {String} name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets NPC position
     * 
     * @return {PositionClient} position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets NPC avatar direction
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.#direction;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCClient;
}