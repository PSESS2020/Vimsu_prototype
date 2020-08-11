const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require("./Position.js");
const Direction = require('../../utils/Direction.js');

module.exports = class NPC {

    #id;
    #name;
    #position;
    #direction;
    #story;

    /**
     * Only is called by the NPCService to create a NPC instance
     * 
     * @author Philipp
     * @param {int} id 
     * @param {String} name 
     * @param {Position} position 
     * @param {Direction} direction
     * @param {String} story 
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

    getStory() {
        return this.#story;
    }
}