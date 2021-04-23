const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
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
const GlobalStrings = require('../../client/shared/GlobalStrings.js');
const RoomDimensions = require('../utils/RoomDimensions.js');
const GameObjectInfo = require('../utils/GameObjectInfo.js');
const DoorClosedMessages = require('../utils/messages/DoorClosedMessages.js');
const DoorLogos = require('../utils/DoorLogos.js');

/**
 * Churns out Room instances. Singleton.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class RoomFactory {
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

    /**
     * Takes a data object specifying the layout of a room and
     * creates a Room instance from it. If the room is not one of
     * the standard types, the #buildByPlan-method is called to
     * parse the dataObject and build a room with a custom layout.
     * 
     * @method module:RoomFactory#buildRoomFrom
     * 
     * @param {Object} roomData A data object specifying the layout of
     *                          the room that is supposed to be created
     * 
     * @returns {Room} The fully built room
     */
    buildRoomFrom(roomData) {
        TypeChecker.isEnumOf(roomData.TYPE, TypeOfRoom);
        // switch statement should be replaced by polymorphism
        switch(roomData.TYPE) {
            case TypeOfRoom.RECEPTION:
                return new ReceptionRoomDecorator(new Room(roomData.ID, roomData.NAME, roomData.TYPE, RoomDimensions.RECEPTION_WIDTH, RoomDimensions.RECEPTION_LENGTH)).getRoom();
            case TypeOfRoom.FOYER:
                return new FoyerRoomDecorator(new Room(roomData.ID, roomData.NAME, roomData.TYPE, RoomDimensions.FOYER_WIDTH, RoomDimensions.FOYER_LENGTH)).getRoom();
            case TypeOfRoom.FOODCOURT:
                return new FoodcourtRoomDecorator(new Room(roomData.ID, roomData.NAME, roomData.TYPE, RoomDimensions.FOODCOURT_WIDTH, RoomDimensions.FOODCOURT_LENGTH)).getRoom();
            case TypeOfRoom.ESCAPEROOM:
                return new EscapeRoomDecorator(new Room(roomData.ID, roomData.NAME, roomData.TYPE, RoomDimensions.ESCAPEROOM_WIDTH, RoomDimensions.ESCAPEROOM_LENGTH)).getRoom();
            case TypeOfRoom.CUSTOM:
            default:
                return this.#buildByPlan(roomData);
        }
    }

    /**
     * Takes a data object specifying the layout of a room and
     * creates a Room instance from it
     * 
     * @method module:RoomFactory#buildByPlan
     * 
     * @param {Object} roomData A data object specifying the layout of
     *                          the room that is supposed to be created
     *  
     * @returns {Room} The fully built room
     */
    #buildByPlan = function(roomData) {
        let type = (roomData.TYPE !== undefined) ? roomData.TYPE : TypeOfRoom.CUSTOM;
        let room = new Room(roomData.ID, roomData.NAME, type, roomData.WIDTH, roomData.LENGTH);

        let listOfMapElements = [];
        let listOfGameObjects = [];
        let listOfDoors = [];
        let listOfNPCs = [];

        // ADD TILES
        for (var i = 0; i < room.getLength(); i++) {
            for (var j = 0; j < room.getWidth(); j++) {
                listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.TILE, i, j, false));
            }
        }

        // ADD LEFT WALLS
        for (var i = 0; i < room.getLength(); i++) {
            listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.LEFTWALL, i, -1, false));
        }

        // ADD RIGHT WALLS
        for (var j = 0; j < room.getWidth(); j++) {
            listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType.RIGHTWALL, room.getLength(), j, false));
        }

        // ADD MAPELEMENTS
        // this includes windows, schedule usw.
        // objData = {type, position, isClickable, iFrameData, story, variation}
        roomData.MAPELEMENTS.forEach(objData => {
            this.#decodePositionDataAndCreate(roomData.ID, objData, listOfMapElements)
        })

        // ADD OBJECTS
        // tables, plants, food and more
        // objData = {type, position, isClickable, iFrameData, story, variation}
        roomData.OBJECTS.forEach(objData => {
            this.#decodePositionDataAndCreate(roomData.ID, objData, listOfGameObjects)
        })

        // ADD DOORS
        // doorData = {wallSide, logo, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen}
        roomData.DOORS.forEach(doorData => {     
            if (doorData.logo === undefined) {
                doorData.logo = "default";
            }

            let logo = this.#getDoorLogo(doorData.logo, doorData.wallSide);
            if (doorData.isOpen === undefined) {
                listOfDoors.push(
                    this.#doorService.createCustomDoor(logo,
                        doorData.wallSide,
                        new Position(roomData.ID,
                            doorData.positionOfDoor[0],
                            doorData.positionOfDoor[1]),
                        new Position(doorData.positionOnExit[0],
                            doorData.positionOnExit[1],
                            doorData.positionOnExit[2]),
                        doorData.directionOnExit,
                        true, // isOpen
                        DoorClosedMessages.STANDARDDOORCLOSED) // closedMessage
                );         
            } else {
                // this requires error handling for when a door
                // is defined as closed but there is no message
                // or code to open defined
                if (doorData.closedMessage === undefined) {
                    doorData.closedMessage = DoorClosedMessages.STANDARDDOORCLOSED
                }
                listOfDoors.push(
                    this.#doorService.createCustomDoor(logo,
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
            let xPos = (doorData.wallSide == GlobalStrings.RIGHT) ? doorData.positionOfDoor[0] + 1 : doorData.positionOfDoor[0];
            let yPos = (doorData.wallSide == GlobalStrings.LEFT) ? doorData.positionOfDoor[1] - 1 : doorData.positionOfDoor[1];

            listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType[doorData.wallSide + "TILE"], xPos, yPos, false))

        })

        // ADD LECTURE DOORS 
        // This is only needed if this conference uses the lecture feature and video storage is activated in Settings
        // Otherwise, it can be ignored
        // lectureDoorData = {wallSide, logo, positionOfDoor, isOpen, closedMessage, codeToOpen}        
        if (Settings.VIDEOSTORAGE_ACTIVATED && roomData.LECTUREDOORS !== undefined) {
            roomData.LECTUREDOORS.forEach(lectureDoorData => {   
                if (lectureDoorData.logo === undefined) {
                    lectureDoorData.logo = "default";
                }
        
                let logo = this.#getDoorLogo(lectureDoorData.logo, lectureDoorData.wallSide);
                if (lectureDoorData.isOpen === undefined) {
                    listOfDoors.push(
                        this.#doorService.createCustomLectureDoor(logo,
                            lectureDoorData.wallSide,
                            new Position(roomData.ID,
                                lectureDoorData.positionOfDoor[0],
                                lectureDoorData.positionOfDoor[1]),
                            true, // isOpen
                            DoorClosedMessages.STANDARDDOORCLOSED) // closedMessage
                    );         
                } else {
                    // this requires error handling for when a door
                    // is defined as closed but there is no message
                    // or code to open defined
                    if (lectureDoorData.closedMessage === undefined) {
                        lectureDoorData.closedMessage = DoorClosedMessages.STANDARDDOORCLOSED
                    }
                    listOfDoors.push(
                        this.#doorService.createCustomLectureDoor(logo,
                            lectureDoorData.wallSide,
                            new Position(roomData.ID,
                                lectureDoorData.positionOfDoor[0],
                                lectureDoorData.positionOfDoor[1]),
                            lectureDoorData.isOpen,
                            lectureDoorData.closedMessage,
                            lectureDoorData.codeToOpen)
                    );
                }
                
                // Create tile inside of door
                // if door is on the left side, same x, one less y
                // if door is on the right side, same y, one more x
                let xPos = (lectureDoorData.wallSide == GlobalStrings.RIGHT) ? lectureDoorData.positionOfDoor[0] + 1 : lectureDoorData.positionOfDoor[0];
                let yPos = (lectureDoorData.wallSide == GlobalStrings.LEFT) ? lectureDoorData.positionOfDoor[1] - 1 : lectureDoorData.positionOfDoor[1];

                listOfMapElements.push(this.#objService.createCustomObject(roomData.ID, GameObjectType[lectureDoorData.wallSide + "TILE"], xPos, yPos, false))
            });
        }

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

    /**
     * Take the desired name & variant of a logo and gets it from
     * the DoorLogos-object.
     * 
     * @method module:RoomFactory#getDoorLogo
     * 
     * @param {String} logoName name of the logo
     * @param {String} logoVariant variant of the logo
     *  
     * @returns {String} The key for the image asset of the logo
     */
    #getDoorLogo = function (logoName, logoVariant) {
        if (DoorLogos.hasOwnProperty(logoName)) {
            let logo = DoorLogos[logoName];
            return logo[logoVariant];
        } else {
            throw new Error(logoName + " is not a legal argument for the door logo value");
        }
        
    }

    /**
     * Decoded the position-field of the object data, which exists in
     * three 'flavors':
     *   (i) [xPos, yPos]
     *  (ii) [xPos, [yPos1, yPos2, ...]] (and vice versa)
     * (iii) array of a mixture of the two variants above
     * and creates copies of the object defined by the object data
     * accordingly.
     * 
     * @method module:RoomFactory#decodePositionDataAndCreate
     * 
     * @param {Int} roomId id of the room we're putting stuff into
     * @param {Object} objData data of the object we're creating
     * @param {Array[Object]} listToPushInto list the final object is 
     *                                       being put into
     */
    #decodePositionDataAndCreate = function (roomId, objData, listToPushInto) {
            // Not the cleanest way, but workable
            if (objData.position.every(element => Array.isArray(element))) {
                objData.position.forEach( position => {
                    // copy objData
                    let creationData = Object.assign( {}, objData )
                    // set positions to proper value
                    creationData.position = position;
                    this.#decodePositionDataAndCreate(roomId, creationData, listToPushInto);
                })
            } else if (objData.position.some(element => Array.isArray(element)) && objData.position.some(element => !Array.isArray(element))) { 
                // we assume that position has only two fields
                let line = (objData.position[0] instanceof Array) ? objData.position[0] : objData.position[1];
                for (let i = 0; i < line.length; i++) {
                    // copy objData
                    let creationData = Object.assign( {}, objData )
                    // set positions to proper value
                    creationData.position = (objData.position[0] instanceof Array) ? [line[i], objData.position[1]] : [objData.position[0], line[i]];
                    this.#createObjectsFromData(roomId, creationData, listToPushInto);
                }
            } else {
                this.#createObjectsFromData(roomId, objData, listToPushInto);
            }
    }

    /**
     * Takes a data object defining a GameObject-instance to
     * be created, reads it out and then creates all instances
     * of the GameObject-class specified by the data object
     * by calling the GameObjectService
     * 
     * This is a very hacky solution and not super nice, there
     * is no polymorphism and a tom of conditionals.
     * TODO it would be nice if this could be refactored in the
     *      near future.
     * 
     * @method module:RoomFactory#createObjectsFromData
     * 
     * @param {Int} roomId id of the room we're putting stuff into
     * @param {Object} objData data of the object we're creating
     * @param {Array[Object]} listToPushInto list the final object is 
     *                                       being put into
     */
    #createObjectsFromData = function (roomId, objData, listToPushInto) {
        // TODO support for custom options
        if (objData.isClickable === undefined) {
            objData.isClickable = false;
            objData.iFrameData = undefined;
        }
        // This is the only place where this class needs to
        // access the GameObjectInfo, which doesn't sit well
        // with me...
        if (GameObjectInfo.hasProperty(objData.type, "hasAdditionalParts")) {
            let parts = GameObjectInfo.getInfo(objData.type, "parts");
            parts.forEach( partData => {
                this.#createObjectsFromData(roomId, {
                    type: partData.type,
                    position: [ objData.position[0] + partData.offset_x, objData.position[1] + partData.offset_y ],
                    isClickable: objData.isClickable,
                    iFrameData: objData.iFrameData,
                    story: objData.story,
                    variation: partData.variation
                }, listToPushInto)
            })
        }
        if (GameObjectInfo.hasProperty(objData.type, "isMultiPart")) {
            var size = GameObjectInfo.getInfo(objData.type, "size");
            var width = GameObjectInfo.getInfo(objData.type, "width");
            var length = GameObjectInfo.getInfo(objData.type, "length");
            for (let i = 0; i < size[0]; i ++) {
                let assets = GameObjectInfo.getInfo(objData.type, "assetName");
                if (assets[i] instanceof Array) {
                    for (let j = 0; j < Math.min(size[1], assets[i].length); j ++) {
                        listToPushInto.push(this.#objService.createObjectPart(roomId,
                            objData.type,
                            objData.position[0] + i * length,
                            objData.position[1] + j * width,
                            objData.isClickable,
                            objData.iFrameData,
                            objData.story,
                            { x: i, y: j }))
                    }
                } else {
                    listToPushInto.push(this.#objService.createObjectVariation(roomId,
                        objData.type,
                        objData.position[0] + i * length,
                        objData.position[1],
                        objData.isClickable,
                        objData.iFrameData,
                        objData.story,
                        i
                    ));
                }
            }
            
        } else if (GameObjectInfo.hasProperty(objData.type, "hasVariation")) {
            // if no variation defined, set to default,
            // else do nothing
            objData.variation == undefined ? objData.variation = 0 : {};
            listToPushInto.push(this.#objService.createObjectVariation(
                roomId,
                objData.type,
                objData.position[0],
                objData.position[1],
                objData.isClickable,
                objData.iFrameData,
                objData.story,
                objData.variation
            ));           
        } else {
            listToPushInto.push(this.#objService.createCustomObject(
                roomId,
                objData.type,
                objData.position[0],
                objData.position[1],
                objData.isClickable,
                objData.iFrameData,
                objData.story
            ));
        }      
    }

}