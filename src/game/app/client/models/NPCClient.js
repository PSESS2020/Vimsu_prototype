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
     * @constructor NPCClient
     * 
     * @param {number} id NPC ID
     * @param {String} name NPC name
     * @param {Position} position NPC position
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
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets NPC name
     * 
     * @return name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets NPC position
     * 
     * @return position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets NPC avatar direction
     * 
     * @return direction
     */
    getDirection() {
        return this.#direction;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCClient;
}