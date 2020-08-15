const TypeChecker = require('../../client/shared/TypeChecker.js');
const Door = require('../models/Door.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');


module.exports = class DoorService {

    #doorIDs;

    /**
     * @author Philipp
     * 
     */
    constructor() {
        if (!!DoorService.instance) {
            return DoorService.instance;
        }

        DoorService.instance = this;
        this.#doorIDs = [];
    }

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

    #generateEnterPositionsLeftWall = function(doorPosition) {
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

    #generateEnterPositionsRightWall = function(doorPosition) {
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
     * 
     * @param {Position} mapPosition 
     */
    createLectureDoor(mapPosition) {
        TypeChecker.isInstanceOf(mapPosition, Position);

        let enterPositions = this.#generateEnterPositionsLeftWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.LECTURE_DOOR, "leftlecturedoor_default", mapPosition, enterPositions, undefined, undefined);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createFoyerDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsLeftWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.LEFT_DOOR, "leftfoyerdoor_default", mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createFoodCourtDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsRightWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightfoodcourtdoor_default", mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createReceptionDoor(mapPosition, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(targetPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let enterPositions = this.#generateEnterPositionsRightWall(mapPosition);
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightreceptiondoor_default", mapPosition, enterPositions, targetPosition, direction);
    }
} 
