var RoomDecorator = require('../models/RoomDecorator.js');
var RoomDimensions = require('../../utils/RoomDimensions.js');
var GameObjectService = require('../services/GameObjectService.js');
const NPCService = require('../services/NPCService.js');
const Direction = require('../../utils/Direction.js');
const Settings = require('../../utils/Settings.js');


module.exports = class FoyerRoomDecorator extends RoomDecorator {
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
        for (var i = 4; i < 9; i++)
            this.#listOfGameObjects.push(objService.createTable( Settings.FOYER_ID, 1, 1,  i, 0, true));

        //Alle NPCs die in diesen Raum gehören vom Service holen
        let npcService = new NPCService();
        this.#listOfNPCs.push(npcService.createFoyerHelperNPC(Settings.FOYER_ID, 0, 0, Direction.DOWNRIGHT))

        this.#room.setGameObjects(this.#listOfGameObjects);
        this.#room.setNPCs(this.#listOfNPCs);
        this.#room.buildOccMap();
    }

    getRoom() {
        return this.#room;
    }
}