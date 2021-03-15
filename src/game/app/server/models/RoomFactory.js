const TypeChecker = require('../..client/shared/TypeChecker.js');
const TypeOfRoom = require('../client/shared/TypeOfRoom.js');
const AssetPaths = require('../utils/AssetPaths.js');
const Room = require('../models/Room.js');
const GameObjectService = require('../services/GameObjectService.js');
const Settings = require('../utils/Settings.js');

module.exports = class RoomFactory {

    constructor() {
        if(!!RoomFactory.instance) {
            return RoomFactory.instance;
        }

        let objService = new GameObjectService();

        RoomFactory.instance = this;
    }

    buildRoom(roomData) {
        // Is the blueprinting really necessary?

        // maybe create a new Room-Instance here?

        switch(roomData.TYPE) {
            case TypeOfRoom.RECEPTION:
                this.#buildBlueprintReception(roomData);
                break;
            case TypeOfRoom.FOYER:
                break;
            case TypeOfRoom.FOODCOURT:
                break;
            case TypeOfRoom.ESCAPEROOM:
                // Maybe add like automatic lock
                // for this type? 
                break;
            case TypeOfRoom.DEFAULT:
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

    #buildByPlan = function(roomData) {
        let room = new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH);

        let listOfMapElements = [];
        let listOfGameObjects = [];

        // the next three functions need to be slightly altered s.t. switching the wall-type will actually do someting.

        // ADD TILES
        for (var i = 0; i < this.#room.getLength(); i++) {
            for (var j = 0; j < this.#room.getWidth(); j++) {
                // Whats the best way to add the shape here?
                listOfMapElements.push(objService.createTile(roomData.ID, AssetPaths.defaultTile, i, j, false, false));
            }
        }

        // ADD LEFT WALLS
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createWall(roomData.ID, AssetPaths.defaultWall.left, 1, 1, i, -1, false, false));
        }

        // ADD RIGHT WALLS
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createWall(roomData.ID, AssetPaths.defaultWall.right, 1, 1, this.#room.getLength(), j, false, false));
        }

        // ADD MAPELEMENTS
        // this includes windows, schedule usw.

        // ADD OBJECTS
        // tables, plants, food and more
        roomData.OBJECTS.forEach(objData => {
            listOfGameObjects.push(objService.createObject(roomData.ID, objData.POS_X, objData.POS_Y, objData.SOLID, objData.CLICKABLE, objData.URL));

            // handling to allow for array instead
            // of integer for position
        })

        // ADD DOORS

        // ADD NPCS


    }



}