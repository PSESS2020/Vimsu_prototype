const RoomDecorator = require('../models/RoomDecorator.js');
const GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../utils/Direction.js');
const Settings = require('../../utils/Settings.js');
const DoorService = require('../services/DoorService.js');
const Position = require('./Position.js');


module.exports = class FoyerRoomDecorator extends RoomDecorator {
    #room;

    constructor(room) {
        super();
        this.#room = room;

        //Get all gameObjects from service
        let objService = new GameObjectService();
        let listOfGameObjects = [];

        for (var i = 4; i < 9; i++)
            listOfGameObjects.push(objService.createTable( Settings.FOYER_ID, 1, 1,  i, 0, true));


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
        for (var i = 22; i <= 24; i++) {
            for (var j = 0; j <= 4; j++) {
                foyerFoodCourtEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        //enter positions for ReceptionDoor
        let foyerReceptionEnterPositions = [];
        for (var i = 22; i <= 24; i++) {
            for (var j = 20; j <= 24; j++) {
                foyerReceptionEnterPositions.push(new Position(Settings.FOYER_ID, i, j));
            }
        }

        listOfDoors.push(doorService.createLectureDoor(new Position(Settings.FOYER_ID, 2, 1), lectureDoorEnterPositions), 
                         doorService.createFoodCourtDoor(new Position(Settings.FOYER_ID, 25, 4), foyerFoodCourtEnterPositions, new Position(Settings.FOODCOURT_ID, 2, 0), Direction.DOWNRIGHT), 
                         doorService.createReceptionDoor(new Position(Settings.FOYER_ID, 25, 24), foyerReceptionEnterPositions, new Position(Settings.RECEPTION_ID, 2, 0), Direction.DOWNRIGHT));


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