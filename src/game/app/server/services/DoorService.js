const TypeChecker = require('../../client/shared/TypeChecker.js');
const Door = require('../models/Door.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');
const GlobalStrings = require('../../client/shared/GlobalStrings.js');

/**
 * The Door Service
 * @module DoorService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class DoorService {

    #doorIDPrefixList;

    /**
     * creates an instance of DoorService
     * @constructor 
     */
    constructor() {
        if (!!DoorService.instance) {
            return DoorService.instance;
        }

        DoorService.instance = this;
        this.#doorIDPrefixList = [];
    }

    /**
     * @private checks parameters' data type
     * @method module:DoorService#checkParamTypes
     * 
     * @param {TypeOfDoor} typeOfDoor type of checked door
     * @param {Position} mapPosition foyer door position
     * @param {Position} targetPosition avatar's position on entering foyer door
     * @param {Direction} direction avatar's direction on entering foyer door
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     */
    #checkParamTypes = function (typeOfDoor, mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen) {
        TypeChecker.isEnumOf(typeOfDoor, TypeOfDoor)
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isBoolean(isOpen);
        TypeChecker.isInstanceOf(closedMessage, Object);
        TypeChecker.isString(closedMessage.header);
        TypeChecker.isString(closedMessage.body);
        if (codeToOpen !== undefined)
            TypeChecker.isString(codeToOpen);

        if (typeOfDoor !== TypeOfDoor.LECTURE_DOOR) {
            TypeChecker.isInstanceOf(targetPosition, Position);
            TypeChecker.isEnumOf(direction, Direction);
        }
    }

    /**
     * @private generates valid enter positions for left door
     * @method module:DoorService#generateEnterPositionsLeftWall
     * 
     * @param {Position} doorPosition door position
     * 
     * @return {Object} enter position data
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
     * @method module:DoorService#generateEnterPositionsRightWall
     * 
     * @param {Position} doorPosition door position
     * 
     * @return {Object} enter position data
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
     * Counts how many doors exist with that doorIDPrefix (doorIDPrefix is shared between doors that connect the same rooms in the same order)
     * 
     * @method module:DoorService#countDoorOccurrences 
     * 
     * @param {String} doorIDPrefix prefix of door ID (F + startingRoomID + T + targetRoomID)
     * 
     * @return {Number} number of doors that exist between 2 rooms already
     */
    #countDoorOccurrences = function (doorIDPrefix) {
        let count = 0;
        for (let i = 0; i < this.#doorIDPrefixList.length; i++) {
            if (this.#doorIDPrefixList[i] === doorIDPrefix) {
                count++;
            }
        }
        return count;
    }

    /**
     * creates an instance of lecture door
     * @method module:DoorService#createLectureDoor
     * 
     * @param {Position} mapPosition lecture door position
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} lecture door instance
     */
    createLectureDoor(mapPosition, isOpen, closedMessage, codeToOpen) {
        this.#checkParamTypes(TypeOfDoor.LECTURE_DOOR, mapPosition, undefined, undefined, isOpen, closedMessage, codeToOpen);

        let enterPositionData = this.#generateEnterPositionsLeftWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door('L' + mapPosition.getRoomId(), TypeOfDoor.LECTURE_DOOR, "leftlecturedoor_default", mapPosition, enterPositionWithoutClick, enterPositions, undefined, undefined, isOpen, closedMessage, codeToOpen);
    }

    /**
     * creates an instance of foyer door
     * @method module:DoorService#createFoyerDoor
     * 
     * @param {Position} mapPosition foyer door position
     * @param {Position} targetPosition avatar's position on entering foyer door
     * @param {Direction} direction avatar's direction on entering foyer door
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} foyer door instance
     */
    createFoyerDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen) {
        this.#checkParamTypes(TypeOfDoor.LEFT_DOOR, mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen);

        let enterPositionData = this.#generateEnterPositionsLeftWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door('F' + mapPosition.getRoomId() + 'T' + targetPosition.getRoomId(), TypeOfDoor.LEFT_DOOR, "leftfoyerdoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction, isOpen, closedMessage, codeToOpen);
    }

    /**
     * creates an instance of food court door
     * @method module:DoorService#createFoodCourtDoor
     * 
     * @param {Position} mapPosition food court door position
     * @param {Position} targetPosition avatar's position on entering food court door
     * @param {Direction} direction avatar's direction on entering food court door
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} food court door instance
     */
    createFoodCourtDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen) {
        this.#checkParamTypes(TypeOfDoor.RIGHT_DOOR, mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen);

        let enterPositionData = this.#generateEnterPositionsRightWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door('F' + mapPosition.getRoomId() + 'T' + targetPosition.getRoomId(), TypeOfDoor.RIGHT_DOOR, "rightfoodcourtdoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction, isOpen, closedMessage, codeToOpen);
    }

    /**
     * creates an instance of reception door
     * @method module:DoorService#createReceptionDoor
     * 
     * @param {Position} mapPosition reception door position
     * @param {Position} targetPosition avatar's position on entering reception door
     * @param {Direction} direction avatar's direction on entering reception door
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} reception door instance
     */
    createReceptionDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen) {
        this.#checkParamTypes(TypeOfDoor.RIGHT_DOOR, mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen);

        let enterPositionData = this.#generateEnterPositionsRightWall(mapPosition);
        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;
        return new Door('F' + mapPosition.getRoomId() + 'T' + targetPosition.getRoomId(), TypeOfDoor.RIGHT_DOOR, "rightreceptiondoor_default", mapPosition, enterPositionWithoutClick, enterPositions, targetPosition, direction, isOpen, closedMessage, codeToOpen);
    }

    /**
     * creates an instance of escape room door
     * @method module:DoorService#createEscapeRoomDoor
     * 
     * @param {Position} mapPosition escape room door position
     * @param {Position} targetPosition avatar's position on entering escape room door
     * @param {Direction} direction avatar's direction on entering escape room door
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} escape room door instance
     */
    createEscapeRoomDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen) {
        //Assets for this door are still missing, so for now it's just a reception door

        return this.createReceptionDoor(mapPosition, targetPosition, direction, isOpen, closedMessage, codeToOpen);
    }

    /**
     * Creates a custom door with the passed attributes.
     * 
     * @method module:DoorService#createCustomDoor
     * 
     * @param {String} assetPath // The path to the logo being portrayed
     *                           // above the door
     * @param {String} wallSide 
     * @param {Position} mapPosition 
     * @param {Position} targetPosition 
     * @param {Direction} directionOnExit 
     * @param {Boolean} isOpen 
     * @param {String} closedMessage 
     * @param {String} codeToOpen 
     * 
     * @returns {Door} A door instance with the passed attributes
     */
    createCustomDoor(assetPath, wallSide, mapPosition, targetPosition, directionOnExit, isOpen, closedMessage, codeToOpen) {

        this.#checkParamTypes(TypeOfDoor[wallSide + "_DOOR"], mapPosition, targetPosition, directionOnExit, isOpen, closedMessage, codeToOpen);

        var enterPositionData;

        if (wallSide === GlobalStrings.LEFT) {
            enterPositionData = this.#generateEnterPositionsLeftWall(mapPosition);
        } else if (wallSide === GlobalStrings.RIGHT) {
            enterPositionData = this.#generateEnterPositionsRightWall(mapPosition);
        } else {
            throw new Error(wallSide + " is not a legal option for the wallside of a door.");
        }

        let enterPositionWithoutClick = enterPositionData.enterPositionWithoutClick;
        let enterPositions = enterPositionData.enterPositions;

        
        let doorIdPrefix = "F" + mapPosition.getRoomId() + "T" + targetPosition.getRoomId();
        let doorId = doorIdPrefix + '_' + this.#countDoorOccurrences(doorIdPrefix);

        this.#doorIDPrefixList.push(doorIdPrefix);

        return new Door(doorId,   
                TypeOfDoor[wallSide + "_DOOR"], 
                assetPath,
                mapPosition, 
                enterPositionWithoutClick, 
                enterPositions, 
                targetPosition, 
                directionOnExit, 
                isOpen, 
                closedMessage, 
                codeToOpen);      
    } 

    


} 
