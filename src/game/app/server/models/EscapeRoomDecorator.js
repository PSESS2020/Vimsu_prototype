const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');
const Room = require('./Room');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Messages = require('../utils/Messages.js');
const RoomDimensions = require('../utils/RoomDimensions.js');

/**
 * The Escape Room Decorator Model
 * @module EscapeRoomDecorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class EscapeRoomDecorator extends RoomDecorator {
    #room;

    #assetPaths = {
        "tile_default": "client/assets/tiles/tile_default.png",
        "leftwall_default": "client/assets/walls/wall1.png",
        "rightwall_default": "client/assets/walls/wall2.png",
        "rightfoodcourtdoor_default": "client/assets/doors/door_foodcourt.png",
        "rightwindow_default0": "client/assets/windows/right_small_window_default0.png",
        "plant_default": "client/assets/plants/plant.png",
        "smalldinnertable_default": "client/assets/tables/smallDinnerTable.png"
    }

    /**
     * Creates a RoomDecorator instance for Escape Room
     * @constructor module:EscapeRoomDecorator
     * 
     * @param {Room} room escape room instance
     */
    constructor(room) {
        super();

        TypeChecker.isInstanceOf(room, Room);
        this.#room = room;

        let objService = new GameObjectService();

        /* Get all map elements from service */

        //Get tiles
        let listOfMapElements = [];

        for (var i = 0; i < this.#room.getLength(); i++) {
            for (var j = 0; j < this.#room.getWidth(); j++) {
                listOfMapElements.push(objService.createDefaultTile(Settings.ESCAPEROOM_ID, i, j, false, false));
            }
        }

        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.ESCAPEROOM_ID, 1, 1, i, -1, false, false));
        }

        //Get right walls
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.ESCAPEROOM_ID, 1, 1, this.#room.getLength(), j, false, false));
        }

        //Get all gameObjects from service
        let listOfGameObjects = [];

        listOfGameObjects.push(objService.createPlant(Settings.ESCAPEROOM_ID, this.#room.getLength() - 1, 0, true, false));
        listOfGameObjects.push(objService.createPlant(Settings.ESCAPEROOM_ID, this.#room.getLength() - 1, this.#room.getWidth() - 1, true, false));

        /* This Object is here for IFrame-Testing */
        listOfGameObjects.push(objService.createSmallDinnerTable(Settings.ESCAPEROOM_ID, 0, 0, true, true));

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createFoodCourtDoor(new Position(Settings.ESCAPEROOM_ID, this.#room.getLength(), this.#room.getWidth() - 5), new Position(Settings.FOODCOURT_ID, RoomDimensions.FOODCOURT_LENGTH - 1, RoomDimensions.FOODCOURT_WIDTH - 2), Direction.DOWNLEFT, true, Messages.STANDARDDOORCLOSED));
        listOfMapElements.push(objService.createDefaultRightTile(Settings.ESCAPEROOM_ID, this.#room.getLength() + 1, this.#room.getWidth() - 5, false, false));

        //Assign lists to room and build occupation map
        this.#room.setMapElements(listOfMapElements);
        this.#room.setGameObjects(listOfGameObjects);
        this.#room.setNPCs(listOfNPCs);
        this.#room.setDoors(listOfDoors);
        this.#room.buildOccMap();
    }

    /**
     * Gets escape room
     * @method module:EscapeRoomDecorator#getRoom
     * 
     * @return {Room} room
     */
    getRoom() {
        return this.#room;
    }

    /**
     * Gets asset paths of escape room objects
     * @method module:EscapeRoomDecorator#getAssetPaths
     * 
     * @return {Object} assetPaths
     */
    getAssetPaths() {
        return this.#assetPaths;
    }
}