const TypeChecker = require('../../../../config/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../utils/Settings.js');
var Position = require('../models/Position.js');
const Direction = require('../../utils/Direction.js');
const TypeOfDoor = require('../../utils/TypeOfDoor.js');
const { LECTURE_DOOR } = require('../../utils/TypeOfDoor.js');


module.exports = class DoorService {

    #doorIDs;

    /**
     * @author Philipp
     * 
     */
    constructor() {
        if(!!DoorService.instance){
            return DoorService.instance;
        }

        DoorService.instance = this;
        this.#doorIDs = [];
    }

    /*

    initAllDoors() {
        //Door from Foyer to Food Court 
        let foyerFoodCourtEnterPositions = [];
        for (var i = 22; i <= 24; i++) {
            for (var j = 0; j <= 4; j++) {
                foyerFoodCourtEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        this.#doors.push(new Door(1, TypeOfDoor.FOODCOURT_DOOR, new Position(Settings.FOYER_ID, 25, 4), foyerFoodCourtEnterPositions, new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from Foyer to Reception 
        let foyerReceptionEnterPositions = [];
        for (var i = 22; i <= 24; i++) {
            for (var j = 20; j <= 24; j++) {
                foyerReceptionEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        this.#doors.push(new Door(2, TypeOfDoor.RECEPTION_DOOR, new Position(Settings.FOYER_ID, 25, 24), foyerReceptionEnterPositions, new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from FoodCourt to Foyer
        let foodCourtFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                foodCourtFoyerEnterPositions.push(new Position(Settings.FOODCOURT_ID, i, j));
            }
        }
        this.#doors.push(new Door(3, TypeOfDoor.FOYER_DOOR, new Position(Settings.FOODCOURT_ID, 2, 1), foodCourtFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 2), Direction.DOWNLEFT));

        //Door from Reception to Foyer 
        let receptionFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                receptionFoyerEnterPositions.push(new Position(Settings.RECEPTION_ID, i, j));
            }
        }
        this.#doors.push(new Door(4, TypeOfDoor.FOYER_DOOR, new Position(Settings.RECEPTION_ID, 2, 1), receptionFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 22), Direction.DOWNLEFT));

        //LectureDoor
        let lectureDoorEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                lectureDoorEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }
        this.#doors.push(new Door(5, TypeOfDoor.LECTURE_DOOR, new Position(Settings.FOYER_ID, 2, 1), lectureDoorEnterPositions, undefined, undefined));
    }*/

    #generateDoorID = function() {
        let idIsGenerated = false;
        while(!idIsGenerated) {
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
