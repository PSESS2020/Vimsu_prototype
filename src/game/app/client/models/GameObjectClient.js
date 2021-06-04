if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    GameObjectType = require('../shared/GameObjectType.js');
}

/**
 * The Game Object Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectClient {

    id;
    name;
    offset;
    width;
    length;
    position;
    gameObjectType;
    isClickable;
    onClickData;

    /**
     * Creates an instance of Game Object on client-side
     * 
     * @param {number} id game object ID
     * @param {GameObjectType} gameObjectType game object type
     * @param {String} name game object name
     * @param {number} width game object width
     * @param {number} length game object length
     * @param {PositionClient} position game object position
     * @param {boolean} isClickable game object clickable status
     * @param {boolean} isIFrameObject true if object is an IFrameObject, false otherwise
     * @param {String[]} story text message that is displayed on click
     *                         (if clickable)
     * @param {Object} meetingData Object containing the data of the meeting
     *                             that will be opened on click.
     */
    constructor(data) {

        const { id, type, name, offset, width, length, cordX, cordY, isClickable, onClickData } = data

        TypeChecker.isInt(id);
        // This can't actually be checked here, as it would make
        // object creation more difficult
        // TypeChecker.isEnumOf(type, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isOffset(offset);
        TypeChecker.isIntAboveZero(width);
        TypeChecker.isIntAboveZero(length);
        TypeChecker.isIntAboveEqual(cordX, 0);
        TypeChecker.isIntAboveEqual(cordY, 0);
        TypeChecker.isBoolean(isClickable);
        // TODO type checking for onClickData
        
        this.id = id;
        this.gameObjectType = type;
        this.name = name;
        this.offset = offset;
        this.width = width;
        this.length = length;

        //Position of left down corner of gameObject
        this.position = new PositionClient(cordX, cordY);
        this.isClickable = isClickable;
        this.onClickData = onClickData;
    }

    /**
     * Gets game object ID
     * 
     * @return {number} id
     */
    getId() {
        return this.id;
    }

    /**
     * Gets game object type
     * 
     * @return {GameObjectType} gameObjectType
     */
    getGameObjectType() {
        return this.gameObjectType;
    }

    /**
     * Gets game object name
     * 
     * @return {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * Gets game object width
     * 
     * @return {number} width
     */
    getWidth() {
        return this.width;
    }

    /**
     * Gets game object length
     * 
     * @return {number} length
     */
    getLength() {
        return this.length;
    }

    /**
     * Gets game object position
     * 
     * @return {PositionClient} position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Gets game object clickable status
     * 
     * @return {boolean} true if clickable, otherwise false
     */
    getIsClickable() {
        return this.isClickable;
    }

    /**
     * Gets game object onClickData
     * 
     * @return {Object} object containing the data needed to
     *                  properly handle a (clickable) object
     *                  being clicked.
     */
     getOnClickData() {
        return this.onClickData;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}