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
     * 
     * @param {int} id 
     * @param {TypeOfDoor} typeOfDoor
     * @param {String} name
     * @param {PositionClient} mapPosition
     * @param {Number} targetRoomId
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

    getId() {
        return this.#id;
    }

    getTypeOfDoor() {
        return this.#typeOfDoor;
    }

    getName() {
        return this.#name;
    }

    getMapPosition() {
        return this.#mapPosition;
    }

    getTargetRoomId() {
        return this.#targetRoomId;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}