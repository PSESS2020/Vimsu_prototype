//Nicht sicher ob so ein Service nötig ist


const TypeChecker = require('../../client/shared/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../client/shared/Settings.js');
var Position = require('../models/Position.js');
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

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Array of Positions} enterPositions 
     */
    createLectureDoor(mapPosition, enterPositions) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(position => {
            TypeChecker.isInstanceOf(position, Position);
        });

        return new Door(this.#generateDoorID(), TypeOfDoor.LECTURE_DOOR, mapPosition, enterPositions, undefined, undefined);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Array of Positions} enterPositions 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createFoyerDoor(mapPosition, enterPositions, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(position => {
            TypeChecker.isInstanceOf(position, Position);
        });
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        return new Door(this.#generateDoorID(), TypeOfDoor.FOYER_DOOR, mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Array of Positions} enterPositions 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createFoodCourtDoor(mapPosition, enterPositions, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(position => {
            TypeChecker.isInstanceOf(position, Position);
        });
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        return new Door(this.#generateDoorID(), TypeOfDoor.FOODCOURT_DOOR, mapPosition, enterPositions, targetPosition, direction);
    }

    /**
     * 
     * @param {Position} mapPosition 
     * @param {Array of Positions} enterPositions 
     * @param {Position} targetPosition 
     * @param {Direction} direction 
     */
    createReceptionDoor(mapPosition, enterPositions, targetPosition, direction) {
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isInstanceOf(enterPositions, Array);
        enterPositions.forEach(position => {
            TypeChecker.isInstanceOf(position, Position);
        });
        TypeChecker.isInstanceOf(mapPosition, Position);
        TypeChecker.isEnumOf(direction, Direction);

        return new Door(this.#generateDoorID(), TypeOfDoor.RECEPTION_DOOR, mapPosition, enterPositions, targetPosition, direction);
    }
} 
