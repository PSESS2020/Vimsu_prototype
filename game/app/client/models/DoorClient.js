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
    #isClickable;
    #targetRoomId;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {TypeOfDoor} typeOfDoor
     * @param {String} name
     * @param {PositionClient} mapPosition
     * @param {boolean} isClickable
     * @param {Number} targetRoomId
     */
    constructor(id, typeOfDoor, name, mapPosition, isClickable, targetRoomId) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(mapPosition, PositionClient);
        TypeChecker.isBoolean(isClickable);

        if (targetRoomId !== undefined)
            TypeChecker.isNumber(targetRoomId);

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#name = name;
        this.#mapPosition = mapPosition;
        this.#isClickable = isClickable;
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

    isClickable() {
        return this.#isClickable;
    }

    getTargetRoomId() {
        return this.#targetRoomId;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}