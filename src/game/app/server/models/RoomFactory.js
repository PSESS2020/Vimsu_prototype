const TypeChecker = require('../..client/shared/TypeChecker.js');
const TypeOfRoom = require('../client/shared/TypeOfRoom.js');
const AssetPaths = require('../../client/shared/AssetPaths.js');
const Room = require('../models/Room.js');
const GameObjectService = require('../services/GameObjectService.js');
const Settings = require('../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');
const NPCService = require('../services/NPCService.js');
const ReceptionRoomDecorator = require('./ReceptionRoomDecorator.js');
const FoyerRoomDecorator = require('./FoyerRoomDecorator.js');
const FoodcourtRoomDecorator = require('./FoodcourtRoomDecorator.js');
const EscapeRoomDecorator = require('./EscapeRoomDecorator.js');

module.exports = class RoomFactory {

    // I don't think the way the services are implemented
    // is functional

    #objService;
    #doorService;
    #npcService;


    constructor() {
        if(!!RoomFactory.instance) {
            return RoomFactory.instance;
        }

        this.#objService = new GameObjectService();
        this.#doorService = new DoorService();
        this.#npcService = new NPCService();

        RoomFactory.instance = this;
    }

    buildRoom(roomData) {
        TypeChecker.isEnumOf(roomData.TYPE, TypeOfRoom);

        switch(roomData.TYPE) {
            case TypeOfRoom.RECEPTION:
                return new ReceptionRoomDecorator(new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH)).getRoom();
            case TypeOfRoom.FOYER:
                return new FoyerRoomDecorator(new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH)).getRoom();
            case TypeOfRoom.FOODCOURT:
                return new FoodcourtRoomDecorator(new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH)).getRoom();
            case TypeOfRoom.ESCAPEROOM:
                return new EscapeRoomDecorator(new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH)).getRoom();
            case TypeOfRoom.CUSTOM:
                this.#buildByPlan(roomData);
                break;
            default:
                // This should never be reached
                throw new Error("Default option in the roomFactory switch-statement triggered. This should never happen. Please report bug to developer.");
                return undefined;
        }
    }

    #buildByPlan = function(roomData) {
        let room = new Room(roomData.ID,roomData.TYPE, roomData.WIDTH, roomData.LENGTH);

        let listOfMapElements = [];
        let listOfGameObjects = [];
        let listOfDoors = [];
        let listOfNPCs = [];

        // these methods still need proper handling for when some arguments are missing.

        // also i need to through the first couple ones and make sure they work right

        // Also shape-handling

        // And allow arrays as positions.

        // TODO:
        // - Tiles at the edge need to be of a special kind 

        // ADD TILES
        for (var i = 0; i < this.#room.getLength(); i++) {
            for (var j = 0; j < this.#room.getWidth(); j++) {
                // Whats the best way to add the shape here?
                listOfMapElements.push(this.#objService.createEnv(roomData.ID, roomData.TILETYPE, i, j, false, false));
            }
        }

        // ADD LEFT WALLS
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(this.#objService.createEnv(roomData.ID, roomData.WALLTYPE_LEFT, i, -1, false, false));
        }

        // ADD RIGHT WALLS
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(this.#objService.createEnv(roomData.ID, roomData.WALLTYPE_RIGHT, this.#room.getLength(), j, false, false));
        }

        // REDO the next two methods.
        // TODO desired interaction
        // - For each map element, the user only needs to specify
        //   the type, the position, whether or not the object is
        //   supposed to be clickable and if yes, which URL is
        //   supposed to be openend on click
        //   (does this not break stuff like the plant?)
        // - the type is then "decoded" into the size, the necessary
        //   asset paths, whether the object is solid usw.
        //   (how to handle multi-part objects?)
        // - how to handle custom options for "standard" objects?
        // - how to handle more custom objects?
        // - also, do all this without breaking the view if possible

        // ADD MAPELEMENTS
        // this includes windows, schedule usw.
        roomData.MAPELEMENTS.forEach(objData => {
            this.#createObjectFromData(objData);
        })

        // ADD OBJECTS
        // tables, plants, food and more
        // TODO add support for multi-tile objects
        roomData.OBJECTS.forEach(objData => {
            this.#createObjectFromData(objData);
        })

        // ADD DOORS
        // doorData = {assetPath, direction, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen}
        roomData.DOORS.forEach(doorData => {
            if (doorData.isOpen === undefined) {
                listOfDoors.push(
                    this.#doorService.createGeneralDoor(doorData.assetPath,
                    doorData.direction,
                    new Position(roomData.ID,
                        doorData.positionOfDoor[0],
                        doorData.positionOfDoor[1]),
                    new Position(doorData.positionOnExit[0],
                        doorData.positionOnExit[1],
                        doorData.positionOnExit[2]),
                    doorData.directionOnExit,
                    true,
                    "", // closedMessage
                    "") // codeToOpen
                ); 
            } else {
                listOfDoors.push(
                    this.#doorService.createCustomDoor(doorData.assetPath,
                    doorData.direction,
                    new Position(roomData.ID,
                        doorData.positionOfDoor[1],
                        doorData.positionOfDoor[2]),
                    new Position(doorData.positionOnExit[0],
                        doorData.positionOnExit[1],
                        doorData.positionOnExit[2]),
                    doorData.directionOnExit,
                    doorData.isOpen,
                    doorData.closedMessage,
                    doorData.codeToOpen)
                );
            }

        })

        // ADD NPCS
        roomData.NPCS.forEach(npcData => {
            listOfNPCs.push(
                this.#npcService.createCustomNPC(
                    npcData.name, // npc name
                    roomData.ID,  // roomID of position
                    npcData.position[0], // x coordinate of position
                    npcData.position[1], // y coordinate of position
                    npcData.direction,   // direction npc is facing
                    npcData.dialog       // what the npc says when
                                         // talked to
                )
            )
        })

        room.setMapElements(listOfMapElements);
        room.setGameObjects(listOfGameObjects);
        room.setNPCs(listOfNPCs);
        room.setDoors(listOfDoors);
        room.buildOccMap();

        return room;
    }

    // This is still unworkably broken
    #createObjectFromData = function(objData) {
        if (Array.isArray(objData.POS)) {
            // The way an array is handled here is bad
            // it will not do what is supposed to
            for (i = 0; i < objData.POS.length; i++) {
                if(!Array.isArray(objData.POS[i])) {
                    throw new TypeError('When array is passed as position of objects, it needs to be array of array');
                }
                for (j = 0; j < objData.POS[i].length; j++) {
                    return objService.createObject(roomData.ID, objData.TYPE, i, j, objData.SOLID, objData.CLICKABLE, objData.URL);
                }
            }

        } else {
            return objService.createObject(roomData.ID, objData.TYPE, objData.POS.X, objData.POS.Y, objData.SOLID, objData.CLICKABLE, objData.URL);
        }
    }



}