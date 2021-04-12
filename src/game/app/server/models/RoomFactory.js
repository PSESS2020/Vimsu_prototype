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
const GameObjectType = require('../../client/shared/GameObjectType.js');
const GlobalStrings = require('../utils/GlobalStrings.js');
const { TILE } = require('../../client/shared/GameObjectType.js');

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

    buildRoomFrom(roomData) {
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
                return this.#buildByPlan(roomData);
            default:
                // This should never be reached
                throw new Error("Default option in the roomFactory switch-statement triggered. This should never happen. Please report bug to developer.");

        }
    }

    #buildByPlan = function(roomData) {
        // the room object should have uniform visibility
        // throughout the entire file
        let room = new Room(roomData.ID, roomData.TYPE, roomData.WIDTH, roomData.LENGTH);

        let listOfMapElements = [];
        let listOfGameObjects = [];
        let listOfDoors = [];
        let listOfNPCs = [];

        // these methods still need proper handling for when some arguments are missing.

        // TODO
        // - Make sure methods behave correctly when arguments are
        //   missing
        // - Add shape-handling & support for doors not placed on
        //   outer walls
        // - Allow for objects to be placed in a line easily

        // ADD TILES
        for (var i = 0; i < room.getLength(); i++) {
            for (var j = 0; j < room.getWidth(); j++) {
                listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.TILE, i, j, false, ""));
            }
        }

        // ADD LEFT WALLS
        for (var i = 0; i < room.getLength(); i++) {
            listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.LEFTWALL, i, -1, false, ""));
        }

        // ADD RIGHT WALLS
        for (var j = 0; j < room.getWidth(); j++) {
            listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.RIGHTWALL, room.getLength(), j, false, ""));
        }

        // REDO the next two methods.
        // TODO desired interaction
        // - For each map element, the user only needs to specify
        //   the type, the position, whether or not the object is
        //   supposed to be clickable and if yes, which URL is
        //   supposed to be openend on click
        //   (does this not break stuff like the plant?) (done)
        // - the type is then "decoded" into the size, the necessary
        //   asset paths, whether the object is solid usw.
        //   (how to handle multi-part objects?)
        // - how to handle custom options for "standard" objects?
        // - how to handle more custom objects?

        // offer three options for positions:
        // - [xPos, yPos] (done)
        // - An array of positions formatted as above (done)
        // - An area (how to implement)

        // ADD MAPELEMENTS
        // this includes windows, schedule usw.
        roomData.MAPELEMENTS.forEach(objData => {
            this.#createObjectsFromData(objData, listOfMapElements);
        })

        // ADD OBJECTS
        // tables, plants, food and more
        roomData.OBJECTS.forEach(objData => {
            this.#createObjectsFromData(objData, listOfGameObjects);   
        })

        // ADD DOORS
        // doorData = {assetName, wallSide, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen, logo}
        // TODO:
        // - logos above doors
        roomData.DOORS.forEach(doorData => {           
            if (doorData.isOpen === undefined) {
                listOfDoors.push(
                    this.#doorService.createCustomDoor(doorData.assetName,
                        doorData.wallSide,
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
                // this requires error handling for when a door
                // is defined as closed but there is no message
                // or code to open defined
                listOfDoors.push(
                    this.#doorService.createCustomDoor(doorData.assetName,
                        doorData.wallSide,
                        new Position(roomData.ID,
                            doorData.positionOfDoor[0],
                            doorData.positionOfDoor[1]),
                        new Position(doorData.positionOnExit[0],
                            doorData.positionOnExit[1],
                            doorData.positionOnExit[2]),
                        doorData.directionOnExit,
                        doorData.isOpen,
                        doorData.closedMessage,
                        doorData.codeToOpen)
                );
            }   

            // Create tile inside of door
            // if door is on the left side, same x, one less y
            // if door is on the right side, same y, one more x
            var xPos = doorData.positionOfDoor[0];
            var yPos = doorData.positionOfDoor[1];
            if (wallSide = GlobalStrings.LEFT) {
                yPos--;
            } else if (wallSide = GlobalStrings.RIGHT) {
                xPos++;
            } else {
                // TODO error handling
            }
           listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType[wallSide + "TILE"], xPos, yPos, false, ""))

           // TODO - where is this actually set?
           // Now create logo above the door
           // if the logo is undefined, we just do nothing
           if (doorData.logo !== undefined) {
               listOfMapElements.push(this.#objService.createCustomObject)
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



    #createObjectsFromData = function (objData, listToPushInto) {
        // TODO support multi-part objects
        // TODO support objects with automatic additional parts
        // TODO support variations of one object
        // TODO support for custom options
        if (objData.isClickable == undefined) {
            objData.isClickable = false;
            objData.url = "";
        }
        if (Array.isArray(objData.position[0])) {
            objData.position.forEach(position => {
                listToPushInto.push(objService.createCustomObject(
                    roomData.ID,
                    objData.type,
                    position[0],
                    position[1],
                    objData.isClickable,
                    objData.url
                ));
            })
        } else {
            listToPushInto.push(objService.createCustomObject(
                roomData.ID,
                objData.type,
                objData.position[0],
                objData.position[1],
                objData.isClickable,
                objData.url
            ));
        }      
    }

}