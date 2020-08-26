if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    TypeOfDoor = require('../shared/TypeOfDoor.js');
}

class DoorClient {

    #id;
    #typeOfDoor;
    #name;
    #mapPosition;
    #targetRoomId;

    /**
     * @constructor Creates an instance of Door on client-side
     * 
     * @param {number} id door ID
     * @param {TypeOfDoor} typeOfDoor type of door
     * @param {String} name door name
     * @param {PositionClient} mapPosition door position
     * @param {Number} targetRoomId target room ID
     */
    constructor(id, typeOfDoor, name, mapPosition, targetRoomId) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(mapPosition, PositionClient);

        if (targetRoomId !== undefined)
            TypeChecker.isNumber(targetRoomId);

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#name = name;
        this.#mapPosition = mapPosition;
        this.#targetRoomId = targetRoomId;
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
     * Gets door position
     * 
     * @return mapPosition
     */
    getMapPosition() {
        return this.#mapPosition;
    }

    /**
     * Gets target room ID
     * 
     * @return targetRoomId
     */
    getTargetRoomId() {
        return this.#targetRoomId;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}