var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('./Position.js');
const Direction = require('./Direction.js');

module.exports = class Door {

    #id;
    #position;
    #targetPosition;
    #direction;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {Position} position
     * @param {Position} targetPosition 
     * @param {Direction} direction
     */
    constructor(id, position, targetPosition, direction) {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        this.#id = id;
        this.#position = position;
        this.#targetPosition = targetPosition;
        this.#direction = direction;
    }

    getStartingRoomId() {
        return this.#position.getRoomId();
    }

    getTargetRoomId() {
        return this.#targetPosition.getRoomId();
    }

    getStartPosition() {
        return this.#position;
    }

    getTargetPosition() {
        return this.#targetPosition;
    }

    getDirection() {
        return this.#direction;
    }
}