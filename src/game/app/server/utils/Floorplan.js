const Direction = require('../../client/shared/Direction');
const Globals = require('./GlobalStrings.js');

/**
 * How to use this file:
 * yadada
 * @module Floorplan
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({

    /*
    EXAMPLE: {

    }
    */

    // ROOM0
    // This will be the starting room

    // Maybe offer "blueprints" for certain types
    // of rooms or even conferences?

    // There should be an external file where all
    // the necessary strings are saved...
    // (this can just be the globalStrings-file)
    // (also asset-paths file)

    // Required
    // - Objects
    // - Map Elements (Walls & Windows)
    // - NPCs
    // - Doors
    // Best way of doing doors is to force people to manually set ids of rooms and then give exit-room id when listing doors

    ROOM1: {
        TYPE: Globals.RECEPTION,
        ID: 1,
        WIDTH: 100,
        LENGTH: 100,

        //SHAPE: null, /* Here people give either holes or non-holes in the form of arrays? */

        // replace string by global
        WALLTYPE_LEFT: 'default',
        WALLTYPE_RIGHT: 'default',
        TILETYPE: 'default',
        MAPELEMENTS: [],

        // This does currently not offer support for lecture doors
        // objData = {style, direction, positionOfDoor (array),
        //            positionOnExit (array), directionOnExit, isOpen,
        //            closedMessage, codeToOpen}
        DOORS: [],
        OBJECTS: [],
        NPCS: []
    }



})