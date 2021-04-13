const Direction = require('../../client/shared/Direction');
const GameObjectType = require('../../client/shared/GameObjectType');
const TypeOfRoom = require('../../client/shared/TypeOfRoom');
const NPCDialog = require('./NPCDialog');
const Settings = require('./ServerSettings');

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
        ID: 0, // needs to be integer
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 13,
        LENGTH: 13,
        MAPELEMENTS: [
            {type: GameObjectType.WINDOW, position: [[13, 5], [13, 6], [13, 7]]},
            //{type: GameObjectType.CONFERENCELOGO, position: [5, 5]}
        ],
        OBJECTS: [
            {type: GameObjectType.RECEPTIONCOUNTER, position: [10, 3]},
            {type: GameObjectType.RECEPTIONCOUNTERSIDEPART, position: [11, 9]},
            {type: GameObjectType.RECEPTIONCOUNTERSIDEPART, position: [11, 3]},
            {type: GameObjectType.PLANT, position: [[12, 0],[12, 12]]}
        ],
        DOORS: [],
        NPCS: [
            {name: "Basic Tutorial", position: [11, 6], direction: Direction.DOWNLEFT, dialog: NPCDialog.basicTutorialDialog}
        ]
    },
    /*
    FOYER: {
        ID: "roomFoyer",
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 25,
        LENGTH: 25,
        MAPELEMENTS: [],
        OBJECTS: [],
        DOORS: [],
        NPCS: []
    },

    FOODCOURT: {
        ID: "roomFoodcourt",
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
        ID: "roomEscape",
        TYPE: TypeOfRoom.CUSTOM,
        //SHAPE: ,
        WIDTH: 20,
        LENGTH: 15,
        MAPELEMENTS: [],
        OBJECTS: [],
        DOORS: [],
        NPCS: []
    }
    */

})