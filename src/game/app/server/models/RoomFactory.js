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
                // just do it via roomDecorator
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

    #buildByPlan = function(roomData) {
        let room = new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH);

        let listOfMapElements = [];
        let listOfGameObjects = [];

        // these methods still need proper handling for when some arguments are
        // missing.

        // Also shape-handling

        // And allow arrays as positions.

        // ADD TILES
        for (var i = 0; i < this.#room.getLength(); i++) {
            for (var j = 0; j < this.#room.getWidth(); j++) {
                // Whats the best way to add the shape here?
                listOfMapElements.push(objService.createEnv(roomData.ID, roomData.TILETYPE, i, j, false, false));
            }
        }

        // ADD LEFT WALLS
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createEnv(roomData.ID, roomData.WALLTYPE_LEFT, i, -1, false, false));
        }

        // ADD RIGHT WALLS
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createEnv(roomData.ID, roomData.WALLTYPE_RIGHT, this.#room.getLength(), j, false, false));
        }

        // ADD MAPELEMENTS
        // this includes windows, schedule usw.
        roomData.MAPELEMENTS.forEach(objData => {
            this.#createObjectFromData(objData);
        })

        // ADD OBJECTS
        // tables, plants, food and more
        roomData.OBJECTS.forEach(objData => {
            this.#createObjectFromData(objData);
        })

        // ADD DOORS

        // ADD NPCS


    }

    #createObjectFromData = function(objData) {
        if (Array.isArray(objData.POS)) {
            for (i = 0; i < objData.POS.length; i++) {
                if(!Array.isArray(objData.POS[i])) {
                    throw new TypeError('When array is passed as position of objects, it needs to be array of array');
                }
                for (j = 0; j < objData.POS[i].length; j++) {
                    listOfMapElements.push(objService.createObject(roomData.ID, objData.TYPE, i, j, objData.SOLID, objData.CLICKABLE, objData.URL));
                }
            }

        } else {
            listOfMapElements.push(objService.createObject(roomData.ID, objData.TYPE, objData.POS.X, objData.POS.Y, objData.SOLID, objData.CLICKABLE, objData.URL));
        }
    }



}