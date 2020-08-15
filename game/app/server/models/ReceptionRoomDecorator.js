
const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class ReceptionRoomDecorator extends RoomDecorator {
    #room;

    #assetPaths = {
        "tile_default": "client/assets/tile_default.png",
        "leftwall_default": "client/assets/wall1.png",
        "rightwall_default": "client/assets/wall2.png",
        "leftfoyerdoor_default": "client/assets/door_foyer.png",
        "leftconferencelogo_default0": "client/assets/conferencelogo1.png",
        "leftconferencelogo_default1": "client/assets/conferencelogo2.png",
        "leftconferencelogo_default2": "client/assets/conferencelogo3.png",
        "leftconferencelogo_default3": "client/assets/conferencelogo4.png",
        "leftconferencelogo_default4": "client/assets/conferencelogo5.png",
        "table_default": "client/assets/table.png",
    }

    constructor(room) {
        super();
        this.#room = room;

        let objService = new GameObjectService();

        /* Get all map elements from service */

        //Get tiles
        let listOfMapElements = [];

        for (var i = 0; i < this.#room.getLength(); i++) {

            for(var j = 0; j < this.#room.getWidth(); j++) {
                listOfMapElements.push(objService.createDefaultTile(Settings.RECEPTION_ID, i, j, false));
            }

        }

        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.RECEPTION_ID, 1, 1, i, -1, false));
        }

        //Get right walls
        for(var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.RECEPTION_ID, 1, 1, this.#room.getLength(), j, false));
        }


        //Get all gameObjects from service
        let listOfGameObjects = [];

        for (var i = 3; i <= 9; i++) {
            listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 10, i, true));
        }
        listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 11, 9, true),
            objService.createTable(Settings.RECEPTION_ID, 12, 9, true),
            objService.createTable(Settings.RECEPTION_ID, 11, 3, true),
            objService.createTable(Settings.RECEPTION_ID, 12, 3, true));

        let conferenceLogos = objService.createLeftConferenceLogo(Settings.RECEPTION_ID, 1, 5, 5, -1, false);
        conferenceLogos.forEach(conferenceLogo => {
            listOfGameObjects.push(conferenceLogo);
        });

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createBasicTutorialNPC(Settings.RECEPTION_ID, 11, 6, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.RECEPTION_ID, 2, -1), new Position(Settings.FOYER_ID, 24, 21), Direction.DOWNLEFT));
        listOfMapElements.push(objService.createDefaultLeftTile(Settings.RECEPTION_ID,  2, -2, false));

        //Assign lists to room and build occupation map
        this.#room.setMapElements(listOfMapElements);
        this.#room.setGameObjects(listOfGameObjects);
        this.#room.setNPCs(listOfNPCs);
        this.#room.setDoors(listOfDoors);
        this.#room.buildOccMap();
    }

    getRoom() {
        return this.#room;
    }

    getAssetPaths() {
        return this.#assetPaths;
    }
}