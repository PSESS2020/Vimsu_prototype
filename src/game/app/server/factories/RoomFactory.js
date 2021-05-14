const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Room = require('../models/Room.js');
const Settings = require('../utils/' + process.env.SETTINGS_FILENAME);
const GameObjectFactory = require('./GameObjectFactory.js');
const DoorFactory = require('./DoorFactory.js');
const Position = require('../models/Position.js');
const NPCFactory = require('./NPCFactory.js');
const GameObjectType = require('../../client/shared/GameObjectType.js');
const GlobalStrings = require('../../client/shared/GlobalStrings.js');
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
    #objFactory;
    #doorFactory;
    #npcFactory;

    constructor() {
        if(!!RoomFactory.instance) {
            return RoomFactory.instance;
        }

        this.#objFactory = new GameObjectFactory();
        this.#doorFactory = new DoorFactory();
        this.#npcFactory = new NPCFactory();

        RoomFactory.instance = this;
    }

    // TODO: refactor this class

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
        // TODO add destructuring
        var type = (roomData.TYPE !== undefined) ? roomData.TYPE : TypeOfRoom.CUSTOM;
        var room = new Room(this.#roomID, roomData.NAME, type, roomData.WIDTH, roomData.LENGTH);

        room.addMapElements(
            this.#buildWallsAndTiles(
                room.getRoomId(),
                roomData.WALLSTYLE, 
                roomData.TILESTYLE, 
                room.getWidth(), 
                room.getLength()
            )
        )
        room.addMapElements(this.#buildMapElements(room.getRoomId(), roomData.MAPELEMENTS));
        room.setGameObjects(this.#buildGameObjects(room.getRoomId(), roomData.OBJECTS));
        room.setNPCs(this.#buildNPCs(room.getRoomId(), roomData.NPCS));
        room.setDoors(this.#buildDoors(room.getRoomId(), roomData.DOORS));

        room.buildOccMap();
        return room;
    }

    /**
     * 
     * @param {String} wallstyle The desired wall variation
     * @param {String} tilestyle The desired tile variation
     * @param {integer} width    The width of the room
     * @param {integer} length   The length of the room
     *  
     * @returns {GameObject[]}   An array containing all wall and tile objects
     *                           that make up the room
     */
    #buildWallsAndTiles = function (roomId, wallstyle, tilestyle, width, length) {
        var listOfWallsAndTiles = []
        if (wallstyle === undefined) wallstyle = GlobalStrings.DEFAULT
        if (tilestyle === undefined) tilestyle = GlobalStrings.DEFAULT
        // ADD TILES
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < width; j++) {
                listOfWallsAndTiles-push( this.#objFactory.createGameObject(roomId, { type: GameObjectType.TILE, position: [i, j], variation: tilestyle }) )
            }
        }
        // ADD LEFT WALLS
        for (var i = 0; i < length; i++) {
            listOfWallsAndTiles-push( this.#objFactory.createGameObject(roomId, { type: GameObjectType.LEFTWALL, position: [i, -1], variation: wallstyle }) )
        }
        // ADD RIGHT WALLS
        for (var j = 0; j < width; j++) {
            listOfWallsAndTiles-push( this.#objFactory.createGameObject(roomId, { type: GameObjectType.LEFTWALL, position: [length, j], variation: wallstyle }) )
        }
        return listOfWallsAndTiles
    }

    /**
     * Takes a list of data-packets, formatted as JSON, parses the relevant data
     * and passes it to GameObjectFactory to create new GameObject instances.
     * 
     * @param {Array of { type:         GameObjectType, 
     *                    position:     int[2],
     *                    ?variation:   String,
     *                    ?isClickable: Boolean,
     *                    ?iFrameData:  { title:  String,
     *                                    url:    String,
     *                                    width:  number,
     *                                    height: number },
     *                    ?story:       String             
     *                    ?width:       int,
     *                    ?length:      int,
     *                    ?isSolid:     Boolean,
     *                    ?assetSet:    String[] OR String[][] }} mapElements
     * 
     * @returns {GameObject[]} Array of newly created map elements.
     */
    #buildMapElements = function (roomId, mapElements) {
        let listOfElements = []
        // ADD MAPELEMENTS
        // this includes windows, schedule usw.
        // objData = {type, position, isClickable, iFrameData, story, variation}
        mapElements.forEach(objData => {
            this.#decodePositionDataAndCreate(roomId, objData, listOfElements)
        })
        return listOfElements
    }

    /**
     * Takes a list of data-packets, formatted as JSON, parses the relevant data
     * and passes it to GameObjectFactory to create new GameObject instances.
     * 
     * @param {Array of { type:         GameObjectType, 
     *                    position:     int[2],
     *                    ?variation:   String,
     *                    ?isClickable: Boolean,
     *                    ?iFrameData:  { title:  String,
     *                                    url:    String,
     *                                    width:  number,
     *                                    height: number },
     *                    ?story:       String             
     *                    ?width:       int,
     *                    ?length:      int,
     *                    ?isSolid:     Boolean,
     *                    ?assetSet:    String[] OR String[][] }} gameObjects
     *  
     * @returns {GameObject[]} Array of newly created game objects.
     */
    #buildGameObjects = function (roomId, gameObjects) {
        let listOfObjects = []
        // ADD OBJECTS
        // tables, plants, food and more
        // objData = {type, position, isClickable, iFrameData, story, variation}
        gameObjects.forEach(objData => {
            this.#decodePositionDataAndCreate(roomId, objData, listOfObjects)
        })
        return listOfObjects
    }

    /**
     * Takes a list of data-packets, formatted as JSON, parses the relevant data
     * and passes it to the NPCfactory to create new NPC instances.
     * 
     * @param { Array of { name:      String,
     *                     position:  int[2], 
     *                     direction: Direction,
     *                     dialog:    String[]  } } npcs
     *  
     * @returns {NPC[]} An array of all created NPCs
     */
    #buildNPCs = function (roomId, npcs) {
        let listOfNPCs = []
        npcs.forEach(npcData => {
            listOfNPCs.push(
                this.#npcFactory.createCustomNPC(
                    npcData.name, // npc name
                    roomId,  // roomID of position
                    npcData.position[0], // x coordinate of position
                    npcData.position[1], // y coordinate of position
                    npcData.direction,   // direction npc is facing
                    npcData.dialog       // what the npc says when
                                         // talked to
                )
            )
        })
        return listOfNPCs
    }

    /**
     * 
     * @param {*} doors 
     */
    #buildDoors = function (roomId, doors) {
        // TODO rewrite

        // TODO this no longer knows roomData-Object
        let listOfDoors = []
        // ADD DOORS
        // doorData = {wallSide, logo, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen}
        doors.forEach(doorData => {     
            if (doorData.logo === undefined) {
                doorData.logo = "default";
            }

            let logo = this.#getDoorLogo(doorData.logo, doorData.wallSide);
            if (doorData.isOpen === undefined) {
                listOfDoors.push(
                    this.#doorFactory.createCustomDoor(logo,
                        doorData.wallSide,
                        new Position(this.#roomID,
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
                    this.#doorFactory.createCustomDoor(logo,
                        doorData.wallSide,
                        new Position(this.#roomID,
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

            listOfMapElements.push(this.#objFactory.createCustomObject(this.#roomID, GameObjectType[doorData.wallSide + "TILE"], xPos, yPos, false))

        })

        // TODO redo
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
                        this.#doorFactory.createCustomLectureDoor(logo,
                            lectureDoorData.wallSide,
                            new Position(this.#roomID,
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
                        this.#doorFactory.createCustomLectureDoor(logo,
                            lectureDoorData.wallSide,
                            new Position(this.#roomID,
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

                listOfMapElements.push(this.#objFactory.createCustomObject(this.#roomID, GameObjectType[lectureDoorData.wallSide + "TILE"], xPos, yPos, false))
            });
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
     * @param {Array[Object]} listToAppend list the final object is 
     *                                     being put into
     */
    #decodePositionDataAndCreate = function (roomId, objData, listToAppend) {
        // Not the cleanest way, but workable
        // TODO refactor
        if (objData.position.every(element => Array.isArray(element))) {
            objData.position.forEach( position => {
                // copy objData
                let creationData = Object.assign( {}, objData )
                // set positions to proper value
                creationData.position = position;
                this.#decodePositionDataAndCreate(roomId, creationData, listToAppend);
            })
        } else if (objData.position.some(element => Array.isArray(element)) && objData.position.some(element => !Array.isArray(element))) { 
            // we assume that position has only two fields
            let line = (objData.position[0] instanceof Array) ? objData.position[0] : objData.position[1];
            for (let i = 0; i < line.length; i++) {
                // copy objData
                let creationData = Object.assign( {}, objData )
                // set positions to proper value
                creationData.position = (objData.position[0] instanceof Array) ? [line[i], objData.position[1]] : [objData.position[0], line[i]];
                this.#objFactory.createGameObject(roomId, creationData).forEach(elem => listToAppend.push(elem))
            }
        } else {
            this.#objFactory.createGameObject(roomId, objData).forEach(elem => listToAppend.push(elem))
        }
    }

}