const NPC = require('../models/NPC.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');

/**
 * The NPC Service
 * @module NPCService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class NPCService {

    #npcIDs;

    /**
     * creates an NPCService instance
     * @constructor 
     */
    constructor() {
        if (!!NPCService.instance) {
            return NPCService.instance;
        }

        NPCService.instance = this;
        this.#npcIDs = [];
    }

    #STORIES = {
        foyerHelperStory: ['Hey! Welcome to our Foyer!',
            'The door to my left leads to the lectures. Take a look and have fun! If you are on time and stay till the end, you can ask questions to the orator through the lecture chat.',
            'Enjoy your stay!'],
        basicTutorialStory: ['Hello and welcome to this conference hosted by VIMSU!',
            'I would like to give you a short introduction with some basic tips.',
            'You can move around using WASD or arrow keys.',
            'You can enter a room by clicking the door tile or running against the door. You need to be in range to enter a door.',
            'The door in this room leads you to the Foyer. From there, you can go anywhere and visit lectures!',
            'Keep in mind: you can interact with other participants by clicking the tile they are standing on.',
            'Earn points by visiting lectures, interacting with others or by reaching achievements!',
            'You can see the current points standings by clicking the Ranklist Button.',
            "Almost all buttons have a description. If you don't understand what a button does, just hover your mouse over the button and wait for the description to appear.",
            'There are other NPCs at this conference who would like to help you. You can recognize them by the red bar above them.',
            "That's it for now! Have fun and enjoy your stay!"],
        chefStory: ['Hello mate. Are you hungry?',
            'Come back later to eat some of my fresh food!'],
    }

    /**
     * @private generates a unique NPC ID
     * @method module:NPCService#generateNpcID
     * 
     * @return {number} NPC ID
     */
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

    /**
     * creates an instance of FoyerHelper NPC
     * @method module:NPCService#createFoyerHelperNPC
     * 
     * @param {String} roomId room ID of FoyerHelper NPC
     * @param {number} xPos x position of FoyerHelper NPC
     * @param {number} yPos y position of FoyerHelper NPC
     * @param {Direction} direction direction of FoyerHelper NPC
     * 
     * @return {NPC} FoyerHelper NPC instance
     */
    createFoyerHelperNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'FoyerHelper', new Position(roomId, xPos, yPos), direction, this.#STORIES.foyerHelperStory);
    }

    /**
     * creates an instance of BasicTutorial NPC
     * @method module:NPCService#createBasicTutorialNPC
     * 
     * @param {String} roomId room ID of BasicTutorial NPC
     * @param {number} xPos x position of BasicTutorial NPC
     * @param {number} yPos y position of BasicTutorial NPC
     * @param {Direction} direction direction of BasicTutorial NPC
     * 
     * @return {NPC} BasicTutorial NPC instance
     */
    createBasicTutorialNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'BasicTutorial', new Position(roomId, xPos, yPos), direction, this.#STORIES.basicTutorialStory)
    }

    /**
     * creates an instance of Chef NPC
     * @method module:NPCService#createChefNPC
     * 
     * @param {String} roomId room ID of Chef NPC
     * @param {number} xPos x position of Chef NPC
     * @param {number} yPos y position of Chef NPC
     * @param {Direction} direction direction of Chef NPC
     * 
     * @return {NPC} Chef NPC instance
     */
    createChefNPC(roomId, xPos, yPos, direction) {
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        return new NPC(this.#generateNpcID(), 'Chef', new Position(roomId, xPos, yPos), direction, this.#STORIES.chefStory);
    }
}