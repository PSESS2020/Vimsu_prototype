const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../client/shared/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class FoyerRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;

        let objService = new GameObjectService();

        /* Get all map elements from service */

        //Get tiles
        let listOfMapElements = [];

        for (var i = 0, n = this.#room.getLength() - Settings.WALL_OFFSET; i < n; i++) {

            for(var j = 0, m = this.#room.getWidth() - Settings.WALL_OFFSET; j < m; j++) {
                listOfMapElements.push(objService.createDefaultTile(Settings.FOYER_ID, i, j, false));
            }

        }

        //Get left walls
        for (var i = 0, n = this.#room.getLength() - Settings.WALL_OFFSET; i < n; i++) {
            listOfMapElements.push(objService.createDefaultLeftWall(Settings.FOYER_ID, 1, 1, i, -1, false));
        }

        //Get right walls
        for(var j = 0, m = this.#room.getWidth() - Settings.WALL_OFFSET; j < m; j++) {
            listOfMapElements.push(objService.createDefaultRightWall(Settings.FOYER_ID, 1, 1, this.#room.getLength() - Settings.WALL_OFFSET, j, false));
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
            listOfGameObjects.push(objService.createTable(Settings.FOYER_ID, 1, 1, i, 0, true));


        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createFoyerHelperNPC(Settings.FOYER_ID, 0, 0, Direction.DOWNRIGHT));


        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        //enter positions for LectureDoor
        let lectureDoorEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                lectureDoorEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        //enter positions for FoodCourtDoor 
        let foyerFoodCourtEnterPositions = [];
        for (var i = 21; i <= 23; i++) {
            for (var j = 0; j <= 4; j++) {
                foyerFoodCourtEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        //enter positions for ReceptionDoor
        let foyerReceptionEnterPositions = [];
        for (var i = 21; i <= 23; i++) {
            for (var j = 19; j <= 23; j++) {
                foyerReceptionEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        listOfDoors.push(doorService.createLectureDoor(new Position(Settings.FOYER_ID, 2, -1), lectureDoorEnterPositions),
            doorService.createFoodCourtDoor(new Position(Settings.FOYER_ID, 24, 2), foyerFoodCourtEnterPositions, new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT),
            doorService.createReceptionDoor(new Position(Settings.FOYER_ID, 24, 21), foyerReceptionEnterPositions, new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));
        
        //Get door tiles
        listOfMapElements.push(objService.createDefaultLeftTile(Settings.FOYER_ID,  2, -2, false),
                               objService.createDefaultRightTile(Settings.FOYER_ID, 25, 2, false),
                               objService.createDefaultRightTile(Settings.FOYER_ID, 25, 21, false));

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
}