const TypeChecker = require('../../client/shared/TypeChecker.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const Position = require('./Position.js');

/**
 * The Game Object Model
 * @module GameObject
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
    #iFrameData;

    /**
     * Creates a game object instance
     * @constructor module:GameObject
     * 
     * @param {number} id game object ID
     * @param {String} name game object name
     * @param {GameObjectType} gameObjectType game object type
     * @param {number} width game object width
     * @param {number} length game object length
     * @param {Position} position game object position
     * @param {boolean} isSolid game object solidity
     * @param {boolean} isClickable game object clickable status
     * @param {?Object} iFrameData iFrame data object if clicking this object opens an external website, otherwise undefined
     * @param {?String} iFrameData.title title of iFrame
     * @param {?String} iFrameData.url URL of iFrame
     * @param {?number} iFrameData.width width of iframe in px
     * @param {?number} iFrameData.height height of iframe in px
     */
    constructor(id, gameObjectType, name, width, length, position, isSolid, isClickable, iFrameData) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isBoolean(isSolid);
        TypeChecker.isBoolean(isClickable);

        if (iFrameData !== undefined) {
            TypeChecker.isInstanceOf(iFrameData, Object);
            TypeChecker.isString(iFrameData.title);
            TypeChecker.isInt(iFrameData.width);
            TypeChecker.isInt(iFrameData.height);
            TypeChecker.isString(iFrameData.url);
        }

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
        this.#width = width;
        this.#length = length;

        //Position of left down corner of gameObject
        this.#position = position;
        this.#isSolid = isSolid;
        this.#isClickable = isClickable;
        this.#iFrameData = iFrameData;
    }

    /**
     * Gets game object id
     * @method module:GameObject#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets game object type
     * @method module:GameObject#getGameObjectType
     * 
     * @return {GameObjectType} gameObjectType
     */
    getGameObjectType() {
        return this.#gameObjectType;
    }

    /**
     * Gets game object name
     * @method module:GameObject#getName
     * 
     * @return {String} name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets game object width
     * @method module:GameObject#getWidth
     * 
     * @return {number} width
     */
    getWidth() {
        return this.#width;
    }

    /**
     * Gets game object length
     * @method module:GameObject#getLength
     * 
     * @return {number} length
     */
    getLength() {
        return this.#length;
    }

    /**
     * Gets game object position
     * @method module:GameObject#getPosition
     * 
     * @return {Position} position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets game object solidity
     * @method module:GameObject#getSolid
     * 
     * @return {boolean} true if solid, otherwise false
     */
    getSolid() {
        return this.#isSolid;
    }

    /**
     * Gets game object clickable status
     * @method module:GameObject#getClickable
     * 
     * @return {boolean} true if clickable, otherwise false
     */
    getClickable() {
        return this.#isClickable;
    }

    /**
     * Gets game object iFrameData if it exists, otherwise undefined
     * @method module:GameObject#getIFrameData
     * 
     * @return {?Object} iFrameData or undefined
     */
    getIFrameData() {
        return this.#iFrameData;
    }
}
