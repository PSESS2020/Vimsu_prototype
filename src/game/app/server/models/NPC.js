const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require("./Position.js");
const Direction = require('../../client/shared/Direction.js');

/**
 * The NPC Model
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

    /**
     * @constructor Creates an NPC instance
     * 
     * @param {number} id NPC ID
     * @param {String} name NPC name
     * @param {Position} position NPC avatar position
     * @param {Direction} direction NPC avatar direction
     * @param {String} story NPC story
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
     * Gets NPC direction
     * 
     * @return direction
     */
    getDirection() {
        return this.#direction;
    }

    /**
     * Gets NPC story
     * 
     * @return story
     */
    getStory() {
        return this.#story;
    }
}