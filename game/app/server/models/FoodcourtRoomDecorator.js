const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../client/shared/Direction.js');
const Settings = require('../../client/shared/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class FoodcourtRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;

        //Get all gameObjects from service
        let objService = new GameObjectService();
        let listOfGameObjects = [];

        for (var i = 2; i <= 10; i++) {
            listOfGameObjects.push(objService.createTable(Settings.FOODCOURT_ID, 1, 1, 10, i, true),
                objService.createTable(Settings.FOODCOURT_ID, 1, 1, 8, i, true),
                objService.createTable(Settings.FOODCOURT_ID, 1, 1, 6, i, true),
                objService.createTable(Settings.FOODCOURT_ID, 1, 1, 4, i, true),
                objService.createTable(Settings.FOODCOURT_ID, 1, 1, 2, i, true));
        }

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createChefNPC(Settings.FOODCOURT_ID, 12, 6, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        //enter positions for FoyerDoor
        let foodCourtFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                foodCourtFoyerEnterPositions.push(new Position(Settings.FOODCOURT_ID, i, j));
            }
        }

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.FOODCOURT_ID, 2, 1), foodCourtFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 2), Direction.DOWNLEFT));

        //Assign lists to room and build occupation map
        this.#room.setGameObjects(listOfGameObjects);
        this.#room.setNPCs(listOfNPCs);
        this.#room.setDoors(listOfDoors);
        this.#room.buildOccMap();
    }

    getRoom() {
        return this.#room;
    }
}