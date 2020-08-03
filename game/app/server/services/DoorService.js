//Nicht sicher ob so ein Service nötig ist


var TypeChecker = require('../../utils/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../utils/Settings.js');
var Position = require('../models/Position.js');
const Direction = require('../../utils/Direction.js');


module.exports = class DoorService {
    #doors;
    #lectureDoorEnterPositions;           //LectureDoor.js is kind of useless right now, so lectureDoorPosition is stored here

    /**
     * @author Philipp
     * 
     */
    constructor() {
        if(!!DoorService.instance){
            return DoorService.instance;
        }

        DoorService.instance = this;
        this.#doors = [];
        this.#lectureDoorEnterPositions = [];
        this.initAllDoors();
      
    }

    getAllDoors() {
        return this.#doors;
    }

    getDoor(doorId) {
        TypeChecker.isInt(doorId);

        let index = this.#doors.findIndex(door => door.getId() === doorId);

        if (index < 0) 
        {
            throw new Error(doorId + " is not in list of doors")
        }

        return this.#doors[index];
    }

    getDoorByRoom(startingRoomId, targetRoomId) {
        TypeChecker.isInt(startingRoomId);
        TypeChecker.isInt(targetRoomId);

        let index = this.#doors.findIndex(door => door.getStartingRoomId() === startingRoomId 
                                                && door.getTargetRoomId() === targetRoomId);

        if (index < 0) 
        {
            throw new Error("Wrong IDs");
        }

        return this.#doors[index];
    }

    /**
     * Checks if position is a valid enter position for the lecture Door
     * 
     * @param {Position} position 
     */
    isValidLectureEnterPosition(position) {
        TypeChecker.isInstanceOf(position, Position);

        for (var i = 0; i < this.#lectureDoorEnterPositions.length; i++) {
            if (position.getRoomId() === this.#lectureDoorEnterPositions[i].getRoomId() &&
                position.getCordX() === this.#lectureDoorEnterPositions[i].getCordX() &&
                position.getCordY() === this.#lectureDoorEnterPositions[i].getCordY()) {
                return true;
            }
        }
        return false;  
    }

    initAllDoors() {
        //Door from Foyer to Food Court 
        let foyerFoodCourtEnterPositions = [];
        for (var i = 22; i <= 24; i++) {
            for (var j = 0; j <= 4; j++) {
                foyerFoodCourtEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        this.#doors.push(new Door(1, foyerFoodCourtEnterPositions, new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from Foyer to Reception 
        let foyerReceptionEnterPositions = [];
        for (var i = 22; i <= 24; i++) {
            for (var j = 20; j <= 24; j++) {
                foyerReceptionEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        this.#doors.push(new Door(2, foyerReceptionEnterPositions, new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from FoodCourt to Foyer
        let foodCourtFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                foodCourtFoyerEnterPositions.push(new Position(Settings.FOODCOURT_ID, i, j));
            }
        }
        this.#doors.push(new Door(3, foodCourtFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 2), Direction.DOWNLEFT));

        //Door from Reception to Foyer 
        let receptionFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                receptionFoyerEnterPositions.push(new Position(Settings.RECEPTION_ID, i, j));
            }
        }
        this.#doors.push(new Door(4, receptionFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 22), Direction.DOWNLEFT));

        //Lecture Door Enter Positions (LectureDoor Object could be useful now, maybe added later)
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                this.#lectureDoorEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }
    }
} 
