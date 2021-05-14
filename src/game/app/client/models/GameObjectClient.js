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
    width;
    length;
    position;
    gameObjectType;
    isClickable;
    isIFrameObject;
    story;
    meetingData;

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
    constructor(id, gameObjectType, name, width, length, position, isClickable, isIFrameObject, story, meetingData) {

        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(gameObjectType, GameObjectType);
        TypeChecker.isString(name);
        TypeChecker.isInt(width);
        TypeChecker.isInt(length);
        TypeChecker.isInstanceOf(position, PositionClient);
        TypeChecker.isBoolean(isClickable);
        TypeChecker.isBoolean(isIFrameObject);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(element => TypeChecker.isString(element));
        
        this.id = id;
        this.gameObjectType = gameObjectType;
        this.name = name;
        this.width = width;
        this.length = length;

        //Position of left down corner of gameObject
        this.position = position;
        this.isClickable = isClickable;
        this.isIFrameObject = isIFrameObject;
        this.meetingData = meetingData;
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
     * Gets game object IFrame status
     * 
     * @return {boolean} true if gameObject is IFrameObject, otherwise false
     */
     getIsIFrameObject() {
        return this.isIFrameObject;
    }

    /**
     * Gets game object story
     * 
     * @returns {String[]} story text message that is displayed on click
     *                     (if clickable)
     */
    getStory() {
        return this.story;
    }

    /**
     * Gets game object meeting data
     * 
     * @returns {Object} Object containing the data of the meeting that will be 
     *                   opened on click.
     */
    getMeetingData() {
        return this.meetingData;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectClient;
}