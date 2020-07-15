var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('./Position.js');

module.exports = class Door {

    #id;
    #position;
    #targetPosition;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {Position} position
     * @param {Position} targetPosition 
     */
    constructor(id, position, targetPosition) {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(targetPosition, Position);

        this.#id = id;
        this.#position = position;
        this.#targetPosition = targetPosition;
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
}