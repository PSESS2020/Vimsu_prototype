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

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {TypeOfDoor} typeOfDoor
     * @param {String} name
     * @param {PositionClient} mapPosition
     * @param {boolean} isClickable
     */
    constructor(id, typeOfDoor, name, mapPosition, isClickable) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
        TypeChecker.isString(name);
        TypeChecker.isInstanceOf(mapPosition, PositionClient);
        TypeChecker.isBoolean(isClickable);

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#name = name;
        this.#mapPosition = mapPosition;
        this.#isClickable = isClickable;

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

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}