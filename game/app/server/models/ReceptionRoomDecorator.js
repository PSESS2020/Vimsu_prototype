
var RoomDecorator = require('../models/RoomDecorator.js');
var RoomDimensions = require('../../utils/RoomDimensions.js');
var GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../utils/Direction.js');
const Settings = require('../../utils/Settings.js');


module.exports = class ReceptionRoomDecorator extends RoomDecorator {
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
        for (var i = 3; i <= 9; i++) {
            this.#listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 1, 1, 10, i, true));
        }
        this.#listOfGameObjects.push(objService.createTable(Settings.RECEPTION_ID, 1, 1, 11, 9, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 12, 9, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 11, 3, true),
                                     objService.createTable(Settings.RECEPTION_ID, 1, 1, 12, 3, true),
                                     objService.createTable(Settings.FOYER_ID, 1, 1,  i, 0, true));

        //Alle NPCs die in diesen Raum gehören vom Service holen
        let npcService = new NPCService();
        this.#listOfNPCs.push(npcService.createBasicTutorialNPC(Settings.RECEPTION_ID, 11, 6, Direction.DOWNLEFT));

        this.#room.setGameObjects(this.#listOfGameObjects);
        this.#room.setNPCs(this.#listOfNPCs);
        this.#room.buildOccMap();

    }

    getRoom() {
        return this.#room;
    }
}