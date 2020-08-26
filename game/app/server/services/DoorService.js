const TypeChecker = require('../../client/shared/TypeChecker.js');
const Door = require('../models/Door.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');


module.exports = class DoorService {

    #doorIDs;

    /**
     * @constructor creates an instance of DoorService
     */
    constructor() {
        if (!!DoorService.instance) {
            return DoorService.instance;
        }

        DoorService.instance = this;
        this.#doorIDs = [];
    }

    /**
     * @private generates a unique ID for doors
     */
    #generateDoorID = function () {
        let idIsGenerated = false;
        while (!idIsGenerated) {
            let id = Math.floor((Math.random() * 1000000) - 500000);
            if (!this.#doorIDs.includes(id)) {
                idIsGenerated = true;
                this.#doorIDs.push(id);
                return id;
            }
        }
    }

    /**
     * @private generates valid enter positions for left door
     * 
     * @param {Position} doorPosition door position
     * 
     * @return array of valid enter positions
     */
    #generateEnterPositionsLeftWall = function (doorPosition) {
        TypeChecker.isInstanceOf(doorPosition, Position);

        let enterPositions = [];
        let roomId = doorPosition.getRoomId();
        for (var i = doorPosition.getCordX() - 2; i <= doorPosition.getCordX() + 2; i++) {
            for (var j = doorPosition.getCordY() + 1; j <= doorPosition.getCordY() + 3; j++) {
                enterPositions.push(new Position(roomId, i, j));
            }
        }
        return enterPositions;
    }

    /**
     * @private generates valid enter positions for right door
     * 
     * @param {Position} doorPosition door position
     * 
     * @return array of valid enter positions
     */
    #generateEnterPositionsRightWall = function (doorPosition) {
        TypeChecker.isInstanceOf(doorPosition, Position);

        let enterPositions = [];
        let roomId = doorPosition.getRoomId();
        for (var i = doorPosition.getCordX() - 3; i <= doorPosition.getCordX() - 1; i++) {
            for (var j = doorPosition.getCordY() - 2; j <= doorPosition.getCordY() + 2; j++) {
                enterPositions.push(new Position(roomId, i, j));
            }
        }
        return enterPositions;
    }

    /**
     * creates an instance of lecture door
     * 
     * @param {Position} mapPosition lecture door position
     * 
     * @return lecture door instance
     */
    createLectureDoor(mapPosition) {
        TypeChecker.isInstanceOf(mapPosition, Position);

        let enterPositions = this.#generateEnterPositionsLeftWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.LECTURE_DOOR, "leftlecturedoor_default", mapPosition, enterPositions, undefined, undefined);
    }

    /**
     * creates an instance of foyer door
     * 
     * @param {Position} mapPosition foyer door position
     * @param {Position} targetPosition avatar's position on entering foyer door
     * @param {Direction} direction avatar's direction on entering foyer door
     * 
     * @return foyer door instance
     */
    createFoyerDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsLeftWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.LEFT_DOOR, "leftfoyerdoor_default", mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * creates an instance of food court door
     * 
     * @param {Position} mapPosition food court door position
     * @param {Position} targetPosition avatar's position on entering food court door
     * @param {Direction} direction avatar's direction on entering food court door
     * 
     * @return food court door instance
     */
    createFoodCourtDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsRightWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightfoodcourtdoor_default", mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * creates an instance of reception door
     * 
     * @param {Position} mapPosition reception door position
     * @param {Position} targetPosition avatar's position on entering reception door
     * @param {Direction} direction avatar's direction on entering reception door
     * 
     * @return reception door instance
     */
    createReceptionDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsRightWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightreceptiondoor_default", mapPosition, enterPositions, targetPosition, direction);
    }
} 
