const NPC = require('../models/NPC.js');
const Position = require('../models/Position.js');
const Direction = require('../models/Direction.js');
const TypeChecker = require('../../utils/TypeChecker.js');
const TypeOfRoom = require('../models/TypeOfRoom.js');

module.exports = class NPCService {
    
    #npcs;

    constructor() {
        if(!!NPCService.instance){
            return NPCService.instance;
        }

        NPCService.instance = this;
        this.#npcs = [];
    }

    getNPCs(roomId, typeOfRoom)
    {
        TypeChecker.isInt(roomId);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        var roomNPCs = [], i;

        this.initAllNPCs(roomId, typeOfRoom);

        for(i = 0; i < this.#npcs.length; i++){
            if (this.#npcs[i].getPosition().getRoomId() === roomId) {
                roomNPCs.push(this.#npcs[i]);
            }
        }

        return roomNPCs;
    }

    getNPC(id)
    {
        TypeChecker.isInt(id);

        let index = this.#npcs.findIndex(npc => npc.getId() === id);

        if (index < 0) 
        {
            throw new Error(id + " is not in list of npcs")
        }

        return this.#npcs[index];
    }

    initAllNPCs(roomId, typeOfRoom)
    {    
        if (typeOfRoom === 'FOYER') {
            
            //There are currently no NPCs in Foyer
        }

        else if (typeOfRoom === 'RECEPTION') {
            let receptionStory = [  'Hello and welcome to this conference hosted by VIMSU!',
                                    'I would like to give you a short tutorial with some basic tips.',
                                    'You can enter another room by clicking the door tile in front of it.',
                                    'The door in this room leads you to the Foyer.',
                                    'You can interact with other participants by clicking the tile they are standing on.',
                                    'You can earn achievements and points. You get points for interacting with other or visiting lectures.',
                                    'Be the best participant and get the first place in the ranklist! Click on the Ranklist Button to see the current standings.',
                                    'Not forget, the most important thing of a conference are the lectures! You can see upcoming lecture by clicking the Schedule Button.',
                                    'Be in time at the lecture door in the Foyer to visit some of them!', 
                                    "That's it for now! Have fun and enjoy your stay!"];

            this.#npcs.push(new NPC(1, 'CLICK_ME', new Position(roomId, 9, 8), Direction.DOWNLEFT, receptionStory));
        }

        else if (typeOfRoom === 'FOODCOURT') {
            
            
            //There are currently no NPCs in FoodCourt
            
        }
    }
}