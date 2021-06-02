const Settings = require('../utils/' + process.env.SETTINGS_FILENAME);
const TypeOfRoom = require('../../../client/shared/TypeOfRoom.js');
const Room = require('../mapobjects/Room.js');
const GameObjectFactory = require('./GameObjectFactory.js');
const DoorFactory = require('./DoorFactory.js');
const Position = require('../Position.js');
const NPCFactory = require('./NPCFactory.js');
const DoorClosedMessages = require('../utils/messages/DoorClosedMessages.js');
const GameObjectType = require('../../../client/shared/GameObjectType.js');
const GlobalStrings = require('../../../client/shared/GlobalStrings.js');
const GameObjectInfo = require('../../utils/GameObjectInfo.js');
const DoorLogos = require('../../utils/DoorLogos.js');

/**
 * Churns out Room instances. Singleton.
 * @module RoomFactory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class RoomFactory {
    #objFactory;
    #doorFactory;
    #npcFactory;

    constructor() {
        if(!!RoomFactory.instance) {
            return RoomFactory.instance;
        }

        this.#objFactory  = new GameObjectFactory();
        this.#doorFactory = new DoorFactory();
        this.#npcFactory  = new NPCFactory();

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
        const { ID, NAME, WIDTH, LENGTH, MAPELEMENTS, OBJECTS, NPCS, DOORS } = roomData
        var { TYPE, WALLSTYLE, TILESTYLE, LECTUREDOORS } = roomData

        if (TYPE      === undefined) { TYPE      = TypeOfRoom.DEFAULT    }
        if (WALLSTYLE === undefined) { WALLSTYLE = GlobalStrings.DEFAULT }
        if (TILESTYLE === undefined) { TILESTYLE = GlobalStrings.DEFAULT }

        if (LECTUREDOORS !== undefined) { LECTUREDOORS.forEach(doorData => DOORS.push(Object.assign({ isLectureDoor: true }, doorData))) }

        var room = new Room(ID, NAME, TYPE, WIDTH, LENGTH);

        room.setMapElements( this.#buildWallsAndTiles(ID, WALLSTYLE, TILESTYLE, WIDTH, LENGTH) )
        // TODO this can probably be done with Array.flat()
        room.addMapElements( this.#buildObjects(ID, MAPELEMENTS) );
        room.setGameObjects( this.#buildObjects(ID, OBJECTS) );
        room.setNPCs( NPCS.map(npcData => this.#npcFactory.createNPC(Object.assign({ roomId: ID }, npcData))) )
        room.setDoors( DOORS.map(doorData => { 
            var { wallSide, positionOfDoor: [xPos, yPos] } = doorData
            let type = GameObjectType[wallSide + "TILE"]
            room.addMapElements( this.#objFactory.createGameObject(ID, { type, 
                position: [ 
                    ((wallSide === GlobalStrings.RIGHT) ? (xPos + 1) : xPos), 
                    ((wallSide === GlobalStrings.LEFT) ? (yPos - 1) : yPos) 
                ], 
                variation: TILESTYLE }) )
            return this.#doorFactory.createDoor(Object.assign({ roomId: ID }, doorData))
        }) )

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
        // ADD TILES
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < width; j++) {
                var newElems = this.#objFactory.createGameObject(roomId, { type: GameObjectType.TILE, position: [i, j], variation: tilestyle })
                listOfWallsAndTiles = [...listOfWallsAndTiles, ...newElems]
            }
        }
        // ADD LEFT WALLS
        for (var i = 0; i < length; i++) {
            var newElems = this.#objFactory.createGameObject(roomId, { type: GameObjectType.LEFTWALL, position: [i, -1], variation: wallstyle })
            listOfWallsAndTiles = [...listOfWallsAndTiles, ...newElems]
        }
        // ADD RIGHT WALLS
        for (var j = 0; j < width; j++) {
            var newElems = this.#objFactory.createGameObject(roomId, { type: GameObjectType.LEFTWALL, position: [length, j], variation: wallstyle })
            listOfWallsAndTiles = [...listOfWallsAndTiles, ...newElems]
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
     *                    ?assetSet:    String[] OR String[][] }} gameObjects
     *  
     * @returns {GameObject[]} Array of newly created game objects.
     */
    #buildObjects = function (roomId, gameObjects) {
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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = RoomFactory;
}