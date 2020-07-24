//Nicht sicher ob so ein Service nötig ist


var TypeChecker = require('../../utils/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../utils/Settings.js');
var Position = require('../models/Position.js');
const Direction = require('../models/Direction.js');


module.exports = class DoorService {
    #doors;
    #lectureDoorPosition;           //LectureDoor.js is kind of useless right now, so lectureDoorPosition is stored here

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

    getLectureDoorPosition() {
        return this.#lectureDoorPosition;
    }

    initAllDoors() {
        //Door from Foyer to Food Court 
        this.#doors.push(new Door(1, new Position(Settings.FOYER_ID, [22, 23, 24], [0, 1, 2, 3, 4]), new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from Foyer to Reception (TODO: Adjust target position)
        this.#doors.push(new Door(2, new Position(Settings.FOYER_ID, [22, 23, 24], [20, 21, 22, 23, 24]), new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));

        //Door from FoodCourt to Foyer
        this.#doors.push(new Door(3, new Position(Settings.FOODCOURT_ID, [0, 1, 2, 3, 4], [0, 1, 2]), new Position(Settings.FOYER_ID, 24, 2), Direction.DOWNLEFT));

        //Door from Reception to Foyer (TODO: Adjust StartPosition)
        this.#doors.push(new Door(4, new Position(Settings.RECEPTION_ID, [0, 1, 2, 3, 4], [0, 1, 2]), new Position(Settings.FOYER_ID, 24, 22), Direction.DOWNLEFT));

        //Lecture Door Position
        this.#lectureDoorPosition = new Position(Settings.FOYER_ID, [0, 1, 2, 3, 4], [0, 1, 2]);
    }
} 
