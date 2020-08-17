const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class FoodcourtRoomDecorator extends RoomDecorator {
    #room;

    #assetPaths = {
        "tile_default": "client/assets/tiles/tile_default.png",
        "leftwall_default": "client/assets/walls/wall1.png",
        "rightwall_default": "client/assets/walls/wall2.png",
        "leftfoyerdoor_default": "client/assets/doors/door_foyer.png",
        "rightwindow_default": "client/assets/windows/right_small_window_default.png",
        "leftconferencelogo_default0": "client/assets/logos/conferencelogo1.png",
        "leftconferencelogo_default1": "client/assets/logos/conferencelogo2.png",
        "leftconferencelogo_default2": "client/assets/logos/conferencelogo3.png",
        "leftconferencelogo_default3": "client/assets/logos/conferencelogo4.png",
        "leftconferencelogo_default4": "client/assets/logos/conferencelogo5.png",
        "table_default": "client/assets/tables/table.png"
    }

    constructor(room) {
        super();
        this.#room = room;

        let objService = new GameObjectService();

        /* Get all map elements from service */

        //Get tiles
        let listOfMapElements = [];

        for (var i = 0; i < this.#room.getLength(); i++) {

            for (var j = 0; j < this.#room.getWidth(); j++) {
                listOfMapElements.push(objService.createDefaultTile(Settings.FOODCOURT_ID, i, j, false, false));
            }

        }

        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.FOODCOURT_ID, 1, 1, i, -1, false, false));
        }

        //Get right walls
        for (var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.FOODCOURT_ID, 1, 1, this.#room.getLength(), j, false, false));
        }

        //Get all gameObjects from service
        let listOfGameObjects = [];

        //Get tables
        for (var i = 2; i <= 10; i++) {
            listOfGameObjects.push(objService.createTable(Settings.FOODCOURT_ID, 10, i, true, false),
                objService.createTable(Settings.FOODCOURT_ID, 8, i, true, false),
                objService.createTable(Settings.FOODCOURT_ID, 6, i, true, false),
                objService.createTable(Settings.FOODCOURT_ID, 4, i, true, false),
                objService.createTable(Settings.FOODCOURT_ID, 2, i, true, false));
        }

        //Get logos
        let conferenceLogos = objService.createLeftConferenceLogo(Settings.FOODCOURT_ID, 1, 5, 5, -1, false, false);
        conferenceLogos.forEach(conferenceLogo => {
            listOfGameObjects.push(conferenceLogo);
        });

        //Get windows
        for (i = 3; i <= 4; i++) {
            for (j = 0; j <= 5; j += 5) {
                listOfGameObjects.push(objService.createRightWindow(Settings.FOYER_ID, 1, 1, this.#room.getLength(), i + j, false, false))
            }
        }

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createChefNPC(Settings.FOODCOURT_ID, 12, 6, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.FOODCOURT_ID, 2, -1), new Position(Settings.FOYER_ID, 24, 2), Direction.DOWNLEFT));
        listOfMapElements.push(objService.createDefaultLeftTile(Settings.FOODCOURT_ID, 2, -2, false, false));

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