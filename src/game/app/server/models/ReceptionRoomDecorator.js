const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');
const Room = require('./Room');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const DoorClosedMessages = require('../utils/messages/DoorClosedMessages.js');

/**
 * The Reception Room Decorator Model
 * @module ReceptionRoomDecorator
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class ReceptionRoomDecorator extends RoomDecorator {
    #room;

    #assetPaths = {
        "tile_default": "../client/assets/tiles/tile_default.png",
        "leftwall_default": "../client/assets/walls/wall1.png",
        "rightwall_default": "../client/assets/walls/wall2.png",
        "leftfoyerdoor_default": "../client/assets/doors/door_foyer.png",
        "rightwindow_default0": "../client/assets/windows/right_small_window_default0.png",
        "leftconferencelogo_default0": "../client/assets/logos/conferencelogo1.png",
        "leftconferencelogo_default1": "../client/assets/logos/conferencelogo2.png",
        "leftconferencelogo_default2": "../client/assets/logos/conferencelogo3.png",
        "leftconferencelogo_default3": "../client/assets/logos/conferencelogo4.png",
        "leftconferencelogo_default4": "../client/assets/logos/conferencelogo5.png",
        "plant_default": "../client/assets/plants/plant.png",
        "receptionCounterFrontPart_default": "../client/assets/other/ReceptionCounterFrontPart.png",
        "receptionCounterLeftPart_default": "../client/assets/other/ReceptionCounterBackPartLeft.png",
        "receptionCounterRightPart_default": "../client/assets/other/ReceptionCounterBackPartRight.png",
    }

    /**
     * Creates a RoomDecorator instance for Reception
     * @constructor module:ReceptionRoomDecorator
     * 
     * @param {Room} room reception room instance
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
                listOfMapElements.push(objService.createDefaultTile(Settings.RECEPTION_ID, i, j, false, false));
            }
        }

        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.RECEPTION_ID, 1, 1, i, -1, false, false));
        }

        //Get right walls
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.RECEPTION_ID, 1, 1, this.#room.getLength(), j, false, false));
        }

        //Get all gameObjects from service
        let listOfGameObjects = [];

        //Reception Counter
        listOfGameObjects.push(objService.createReceptionCounterLeftPart(Settings.RECEPTION_ID, 1, 1, 11, 3, true, false),
                               objService.createReceptionCounterRightPart(Settings.RECEPTION_ID, 1, 1, 11, 9, true, false),
                               objService.createReceptionCounterFrontPart(Settings.RECEPTION_ID, 1, 7, 10, 3, true, false));

        let conferenceLogos = objService.createLeftConferenceLogo(Settings.RECEPTION_ID, 1, 5, 5, -1, false, false);
        conferenceLogos.forEach(conferenceLogo => {
            listOfMapElements.push(conferenceLogo);
        });

        listOfGameObjects.push(objService.createPlant(Settings.RECEPTION_ID, this.#room.getLength() - 1, 0, true, false));
        listOfGameObjects.push(objService.createPlant(Settings.RECEPTION_ID, this.#room.getLength() - 1, this.#room.getWidth() - 1, true, false));

        for (i = 5; i < this.#room.getWidth() - 5; i++) {
            listOfMapElements.push(objService.createRightWindowDefault(Settings.RECEPTION_ID, 1, 1, this.#room.getLength(), i, false, false))
        }

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createBasicTutorialNPC(Settings.RECEPTION_ID, 11, 6, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.RECEPTION_ID, 2, -1), new Position(Settings.FOYER_ID, 24, 21), Direction.DOWNLEFT, false, DoorClosedMessages.FIRSTDOORCLOSED));
        listOfMapElements.push(objService.createDefaultLeftTile(Settings.RECEPTION_ID, 2, -2, false, false));

        //Assign lists to room and build occupation map
        this.#room.setMapElements(listOfMapElements);
        this.#room.setGameObjects(listOfGameObjects);
        this.#room.setNPCs(listOfNPCs);
        this.#room.setDoors(listOfDoors);
        this.#room.buildOccMap();
    }

    /**
     * Gets reception room
     * @method module:ReceptionRoomDecorator#getRoom
     * 
     * @return {Room} room
     */
    getRoom() {
        return this.#room;
    }

    /**
     * Gets asset paths of reception room objects
     * @method module:ReceptionRoomDecorator#getAssetPaths
     * 
     * @return {Object} assetPaths
     */
    getAssetPaths() {
        return this.#assetPaths;
    }
}
