var RoomDecorator = require('../models/RoomDecorator.js');
var GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../utils/Direction.js');
const Settings = require('../../utils/Settings.js');


module.exports = class FoodcourtRoomDecorator extends RoomDecorator {
    #room;
    #listOfGameObjects;
    #listOfNPCs;

    constructor(room) {
        super();
        this.#room = room;
        this.#listOfGameObjects = [];
        this.#listOfNPCs = [];

        //Alle GameObjekte die in diesen Raum gehören von Service holen
        let objService = new GameObjectService();
        
            for (var i = 2; i <= 10; i++) {
                this.#listOfGameObjects.push(objService.createTable(Settings.FOODCOURT_ID, 1, 1, 10, i, true),
                                             objService.createTable(Settings.FOODCOURT_ID, 1, 1, 8, i, true),
                                             objService.createTable(Settings.FOODCOURT_ID, 1, 1, 6, i, true),
                                             objService.createTable(Settings.FOODCOURT_ID, 1, 1, 4, i, true),
                                             objService.createTable(Settings.FOODCOURT_ID, 1, 1, 2, i, true));
            }

        //Alle NPCs die in diesen Raum gehören vom Service holen
        let npcService = new NPCService();
        this.#listOfNPCs.push(npcService.createChefNPC(Settings.FOODCOURT_ID, 12, 6, Direction.DOWNLEFT));

        this.#room.setGameObjects(this.#listOfGameObjects);
        this.#room.setNPCs(this.#listOfNPCs);
        this.#room.buildOccMap();
    }

    getRoom() {
        return this.#room;
    }
}