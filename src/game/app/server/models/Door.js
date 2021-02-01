const TypeChecker = require('../../client/shared/TypeChecker.js');
const Position = require('./Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

/**
 * The Door Model
 * @module Door
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
    #isOpen;
    #isOpenFor;

    /**
     * Creates an instance of door
     * @constructor module:Door
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

        //door is open for everbody by default
        this.#isOpen = true;

        //list of ppantIDs, for which the door is explicitly open
        this.#isOpenFor = [];
    }

    /**
     * Gets door ID
     * @method module:Door#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets starting room ID
     * @method module:Door#getStartingRoomId
     * 
     * @return {number} starting room ID
     */
    getStartingRoomId() {
        return this.#mapPosition.getRoomId();
    }

    /**
     * Gets target room ID
     * @method module:Door#getTargetRoomId
     * 
     * @return {number} target room ID if exists, otherwise undefined
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
     * @method module:Door#getTypeOfDoor
     * 
     * @return {TypeOfDoor} typeOfDoor
     */
    getTypeOfDoor() {
        return this.#typeOfDoor;
    }

    /**
     * Gets door name
     * @method module:Door#getName
     * 
     * @return {String} name
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets map position
     * @method module:Door#getMapPosition
     * 
     * @return {Position} mapPosition
     */
    getMapPosition() {
        return this.#mapPosition;
    }

    /**
     * Gets enter position without clicking the door
     * @method module:Door#getEnterPositionWithoutClick
     * 
     * @return {Position} enterPosition
     */
    getEnterPositionWithoutClick() {
        return this.#enterPositionWithoutClick;
    }

    /**
     * Gets enter positions
     * @method module:Door#getEnterPositions
     * 
     * @return {Position[]} enterPositions
     */
    getEnterPositions() {
        return this.#enterPositions;
    }

    /**
     * Gets avatar position on entering the door
     * @method module:Door#getTargetPosition
     * 
     * @return {Position|undefined} targetPosition if exists, otherwise undefined
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
     * @method module:Door#getDirection
     * 
     * @return {Direction|undefined} direction if exists, otherwise undefined
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
     * @method module:Door#isValidEnterPosition
     * 
     * @param {Position} position avatar's current position
     * 
     * @return {boolean} true if valid, otherwise false
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
     * @method module:Door#isValidEnterPositionWithoutClick
     * 
     * @param {Position} position avatar's current position
     * @param {Direction} oldDirection avatar's old direction
     * @param {Direction} newDirection avatar's new direction
     * 
     * @return {boolean} true if valid, otherwise false
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

    /**
     * Checks if door is open for everybody
     * @method module:Door#isOpen
     * 
     * @return {boolean} true if open, false if closed
     */
    isOpen() {
        return this.#isOpen;
    }

    /**
     * Checks if door is open for the ppant with this ppantID
     * @method module:Door#isOpenFor
     * 
     * @param {String} ppantID 
     * 
     * @return {boolean} true if open, false if closed
     */
    isOpenFor(ppantID) {
        TypeChecker.isString(ppantID);

        return (this.#isOpen || this.#isOpenFor.includes(ppantID));
    }

    /**
     * Close Door for everybody
     * @method module:Door#closeDoor
     */
    closeDoor() {
        this.#isOpen = false;
    }
    
    /**
     * Open Door for everybody
     * @method module:Door#openDoor
     */
    openDoor() {
        this.#isOpen = true;
    }

    /**
     * Close Door for ppant with this ppantID
     * @method module:Door#closeDoorFor
     * 
     * @param {String} ppantID 
     * 
     */
    closeDoorFor(ppantID) {
        TypeChecker.isString(ppantID);

        this.#isOpenFor.forEach(id => {
            if (id === ppantID) {
                let index = this.#isOpenFor.indexOf(ppantID);
                this.#isOpenFor.splice(index, 1);
            }
        });
    }
    
    /**
     * Open Door for ppant with this ppantID
     * @method module:Door#openDoorFor
     * 
     * @param {String} ppantID
     */
    openDoorFor(ppantID) {
        TypeChecker.isString(ppantID);

        if (!this.#isOpenFor.includes(ppantID)) {
            this.#isOpenFor.push(ppantID);
        }
    }
}
