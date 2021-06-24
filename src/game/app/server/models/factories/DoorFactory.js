const TypeChecker = require('../../../client/shared/TypeChecker.js');
const Door = require('../mapobjects/Door.js');
const Position = require('../Position.js');
const Direction = require('../../../client/shared/Direction.js');
const TypeOfDoor = require('../../../client/shared/TypeOfDoor.js');
const GlobalStrings = require('../../../client/shared/GlobalStrings.js');
const DoorLogos = require('../../utils/DoorLogos.js');
const Messages = require('../../utils/Messages.js');
const Settings = require('../../utils/Settings.js');
const AchievementService = require('../../services/AchievementService.js');

/**
 * The Door Factory
 * @module DoorFactory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class DoorFactory {

    #doorIDPrefixList;
    #achvmtService

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
        this.#achvmtService = new AchievementService()
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
     * @param { String } roomId 
     * @param { wallSide:         String,
     *          ?logo:            String, 
     *          positionOfDoor:   int[2],
     *          ?positionOnExit:  Array[3],
     *          directionOnExit:  Direction,
     *          ?isOpen:          Boolean,
     *          ?closedMessage:   String[],
     *          ?codeToOpen:      String     } doorData 
     * 
     * @returns {Door} A door instance with the passed attributes
     */
    createDoor(creationData) {
        // Mandatory
        const { roomId, wallSide, positionOfDoor: [xPos, yPos], directionOnExit, codeToOpen } = creationData
        // Optional and conditionally mandatory
        const { positionOnExit, logo, isOpen, closedMessage, isLectureDoor, unlocksAt: { name, level } } = creationData

        if (isLectureDoor && !Settings.VIDEOSTORAGE_ACTIVATED) { throw new Error("You tried to create a lecture door, but video storage is not activated for this conference!") }
        if ( isOpen         === undefined ) { isOpen        = true  }
        if ( closedMessage  === undefined ) { closedMessage = Messages.STANDARDDOORCLOSED }
        if ( isLectureDoor  === undefined ) { isLectureDoor = false }
        if ( positionOnExit !== undefined ) { var [idExit, xExit, yExit] = positionOnExit }
        else if ( !isLectureDoor ) { throw new Error("You must define an exit position when creating a non-lecture door!") }
        if ( logo           === undefined ) { logo          = GlobalStrings.DEFAULT }
        // check that unlocksAt is properly defined

        const assetPath = this.#getDoorLogo(logo, wallSide)
        const doorPosition = new Position(roomId, xPos, yPos)
        const exitPosition = (!isLectureDoor) ? new Position(idExit, xExit, yExit) : doorPosition
        const doorTypeKey = `${wallSide}_${(isLectureDoor) ? "LECTURE" : ""}DOOR`

        var enterPositionData;
        if ( wallSide === GlobalStrings.LEFT ) {
            enterPositionData = this.#generateEnterPositionsLeftWall(doorPosition);
        } else if ( wallSide === GlobalStrings.RIGHT ) {
            enterPositionData = this.#generateEnterPositionsRightWall(doorPosition);
        } else {
            throw new Error(`${wallSide} is not a legal option for the wallside of a door.`);
        }
        const { enterPositions, enterPositionWithoutClick } = enterPositionData

        // TODO redo
        let doorIdPrefix = "F" + doorPosition.getRoomId() + "T" + exitPosition.getRoomId();
        let doorId = doorIdPrefix + '_' + this.#countDoorOccurrences(doorIdPrefix);
        this.#doorIDPrefixList.push(doorIdPrefix);
        
        let doorToReturn = new Door(doorId, TypeOfDoor[doorTypeKey], assetPath, doorPosition, enterPositionWithoutClick, enterPositions, exitPosition, directionOnExit, isOpen, closedMessage, codeToOpen)
        if (unlocksAt) { this.#achvmtService.letDoorObserveForUnlock(doorToReturn, unlocksAt) } 
        return doorToReturn
         
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
    #getDoorLogo = function (logoName, logoVariant) {
        var logo
        if (DoorLogos.hasOwnProperty(logoName)) { logo = DoorLogos[logoName] }
        else { 
            logo = DoorLogos[GlobalStrings.DEFAULT]
            console.log(`${logoName} is not a known door logo. Reverted to ${GlobalStrings.DEFAULT}.`) 
        }
        if (logo.hasOwnProperty(logoVariant)) { return logo[logoVariant] } 
        else { throw new Error(`${logoVariant} is not a known variation of the the door logo ${logo}.`) }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorFactory;
}