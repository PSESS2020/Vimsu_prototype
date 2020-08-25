if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    GameObjectType = require('../shared/GameObjectType.js');
}

class GameObjectClient {

    #id;
    #name;
    #width;
    #length;
    #position;
    #gameObjectType;
    #isClickable;

    /**
     * 
     * 
     * @param {number} id 
     * @param {GameObjectType} gameObjectType
     * @param {String} name
     * @param {number} width 
     * @param {number} length 
     * @param {Position} position 
     * @param {boolean} isClickable
     */
    constructor(id, gameObjectType, name, width, length, position, isClickable) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isBoolean(isClickable);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
        this.#width = width;
        this.#length = length;

        //Position of left down corner of gameObject
        this.#position = position;
        this.#isClickable = isClickable;
    }

    getId() {
        return this.#id;
    }

    getGameObjectType() {
        return this.#gameObjectType;
    }

    getName() {
        return this.#name;
    }

    getWidth() {
        return this.#width;
    }

    getLength() {
        return this.#length;
    }

    getPosition() {
        return this.#position;
    }

    isClickable() {
        return this.#isClickable;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}