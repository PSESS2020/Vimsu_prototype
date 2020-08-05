//Nicht sicher ob so ein Service nötig ist


var TypeChecker = require('../../utils/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../utils/Settings.js');
var Position = require('../models/Position.js');
const Direction = require('../../utils/Direction.js');
const TypeOfDoor = require('../../utils/TypeOfDoor.js');


module.exports = class DoorService {
    #doors;

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
        this.initAllDoors();
      
    }

    getDoors(roomId) {
        TypeChecker.isInt(roomId);

        var roomDoors = [], i;

        for(i = 0; i < this.#doors.length; i++){
            if (this.#doors[i].getStartingRoomId() === roomId) {
                roomDoors.push(this.#doors[i]);
            }
        }

        return roomDoors;
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
    }
} 
