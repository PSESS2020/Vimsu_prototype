const TypeChecker = require('../../../client/shared/TypeChecker.js');
const Position = require("../Position.js");
const Direction = require('../../../client/shared/Direction.js');
const ShirtColor = require('../../../client/shared/ShirtColor.js');
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

/**
 * The NPC Model
 * @module NPC
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class NPC {

    #id;
    #name;
    #position;
    #direction;
    #story;
    #shirtColor;

    /**
     * Creates an NPC instance
     * @constructor module:NPC
     * 
     * @param {number} id NPC ID
     * @param {String} name NPC name
     * @param {Position} position NPC avatar position
     * @param {Direction} direction NPC avatar direction
     * @param {String[]} story NPC story
     */
    constructor(id, name, position, direction, story) {
        TypeChecker.isInt(id);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isEnumOf(direction, Direction);
        TypeChecker.isInstanceOf(story, Array);
        story.forEach(line => {
            TypeChecker.isString(line);
        });

        this.#id = id;
        this.#name = name;
        this.#position = position;
        this.#direction = direction;
        this.#story = story;
        this.#shirtColor = Settings.DEFAULT_SHIRTCOLOR_NPC;
    }

    /**
     * Gets NPC ID
     * @method module:NPC#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets NPC name
     * @method module:NPC#getName
     * 
     * @return {String} name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets NPC position
     * @method module:NPC#getPosition
     * 
     * @return {Position} position
     */
    getPosition() {
        return this.#position;
    }

    /**
     * Gets NPC direction
     * @method module:NPC#getDirection
     * 
     * @return {Direction} direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Gets NPC story
     * @method module:NPC#getStory
     * 
     * @return {String[]} story
     */
    getStory() {
        return this.#story;
    }

    /**
     * Gets NPC shirt color
     * @method module:NPC#getShirtColor
     * 
     * @return {ShirtColor} shirt color
     */
    getShirtColor() {
        return this.#shirtColor;
    }

    getState() {
        return {
            id: this.getId(),
            name: this.getName(),
            cordX: this.getPosition().getCordX(),
            cordY: this.getPosition().getCordY(),
            direction: this.getDirection(),
            shirtColor: this.getShirtColor()
        }
    }
}