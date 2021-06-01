const NPC = require('../mapobjects/NPC.js');
const Position = require('../Position.js');
const Direction = require('../../../client/shared/Direction.js');
const TypeChecker = require('../../../client/shared/TypeChecker.js');
const NPCDialog = require('../../utils/NPCDialog.js');

/**
 * The NPC Factory
 * @module NPCFactory
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCFactory {

    #npcIDs;

    /**
     * creates an NPCFactory instance
     * @constructor 
     */
    constructor() {
        if (!!NPCFactory.instance) {
            return NPCFactory.instance;
        }

        NPCFactory.instance = this;
        this.#npcIDs = [];
    }

    /**
     * @private generates a unique NPC ID
     * @method module:NPCFactory#generateNpcID
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
     * Creates a custom NPC with the passed attributes
     * 
     * @method module:NPCFactory#createNPC
     * 
     * @param { { name:      String,
     *            roomId:    Integer
     *            position:  int[2], 
     *            direction: Direction,
     *            dialog:    String[]  } }  
     * 
     * @returns {NPC} An NPC instance with the passed attributes
     */
    createNPC(creationData) {
        const { name, roomId, position: [xPos, yPos], direction, dialog } = creationData

        TypeChecker.isString(name);
        TypeChecker.isInt(roomId);
        TypeChecker.isIntAboveEqual(xPos, 0);
        TypeChecker.isIntAboveEqual(yPos, 0);
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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NPCFactory;
}