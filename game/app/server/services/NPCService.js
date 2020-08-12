const NPC = require('../models/NPC.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');

module.exports = class NPCService {

    #npcIDs;


    constructor() {
        if (!!NPCService.instance) {
            return NPCService.instance;
        }

        NPCService.instance = this;
        this.#npcIDs = [];
    }

    #STORYS = {
        foyerHelperStory: ['Hey! Welcome to our Foyer!',
            'The door to my left leads to the lectures. Take a look and have fun! If you are on time and stay till the end, you can ask questions to the orator through the lecture chat.',
            'Enjoy your stay!'],
        basicTutorialStory: ['Hello and welcome to this conference hosted by VIMSU!',
            'I would like to give you a short introduction with some basic tips.',
            'You can move around using WASD or arrow keys.',
            'You can enter a room by clicking the door tile. You need to be in range to enter a door.',
            'The door in this room leads you to the Foyer. From there, you can go anywhere and visit lectures!',
            'Keep in mind: you can interact with other participants by clicking the tile they are standing on.',
            'Earn points by visiting lectures, interacting with others or by reaching achievements!',
            'You can see the current points standings by clicking the Ranklist Button.',
            'There are other NPCs at this conference who would like to help you. You can recognize them by the red bar above them.',
            "That's it for now! Have fun and enjoy your stay!"],
        chefStory: ['Hello mate. Are you hungry?',
            'Come back later to eat some of my fresh food!'],
    }

    #generateNpcID = function () {
        let idIsGenerated = false;
        while (!idIsGenerated) {
            let id = Math.floor((Math.random() * 1000000) - 500000);
            if (!this.#npcIDs.includes(id)) {
                idIsGenerated = true;
                this.#npcIDs.push(id);
                return id;
            }
        }
    }

    createFoyerHelperNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'FoyerHelper', new Position(roomId, xPos, yPos), direction, this.#STORYS.foyerHelperStory);
    }

    createBasicTutorialNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'BasicTutorial', new Position(roomId, xPos, yPos), direction, this.#STORYS.basicTutorialStory)
    }

    createChefNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'Chef', new Position(roomId, xPos, yPos), direction, this.#STORYS.chefStory);
    }


}