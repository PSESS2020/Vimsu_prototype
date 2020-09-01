const TypeChecker = require('../../client/shared/TypeChecker.js');
const Door = require('../models/Door.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

/**
 * The Door Service
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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
     * @return enter position data
     */
    #generateEnterPositionsLeftWall = function (doorPosition) {
        TypeChecker.isInstanceOf(doorPosition, Position);

        let enterPositions = [];
        let roomId = doorPosition.getRoomId();

        var enterPositionWithoutClick = {
            position: new Position(roomId, doorPosition.getCordX(), doorPosition.getCordY() + 1),
            direction: Direction.UPLEFT
        }
        
        for (var i = doorPosition.getCordX() - 2; i <= doorPosition.getCordX() + 2; i++) {
            for (var j = doorPosition.getCordY() + 1; j <= doorPosition.getCordY() + 3; j++) {
                enterPositions.push(new Position(roomId, i, j));
            }
        }
        return {enterPositionWithoutClick: enterPositionWithoutClick, enterPositions: enterPositions};
    }

    /**
     * @private generates valid enter positions for right door
     * 
     * @param {Position} doorPosition door position
     * 
     * @return enter position data
     */
    #generateEnterPositionsRightWall = function (doorPosition) {
        TypeChecker.isInstanceOf(doorPosition, Position);

        let enterPositions = [];
        let roomId = doorPosition.getRoomId();

        var enterPositionWithoutClick = {
            position: new Position(roomId, doorPosition.getCordX() - 1, doorPosition.getCordY()),
            direction: Direction.UPRIGHT
        }

        for (var i = doorPosition.getCordX() - 3; i <= doorPosition.getCordX() - 1; i++) {
            for (var j = doorPosition.getCordY() - 2; j <= doorPosition.getCordY() + 2; j++) {
                enterPositions.push(new Position(roomId, i, j));
            }
        }
        return {enterPositionWithoutClick: enterPositionWithoutClick, enterPositions: enterPositions};
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

        let enterPositionData = this.#generateEnterPositionsLeftWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door(this.#generateDoorID(), TypeOfDoor.LECTURE_DOOR, "leftlecturedoor_default", mapPosition, enterPositionWithoutClick, enterPositions, undefined, undefined);
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

        let enterPositionData = this.#generateEnterPositionsLeftWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door(this.#generateDoorID(), TypeOfDoor.LEFT_DOOR, "leftfoyerdoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction);
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

        let enterPositionData = this.#generateEnterPositionsRightWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightfoodcourtdoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction);
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

        let enterPositionData = this.#generateEnterPositionsRightWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door(this.#generateDoorID(), TypeOfDoor.RIGHT_DOOR, "rightreceptiondoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction);
    }
} 
