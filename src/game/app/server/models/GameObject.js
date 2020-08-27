const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Position = require('./Position.js');

/**
 * The Game Object Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class GameObject {

    #id;
    #name;
    #width;
    #length;
    #position;
    #isSolid;
    #gameObjectType;
    #isClickable;

    /**
     * @constructor Creates a game object instance
     * 
     * @param {number} id game object ID
     * @param {String} name game object name
     * @param {GameObjectType} gameObjectType game object type
     * @param {number} width game object width
     * @param {number} length game object length
     * @param {Position} position game object position
     * @param {boolean} isSolid game object solidity
     * @param {boolean} isClickable game object clickable status
     */
    constructor(id, gameObjectType, name, width, length, position, isSolid, isClickable) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isBoolean(isSolid);
        TypeChecker.isBoolean(isClickable);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
        this.#width = width;
        this.#length = length;

        //Position of left down corner of gameObject
        this.#position = position;
        this.#isSolid = isSolid;
        this.#isClickable = isClickable;
    }

    /**
     * Gets game object id
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
     * Gets game object solidity
     * 
     * @return true if solid, otherwise false
     */
    getSolid() {
        return this.#isSolid;
    }

    /**
     * Gets game object clickable status
     * 
     * @return true if clickable, otherwise false
     */
    getClickable() {
        return this.#isClickable;
    }
}
