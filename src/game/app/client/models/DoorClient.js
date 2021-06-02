if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
    PositionClient = require('./PositionClient.js');
    TypeOfDoor = require('../shared/TypeOfDoor.js');
}

/**
 * The Door Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DoorClient {

    id;
    typeOfDoor;
    name;
    mapPosition;
    targetRoomId;

    /**
     * Creates an instance of Door on client-side
     * 
     * @param {String} id door ID
     * @param {TypeOfDoor} typeOfDoor type of door
     * @param {String} name door name
     * @param {PositionClient} mapPosition door position
     * @param {number} targetRoomId target room ID
     */
    constructor(doorData) {

        const { id, type, name, cordX, cordY, targetRoomId } = doorData;

        TypeChecker.isString(id);
        TypeChecker.isEnumOf(type, TypeOfDoor);
        TypeChecker.isString(name);
        TypeChecker.isIntAboveEqual(cordX, 0);
        TypeChecker.isIntAboveEqual(cordY, 0);

        if (targetRoomId !== undefined)
            TypeChecker.isNumber(targetRoomId);

        this.id = id;
        this.typeOfDoor = type;
        this.name = name;
        this.mapPosition = new PositionClient(cordX, cordY);
        this.targetRoomId = targetRoomId;
    }

    /**
     * Gets door ID
     * 
     * @return {String} id
     */
    getId() {
        return this.id;
    }

    /**
     * Gets type of door
     * 
     * @return {TypeOfDoor} typeOfDoor
     */
    getTypeOfDoor() {
        return this.typeOfDoor;
    }

    /**
     * Gets door name
     * 
     * @return {String} name
     */
    getName() {
        return this.name;
    }

    /**
     * Gets door position
     * 
     * @return {PositionClient} mapPosition
     */
    getMapPosition() {
        return this.mapPosition;
    }

    /**
     * Gets target room ID
     * 
     * @return {number} targetRoomId
     */
    getTargetRoomId() {
        return this.targetRoomId;
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorClient;
}