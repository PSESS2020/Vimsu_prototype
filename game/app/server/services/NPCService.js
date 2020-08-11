const NPC = require('../models/NPC.js');
const Position = require('../models/Position.js');
const Direction = require('../../utils/Direction.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfRoom = require('../../utils/TypeOfRoom.js');
const Settings = require('../../utils/Settings.js');

module.exports = class NPCService {
    
    #npcs;

    constructor() {
        if(!!NPCService.instance){
            return NPCService.instance;
        }

        NPCService.instance = this;
        this.#npcs = [];
        this.initAllNPCs();
    }

    getNPCs(roomId)
    {
        TypeChecker.isInt(roomId);

        var roomNPCs = [], i;

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

    initAllNPCs()
    {    
        //FOYER NPCS
        let lectureStory = [    'Hey! Welcome to our Foyer!',
                                'The door to my left leads to the lectures. Take a look and have fun! If you are on time and stay till the end, you can ask questions to the orator through the lecture chat.',
                                'Enjoy your stay!'];

        this.#npcs.push(new NPC(2, 'FoyerHelper', new Position(Settings.FOYER_ID, 0, 0), Direction.DOWNRIGHT, lectureStory));

            
        
        //RECEPTION NPCS
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

        this.#npcs.push(new NPC(1, 'BasicTutorial', new Position(Settings.RECEPTION_ID, 11, 6), Direction.DOWNLEFT, receptionStory));
        

        //FOODCOURT NPCS
        let foodStory = ['Hello mate. Are you hungry?', 
                         'Come back later to eat some of my fresh food!'];
            
        this.#npcs.push(new NPC(3, 'Chef', new Position(Settings.FOODCOURT_ID, 12, 6), Direction.DOWNLEFT, foodStory));
            
        
    }
}