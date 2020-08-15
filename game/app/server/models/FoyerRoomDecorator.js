const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');

module.exports = class FoyerRoomDecorator extends RoomDecorator {
    #room;

    #assetPaths = {
        "tile_default": "client/assets/tile_default.png",
        "leftwall_default": "client/assets/wall1.png",
        "rightwall_default": "client/assets/wall2.png",
        "leftlecturedoor_default": "client/assets/door_lecturehall.png",
        "rightfoodcourtdoor_default": "client/assets/door_foodcourt.png",
        "rightreceptiondoor_default": "client/assets/door_reception.png",
        "leftfoyerdoor_default": "client/assets/door_foyer.png",
        "leftschedule_default0": "client/assets/schedule1.png",
        "leftschedule_default1": "client/assets/schedule2.png",
        "leftschedule_default2": "client/assets/schedule3.png",
        "leftconferencelogo_default0": "client/assets/conferencelogo1.png",
        "leftconferencelogo_default1": "client/assets/conferencelogo2.png",
        "leftconferencelogo_default2": "client/assets/conferencelogo3.png",
        "leftconferencelogo_default3": "client/assets/conferencelogo4.png",
        "leftconferencelogo_default4": "client/assets/conferencelogo5.png",
        "plant_default": "client/assets/plant.png",
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
                listOfMapElements.push(objService.createDefaultTile(Settings.FOYER_ID, i, j, false));
            }

        }
        
        //Get left walls
        for (var i = 0; i < this.#room.getLength(); i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.FOYER_ID, 1, 1, i, -1, false));
        }

        //Get right walls
        for(var j = 0; j < this.#room.getWidth(); j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.FOYER_ID, 1, 1, this.#room.getLength(), j, false));
        }

        /*//Get left doors
        listOfMapElements.push(objService.createDefaultLectureLeftDoor(Settings.FOYER_ID, ));

        //Get right doors
        listOfMapElements.push(objService.createDefaultReceptionRightDoor(),
                               objService.createDefaultFoodcourtRightDoor());

        */
        //Get all gameObjects from service
        let listOfGameObjects = [];

        for (var i = 4; i < 9; i++)
            listOfGameObjects.push(objService.createTable(Settings.FOYER_ID, i, 0, true));

        //Get schedule elements
        let schedules = objService.createLeftSchedule(Settings.FOYER_ID, 1, 3, 5, -1,false);
        schedules.forEach(schedule => {

            listOfGameObjects.push(schedule);

        });

        listOfGameObjects.push(objService.createPlant(Settings.FOYER_ID, this.#room.getWidth() - 1, 0, true));

        let conferenceLogos = objService.createLeftConferenceLogo(Settings.RECEPTION_ID, 1, 5, 14, -1, false);
        conferenceLogos.forEach(conferenceLogo => {
            listOfGameObjects.push(conferenceLogo);
        });

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createFoyerHelperNPC(Settings.FOYER_ID, 0, 0, Direction.DOWNRIGHT));


        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        listOfDoors.push(doorService.createLectureDoor(new Position(Settings.FOYER_ID, 2, -1)),
            doorService.createFoodCourtDoor(new Position(Settings.FOYER_ID, 25, 2), new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT),
            doorService.createReceptionDoor(new Position(Settings.FOYER_ID, 25, 21), new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));
        
        //Get door tiles
        listOfMapElements.push(objService.createDefaultLeftTile(Settings.FOYER_ID,  2, -2, false),
                               objService.createDefaultRightTile(Settings.FOYER_ID, 26, 2, false),
                               objService.createDefaultRightTile(Settings.FOYER_ID, 26, 21, false));

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