const TypeChecker = require('../..client/shared/TypeChecker.js');
const TypeOfRoom = require('../client/shared/TypeOfRoom.js');
const GlobalStrings = require('../utils/GlobalStrings');
const assetPaths = require('../utils/AssetPaths.js');
const Room = require('../models/Room.js');
const Settings = require('../utils/Settings.js');

module.exports = class RoomFactory {

    constructor() {
        if(!!RoomFactory.instance) {
            return RoomFactory.instance;
        }

        RoomFactory.instance = this;
    }

    buildRoom(roomData) {
        // Is the blueprinting really necessary?
        // also replace GlobalStrings w/ TypeOfRoom

        // maybe create a new Room-Instance here?

        switch(roomData.TYPE) {
            case GlobalStrings.RECEPTION:
                this.#buildBlueprintReception(roomData);
                break;
            case GlobalStrings.FOYER:
                break;
            case GlobalStrings.FOODCOURT:
                break;
            case GlobalStrings.ESCAPE:
                // Maybe add like automatic lock
                // for this type? 
                break;
            case GlobalStrings.DEFAULT:
                this.#buildByPlan(roomData);
                break;
            default:
                return false;
        }
    }

    #buildBlueprintReception = function() {

    }

    #buildBlueprintFoyer = function() {

    }

    #buildBlueprintFoodcourt = function() {

    }

    #buildByPlan = function() {

    }


}