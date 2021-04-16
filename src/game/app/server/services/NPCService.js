const NPC = require('../models/NPC.js');
const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const NPCDialog = require('../utils/NPCDialog.js');

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

        return new NPC(this.#generateNpcID(), 'FoyerHelper', new Position(roomId, xPos, yPos), direction, NPCDialog.foyerHelperDialog);
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

        return new NPC(this.#generateNpcID(), 'BasicTutorial', new Position(roomId, xPos, yPos), direction, NPCDialog.basicTutorialDialog);
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

        return new NPC(this.#generateNpcID(), 'Chef', new Position(roomId, xPos, yPos), direction, NPCDialog.chefDialog);
    }

    /**
     * Creates a custom NPC with the passed attributes
     * 
     * @method module:NPCService#createCustomNPC
     * 
     * @param {String} name 
     * @param {String} roomId 
     * @param {Int} xPos 
     * @param {Int} yPos 
     * @param {Direction} direction 
     * @param {*} dialog 
     * 
     * @returns {NPC} An NPC instance with the passed attributes
     */
    createCustomNPC(name, roomId, xPos, yPos, direction, dialog) {
        TypeChecker.isString(name);
        TypeChecker.isInt(roomId);
        TypeChecker.isInt(xPos);
        TypeChecker.isInt(yPos);
        TypeChecker.isEnumOf(direction, Direction);

        // If an entire array gets passed, it's contents are
        // used as dialog
        if(Array.isArray(dialog)) {
            dialog.forEach(message => {
                TypeChecker.isString(message);
            })
            return new NPC(this.#generateNpcID(), name, new Position(roomId, xPos, yPos), direction, dialog);
        } else {
            // else it is assumed that the dialog parameter
            // is a string that can be used as a key in the
            // NPCDialog file
            TypeChecker.isString(dialog);
            let npcDialog = (NPCDialog[dialog] !== undefined) ? NPCDialog[dialog] : ["I wasn't given anyting to say."];
            return new NPC(this.#generateNpcID(), name, new Position(roomId, xPos, yPos), direction, npcDialog);
        }
    }
}