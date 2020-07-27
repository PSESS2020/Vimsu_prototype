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
            let lectureStory = [    'Hey! Welcome to our Foyer!',
                                    'The door to my left leads to the lectures. Take a look and have fun! If you are on time and stay till the end, you can ask questions to the orator through the lecture chat.',
                                    'Enjoy your stay!'];

            this.#npcs.push(new NPC(2, 'FoyerHelper', new Position(roomId, 0, 0), Direction.DOWNRIGHT, lectureStory));

            
        }

        else if (typeOfRoom === 'RECEPTION') {
            let receptionStory = [  'Hello and welcome to this conference hosted by VIMSU!',
                                    'I would like to give you a short introduction with some basic tips.',
                                    'You can move around using WASD or arrow keys.',
                                    'You can enter a room by clicking the door tile. You need to be in range to enter a door.',
                                    'The door in this room leads you to the Foyer. From there, you can go anywhere and visit lectures!',
                                    'Keep in mind: you can interact with other participants by clicking the tile they are standing on.',
                                    'Earn points by visiting lectures, interacting with others or by reaching achievements!',
                                    'You can see the current points standings by clicking the Ranklist Button.',
                                    'There are other NPCs at this conference who would like to help you. You can recognize them by the red bar above them.', 
                                    "That's it for now! Have fun and enjoy your stay!"];

            this.#npcs.push(new NPC(1, 'BasicTutorial', new Position(roomId, 11, 6), Direction.DOWNLEFT, receptionStory));
        }

        else if (typeOfRoom === 'FOODCOURT') {

            let foodStory = ['Hello mate. Are you hungry?', 
                             'Come back later to eat some of my fresh food!'];
            
            this.#npcs.push(new NPC(3, 'Chef', new Position(roomId, 12, 6), Direction.DOWNLEFT, foodStory));
            
            
            
            
        }
    }
}