const TypeChecker = require('../../client/shared/TypeChecker.js');
const Door = require('../models/Door.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');
const GlobalStrings = require('../../client/shared/GlobalStrings.js');
const DoorLogos = require('../utils/DoorLogos.js');

/**
 * The Door Factory
 * @module DoorFactory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class DoorFactory {

    #doorIDPrefixList;

    /**
     * creates an instance of DoorFactory
     * @constructor 
     */
    constructor() {
        if (!!DoorFactory.instance) {
            return DoorFactory.instance;
        }

        DoorFactory.instance = this;
        this.#doorIDPrefixList = [];
    }

    /**
     * @private checks parameters' data type
     * @method module:DoorFactory#checkParamTypes
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

        if (typeOfDoor !== TypeOfDoor.LEFT_LECTUREDOOR && typeOfDoor !== TypeOfDoor.RIGHT_LECTUREDOOR) {
            TypeChecker.isInstanceOf(targetPosition, Position);
            TypeChecker.isEnumOf(direction, Direction);
        }
    }

    /**
     * @private generates valid enter positions for left door
     * @method module:DoorFactory#generateEnterPositionsLeftWall
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
     * @method module:DoorFactory#generateEnterPositionsRightWall
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
     * @method module:DoorFactory#countDoorOccurrences 
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
     * Creates a custom door with the passed attributes.
     * 
     * @method module:DoorFactory#createCustomDoor
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
            throw new Error(`${wallSide} is not a legal option for the wallside of a door.`);
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

    /**
     * Creates a custom lecture door with the passed attributes.
     * 
     * @method module:DoorFactory#createCustomLectureDoor
     * 
     * @param {String} assetPath The path to the logo being portrayed above the door                     
     * @param {String} wallSide Wallside, either left or right
     * @param {Position} mapPosition lecture door position
     * @param {boolean} isOpen decides if door is initially open or closed
     * @param {Object} closedMessage message user gets if he tries to enter this door while it is closed
     * @param {String} codeToOpen code to open this door while it is closed. If there is no code, this field is undefined
     * 
     * @return {Door} lecture door instance
     */
    createCustomLectureDoor(assetPath, wallSide, mapPosition, isOpen, closedMessage, codeToOpen) {
        this.#checkParamTypes(TypeOfDoor[wallSide + "_LECTUREDOOR"], mapPosition, undefined, undefined, isOpen, closedMessage, codeToOpen);
    
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
    

        let lectureDoorIdPrefix = 'L' + mapPosition.getRoomId();
        let lectureDoorId = lectureDoorIdPrefix + '_' + this.#countDoorOccurrences(lectureDoorIdPrefix);

        this.#doorIDPrefixList.push(lectureDoorIdPrefix);
        return new Door(lectureDoorId, 
                        TypeOfDoor[wallSide + "_LECTUREDOOR"], 
                        assetPath,
                        mapPosition, 
                        enterPositionWithoutClick, 
                        enterPositions, 
                        undefined,
                        undefined,
                        isOpen, 
                        closedMessage, 
                        codeToOpen);   
    }

    /**
     * Take the desired name & variant of a logo and gets it from
     * the DoorLogos-object.
     * 
     * @method module:DoorFactory#getDoorLogo
     * 
     * @param {String} logoName name of the logo
     * @param {String} logoVariant variant of the logo
     *  
     * @returns {String} The key for the image asset of the logo
     */
    getDoorLogo (logoName, logoVariant) {
        var logo
        if (DoorLogos.hasOwnProperty(logoName)) { logo = DoorLogos[logoName] }
        else { 
            DoorLogos[GlobalStrings.DEFAULT]
            console.log(`${logoName} is not a known door logo. Reverted to ${GlobalStrings.DEFAULT}.`) 
        }
        if (logo.hasOwnProperty(logoVariant)) { return logo[logoVariant] } 
        else { throw new Error(`${logoVariant} is not a known variation of the the door logo ${logo}.`) }
    }
} 