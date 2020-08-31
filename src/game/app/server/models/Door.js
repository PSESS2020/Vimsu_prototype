const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require('./Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

/**
 * The Door Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Door {

    #id;
    #typeOfDoor;
    #name;
    #mapPosition;
    #enterPositionWithoutClick;
    #enterPositions;
    #targetPosition;
    #direction;

    /**
     * @constructor Creates a door instance
     * 
     * @param {number} id door ID
     * @param {String} name door name
     * @param {TypeOfDoor} typeOfDoor type of door
     * @param {Position} mapPosition door position on the map
     * @param {Object} enterPosition door valid enter position from the map without clicking the door
     * @param {Position[]} enterPositions door valid enter positions from the map
     * @param {Position} targetPosition avatar position on entering the door
     * @param {Direction} direction avatar direction on entering the door
     */
    constructor(id, typeOfDoor, name, mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(enterPositionWithoutClick.position, Position);
        TypeChecker.isEnumOf(enterPositionWithoutClick.direction, Direction);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(enterPosition => {
            TypeChecker.isInstanceOf(enterPosition, Position);
        });

        //these 2 arguments are only defined when door is not a lecture door
        if (typeOfDoor !== TypeOfDoor.LECTURE_DOOR) {
            TypeChecker.isInstanceOf(targetPosition, Position);
            TypeChecker.isEnumOf(direction, Direction);
        }

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#name = name;
        this.#mapPosition = mapPosition;
        this.#enterPositionWithoutClick = enterPositionWithoutClick;
        this.#enterPositions = enterPositions;
        this.#targetPosition = targetPosition;
        this.#direction = direction;
    }

    /**
     * Gets door ID
     * 
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets starting room ID
     * 
     * @return starting room ID
     */
    getStartingRoomId() {
        return this.#mapPosition.getRoomId();
    }

    /**
     * Gets target room ID
     * 
     * @return target room ID if exists, otherwise undefined
     */
    getTargetRoomId() {
        if (this.#targetPosition) {
            return this.#targetPosition.getRoomId();
        } else {
            return undefined;
        }
    }

    /**
     * Gets type of door
     * 
     * @return typeOfDoor
     */
    getTypeOfDoor() {
        return this.#typeOfDoor;
    }

    /**
     * Gets door name
     * 
     * @return name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets map position
     * 
     * @return mapPosition
     */
    getMapPosition() {
        return this.#mapPosition;
    }

    /**
     * Gets enter position without clicking the door
     * 
     * @return enterPosition
     */
    getEnterPositionWithoutClick() {
        return this.#enterPositionWithoutClick;
    }

    /**
     * Gets enter positions
     * 
     * @return enterPositions
     */
    getEnterPositions() {
        return this.#enterPositions;
    }

    /**
     * Gets avatar position on entering the door
     * 
     * @return targetPosition if exists, otherwise undefined
     */
    getTargetPosition() {
        if (this.#targetPosition) {
            return this.#targetPosition;
        } else {
            return undefined;
        }
    }

    /**
     * Gets avatar direction on entering the door
     * 
     * @return direction if exists, otherwise undefined
     */
    getDirection() {
        if (this.#direction) {
            return this.#direction;
        } else {
            return undefined;
        }
    }

    /**
     * Checks if position is a valid enter position for this door
     * 
     * @param {Position} position avatar's current position
     * 
     * @return true if valid, otherwise false
     */
    isValidEnterPosition(position) {
        TypeChecker.isInstanceOf(position, Position);

        for (var i = 0; i < this.#enterPositions.length; i++) {
            if (position.getRoomId() === this.#enterPositions[i].getRoomId() &&
                position.getCordX() === this.#enterPositions[i].getCordX() &&
                position.getCordY() === this.#enterPositions[i].getCordY()){
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if position is a valid enter position for this door without clicking it
     * 
     * @param {Position} position avatar's current position
     * @param {Direction} oldDirection avatar's old direction
     * @param {Direction} newDirection avatar's new direction
     * 
     * @return true if valid, otherwise false
     */
    isValidEnterPositionWithoutClick(position, oldDirection, newDirection) {
        TypeChecker.isInstanceOf(position, Position);
        TypeChecker.isEnumOf(oldDirection, Direction);
        TypeChecker.isEnumOf(newDirection, Direction);

        if (position.getRoomId() === this.#enterPositionWithoutClick.position.getRoomId() &&
                position.getCordX() === this.#enterPositionWithoutClick.position.getCordX() &&
                position.getCordY() === this.#enterPositionWithoutClick.position.getCordY() &&
                oldDirection === this.#enterPositionWithoutClick.direction &&
                newDirection === this.#enterPositionWithoutClick.direction){
                return true;
        }
        return false;
    }
}
