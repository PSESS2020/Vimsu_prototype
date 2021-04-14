const Direction = require('../../client/shared/Direction');
const GameObjectType = require('../../client/shared/GameObjectType');
const GlobalStrings = require('../../client/shared/GlobalStrings');
const TypeOfRoom = require('../../client/shared/TypeOfRoom');
const NPCDialog = require('./NPCDialog');
const Settings = require('./Settings');

/**
 * How to use this file:
 * yadada
 * @module Floorplan
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const FloorplanConstants = Object.freeze({
    NPCNAMES: {
        tutorial: "Basic Tutorial",
        foyer: "Foyer Helper",
        food: "Chef"
    }
})

const Floorplan = Object.freeze({

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

    // Giving any of the "standard" roomIds, the roomFactory will use
    // legacy code to build them according to the standard conference.
    // note that using these requires that the rest of the conference
    // contains fitting rooms for the doors to exit into

    /*
    ROOM1: {
        TYPE: TypeOfRoom.RECEPTION,
        ID: Settings.RECEPTION_ID      
    },

    ROOM2: {
        TYPE: TypeOfRoom.FOYER,
        ID: Settings.FOYER_ID
    },

    ROOM3: {
        TYPE: TypeOfRoom.FOODCOURT,
        ID: Settings.FOODCOURT_ID
    },

    ROOM4: {
        TYPE: TypeOfRoom.ESCAPEROOM,
        ID: Settings.ESCAPEROOM_ID
    }
    */

    // TODO:
    // - possibility to generate ID during runtime?
    // - support choice of styles for walls and floor
    // - add shape supports
    // - add possibility to easily resize room without fucking
    //   up layout
    // - I probably need to write some hack to make sure door-unlock
    //   will still work
    // - This will most likely break a non-neglible amount of
    //   achievements
    RECEPTION: {
        ID: Settings.RECEPTION_ID, // needs to be integer
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 13, // y dimension - along right wall
        LENGTH: 13, // x dimension - along left wall
        MAPELEMENTS: [
            {type: GameObjectType.RIGHTWINDOW, position: [[13, 5], [13, 6], [13, 7]]},
            {type: GameObjectType.CONFERENCELOGO, position: [5, 5]}
        ],
        OBJECTS: [
            {type: GameObjectType.RECEPTIONCOUNTER, position: [10, 3]},
            {type: GameObjectType.PLANT, position: [[12, 0], [12, 12]]}
        ],
        // doorData = {wallSide, logo, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen}
        DOORS: [ 
            {wallSide: GlobalStrings.LEFT, logo: GlobalStrings.FOYER,  positionOfDoor: [2, -1], positionOnExit: [Settings.FOYER_ID, 24, 21], directionOnExit: Direction.DOWNLEFT, isOpen: true}
        ],
        NPCS: [
            {name: FloorplanConstants.NPCNAMES.tutorial, position: [11, 6], direction: Direction.DOWNLEFT, dialog: NPCDialog.basicTutorialDialog}
        ]
    },

    FOYER: {
        ID: Settings.FOYER_ID,
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 25,
        LENGTH: 25,
        MAPELEMENTS: [
            {type: GameObjectType.LEFTSCHEDULE, position: [5, -1], isClickable: Settings.VIDEOSTORAGE_ACTIVATED},
            {type: GameObjectType.LEFTWINDOW, position: [[22, -1], [23, -1], [24, -1]]},
            {type: GameObjectType.RIGHTWINDOW, position: [[25, 0], [25, 1], [25, 2], [25, 3], [25, 4], [25, 5], [25, 23]]},
            {type: GameObjectType.CONFERENCELOGO, position: [13, -1]},
            {type: GameObjectType.PICTUREFRAME, position: [25, 14]}
        ],
        OBJECTS: [
            {type: GameObjectType.PLANT, position: [24, 0], isClickable: true},
            {type: GameObjectType.SOFA, position: [[22, 0], [23, 0]], variation: 0},
            {type: GameObjectType.SOFA, position: [[25, 1], [25, 2], [25, 3], [25, 4], [25, 5]], variation: 1}
        ],
        DOORS: [
            {wallSide: GlobalStrings.RIGHT, logo: GlobalStrings.FOODCOURT,  positionOfDoor: [25, 9], positionOnExit: [Settings.FOODCOURT_ID, 2, 0], directionOnExit: Direction.DOWNRIGHT, isOpen: true},
            {wallSide: GlobalStrings.RIGHT, logo: GlobalStrings.RECEPTION,  positionOfDoor: [25, 21], positionOnExit: [Settings.RECEPTION_ID, 2, 0], directionOnExit: Direction.DOWNRIGHT, isOpen: true}
        ],
        NPCS: [
            {name: FloorplanConstants.NPCNAMES.foyer, position: [0, 0], direction: Direction.DOWNRIGHT, dialog: NPCDialog.foyerHelperDialog}
        ]
    },

    FOODCOURT: {
        ID: Settings.FOODCOURT_ID,
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 19,
        LENGTH: 19,
        MAPELEMENTS: [],
        OBJECTS: [],
        DOORS: [],
        NPCS: []
    },

    ESCAPEROOM: {
        ID: Settings.ESCAPEROOM_ID,
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 20,
        LENGTH: 15,
        MAPELEMENTS: [],
        OBJECTS: [],
        DOORS: [],
        NPCS: []
    }
    
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Floorplan;
}