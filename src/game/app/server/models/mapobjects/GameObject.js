const TypeChecker = require('../../../client/shared/TypeChecker.js');
const GameObjectType = require('../../../client/shared/GameObjectType.js');
const Position = require('../Position.js');
const OnClickDataParent = require('../onclickdatatypes/OnClickDataParent.js');

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
    #offset;
    #width;
    #length;
    #position;
    #isSolid;
    #gameObjectType;
    #isClickable;
    #onClickData;

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
     * @param {?Object} onClickData
     * TODO add more precise documentation on properties, contents
     * and variations of onClickData-object
     * TODO note: onClickData needs to posess getData-method
     *      is this a good idea? Maybe better to create different classes
     *      for the different types of data, as different kinds of data
     *      also require different kind of client side handling...
     */
    constructor(id, gameObjectType, name, offset, width, length, position, isSolid, isClickable, onClickData) {

        const { x, y } = offset

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(x); TypeChecker.isInt(y);
        TypeChecker.isIntAboveZero(width);
        TypeChecker.isIntAboveZero(length);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isBoolean(isSolid);
        TypeChecker.isBoolean(isClickable);
        TypeChecker.isInstanceOf(onClickData, OnClickDataParent);

        this.#id = id;
        this.#gameObjectType = gameObjectType;
        this.#name = name;
        this.#offset = offset;
        this.#width = width;
        this.#length = length;

        //Position of left down corner of gameObject
        this.#position = position;
        this.#isSolid = isSolid;
        this.#isClickable = isClickable;
        this.#onClickData = onClickData;
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
     * Gets the data of the onclick
     */
    getOnClickData() {
        return this.#onClickData.getData();
    }

    getIFrameData() {
        if ( 'getIFrameData' in this.#onClickData ) { return this.#onClickData.getIFrameData() }
        else { throw new Error("Tried to call getIFrameData() on none-IFrame GameObject instance. Please report this error to the developers.") }
    }

    /**
     * 
     * @returns {Object} An unchangeable object containing all information
     *                   about the current state of the object
     */
    getState() {
        return {
            id: this.#id,
            type: this.#gameObjectType,
            name: this.#name,
            offset: this.#offset,
            width: this.#width,
            length: this.#length,
            cordX: this.getPosition().getCordX(),
            cordY: this.getPosition().getCordY(),
            isClickable: this.#isClickable,
            onClickData: {...this.getOnClickData()}
        }
    }
}
