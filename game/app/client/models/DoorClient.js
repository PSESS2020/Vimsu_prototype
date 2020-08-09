if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../utils/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    TypeOfDoorClient = require('../utils/TypeOfDoorClient.js');
 }

class DoorClient {

    #id;
    #typeOfDoor;
    #mapPosition;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {TypeOfDoorClient} typeOfDoor
     * @param {PositionClient} mapPosition
     */
    constructor(id, typeOfDoor, mapPosition) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoorClient);
        TypeChecker.isInstanceOf(mapPosition, PositionClient);

        this.#id = id;
        this.#typeOfDoor = typeOfDoor;
        this.#mapPosition = mapPosition;
    }

    getId() {
        return this.#id;
    }
    
    getTypeOfDoor() {
        return this.#typeOfDoor;
    }

    getMapPosition() {
        return this.#mapPosition;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}