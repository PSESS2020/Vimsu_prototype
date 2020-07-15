//Nicht sicher ob so ein Service nötig ist


var TypeChecker = require('../../utils/TypeChecker.js');
var Door = require('../models/Door.js');
var Settings = require('../../utils/Settings.js');
var Position = require('../models/Position.js');


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
            throw new Error(doorId + " is not in list of doors");
        }

        return this.#doors[index];
    }

    initAllDoors() {
        //Door from Foyer to Food Court 
        this.#doors.push(new Door(1, new Position(Settings.FOYER_ID, 25, 2), new Position(Settings.FOODCOURT_ID, 2, 0)));

        //Door from Foyer to Reception (TODO: Adjust target position)
        this.#doors.push(new Door(2, new Position(Settings.FOYER_ID, 25, 22), new Position(Settings.RECEPTION_ID, 0, 0)));

        //Door from FoodCourt to Foyer
        this.#doors.push(new Door(3, new Position(Settings.FOODCOURT_ID, 2, 0), new Position(Settings.FOYER_ID, 24, 2)));

        //Door from Reception to Foyer (TODO: Adjust StartPosition)
        this.#doors.push(new Door(4, new Position(Settings.RECEPTION_ID, 0, 0), new Position(Settings.FOYER_ID, 24, 22)));
    }
} 