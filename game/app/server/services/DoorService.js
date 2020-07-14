//Nicht sicher ob so ein Service nötig ist


var TypeChecker = require('../../utils/TypeChecker.js');
var Door = require('../models/Door.js');

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

    initAllDoors() {
        //TODO
    }
} 