if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    Direction = require('../shared/Direction.js');
}

class NPCClient {

    #id;
    #name;
    #position;
    #direction;

    /**
     * 
     * @param {int} id 
     * @param {String} name 
     * @param {Position} position 
     * @param {Direction} direction
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

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getPosition() {
        return this.#position;
    }

    getDirection() {
        return this.#direction;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCClient;
}