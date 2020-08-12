if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    TypeOfDoor = require('../shared/TypeOfDoor.js');
 }

class DoorClient {

    #id;
    #typeOfDoor;
    #mapPosition;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {TypeOfDoor} typeOfDoor
     * @param {PositionClient} mapPosition
     */
    constructor(id, typeOfDoor, mapPosition) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor);
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