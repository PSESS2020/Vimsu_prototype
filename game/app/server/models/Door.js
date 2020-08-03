var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('./Position.js');
const Direction = require('../../utils/Direction.js');

module.exports = class Door {

    #id;
    #enterPositions;
    #targetPosition;
    #direction;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {Array of Position} enterPositions
     * @param {Position} targetPosition 
     * @param {Direction} direction
     */
    constructor(id, enterPositions, targetPosition, direction) {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(enterPosition => {
            TypeChecker.isInstanceOf(enterPosition, Position);
        });
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        this.#id = id;
        this.#enterPositions = enterPositions;
        this.#targetPosition = targetPosition;
        this.#direction = direction;
    }

    getStartingRoomId() {
        return this.#enterPositions[0].getRoomId();
    }

    getTargetRoomId() {
        return this.#targetPosition.getRoomId();
    }

    getEnterPositions() {
        return this.#enterPositions;
    }

    getTargetPosition() {
        return this.#targetPosition;
    }

    getDirection() {
        return this.#direction;
    }

    /**
     * Checks if position is a valid enter position for this door
     * 
     * @param {Position} position 
     */
    isValidEnterPosition(position) {
        TypeChecker.isInstanceOf(position, Position);

        for (var i = 0; i < this.#enterPositions.length; i++) {
            if (position.getRoomId() === this.#enterPositions[i].getRoomId() &&
                position.getCordX() === this.#enterPositions[i].getCordX() &&
                position.getCordY() === this.#enterPositions[i].getCordY()) {
                return true;
            }
        }
        return false;  
    }
}