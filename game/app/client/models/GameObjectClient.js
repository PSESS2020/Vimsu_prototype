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
     * @constructor Creates an instance of Game Object on client-side
     * 
     * @param {number} id game object ID
     * @param {GameObjectType} gameObjectType game object type
     * @param {String} name game object name
     * @param {number} width game object width
     * @param {number} length game object length
     * @param {Position} position game object position
     * @param {boolean} isClickable game object clickable status
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

    /**
     * Gets game object ID
     * 
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets game object type
     * 
     * @return gameObjectType
     */
    getGameObjectType() {
        return this.#gameObjectType;
    }

    /**
     * Gets game object name
     * 
     * @return name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets game object width
     * 
     * @return width
     */
    getWidth() {
        return this.#width;
    }

    /**
     * Gets game object length
     * 
     * @return length
     */
    getLength() {
        return this.#length;
    }

    /**
     * Gets game object position
     * 
     * @return position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets game object clickable status
     * 
     * @return true if clickable, otherwise false
     */
    isClickable() {
        return this.#isClickable;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}