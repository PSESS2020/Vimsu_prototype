
const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../utils/Direction.js');
const Settings = require('../../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class ReceptionRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;
        
        //Get all gameObjects from service
        let objService = new GameObjectService();
        let listOfGameObjects = [];

        for (var i = 3; i <= 9; i++) {
            listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 1, 1, 10, i, true));
        }
        listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 1, 1, 11, 9, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 12, 9, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 11, 3, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 12, 3, true));

        //Get all npcs from service
        let npcService = new NPCService();
        let listOfNPCs = [];

        listOfNPCs.push(npcService.createBasicTutorialNPC(Settings.RECEPTION_ID, 11, 6, Direction.DOWNLEFT));

        //Get all doors from service
        let doorService = new DoorService();
        let listOfDoors = [];

        //enter positions for FoyerDoor
        let receptionFoyerEnterPositions = [];
        for (var i = 0; i <= 4; i++) {
            for (var j = 0; j <= 2; j++) {
                receptionFoyerEnterPositions.push(new Position(Settings.RECEPTION_ID, i, j));
            }
        }

        listOfDoors.push(doorService.createFoyerDoor(new Position(Settings.RECEPTION_ID, 2, 1), receptionFoyerEnterPositions, new Position(Settings.FOYER_ID, 24, 22), Direction.DOWNLEFT));

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