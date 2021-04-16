const Direction = require('../../client/shared/Direction');
const GameObjectType = require('../../client/shared/GameObjectType');
const GlobalStrings = require('../../client/shared/GlobalStrings');
const TypeOfRoom = require('../../client/shared/TypeOfRoom');
const NPCDialog = require('./NPCDialog');
const Settings = require('./Settings');

/**
 * @module Floorplan
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */

/**
 * This field is not necessary for any functionality outside
 * of this module. It simply exists to offer an easy way to define
 * constant values that can be used throughout the entire floorplan,
 * e.g. when one wants to create a room layout where objects are
 * placed relative to the size of the entire room.
 */
const FloorplanConstants = Object.freeze({
    NPCNAMES: {
        tutorial: "Basic Tutorial",
        foyer: "Foyer Helper",
        food: "Chef"
    }
})

const Floorplan = Object.freeze({

    // Required
    // - Objects
    // - Map Elements (Walls & Windows)
    // - NPCs
    // - Doors
    // Best way of doing doors is to force people to manually set ids of rooms and then give exit-room id when listing doors

    // Giving any of the "standard" roomTypes, the roomFactory will use
    // legacy code to build them according to the standard conference.
    // note that using these requires that the rest of the conference
    // contains fitting rooms for the doors to exit into
    // this might also be broken by now

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
    //   up layout (can use Floorplan constants for that)
    // - I probably need to write some hack to make sure door-unlock
    //   will still work
    // - Achievements only broken by setting IDs to non setting-versions
    RECEPTION: {
        ID: Settings.RECEPTION_ID, // needs to be integer
        NAME: "Reception",
        TYPE: TypeOfRoom.CUSTOM,
        LENGTH: 13, // x dimension - along left wall
        WIDTH: 13, // y dimension - along right wall   
        MAPELEMENTS: [
            {type: GameObjectType.RIGHTWINDOW, position: [[13, 5], [13, 6], [13, 7]]},
            {type: GameObjectType.CONFERENCELOGO, position: [5, -1]}
        ],
        OBJECTS: [
            {type: GameObjectType.RECEPTIONCOUNTER, position: [10, 3],  isClickable: true, iFrameData: {title: "KIT", url: "https://www.kit.edu/", width: 750, height: 500 }},
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
        NAME: "Foyer",
        TYPE: TypeOfRoom.CUSTOM,
        LENGTH: 25,
        WIDTH: 25,
        MAPELEMENTS: [
            {type: GameObjectType.LEFTSCHEDULE, position: [5, -1], isClickable: Settings.VIDEOSTORAGE_ACTIVATED},
            {type: GameObjectType.LEFTWINDOW, position: [[22, -1], [23, -1], [24, -1]]},
            {type: GameObjectType.RIGHTWINDOW, position: [[25, 0], [25, 1], [25, 2], [25, 3], [25, 4], [25, 5], [25, 23]]},
            {type: GameObjectType.CONFERENCELOGO, position: [13, -1]},
            {type: GameObjectType.PICTUREFRAME, position: [25, 14]}
        ],
        OBJECTS: [
            {type: GameObjectType.PLANT, position: [24, 0], isClickable: true, story: ["I'm a plant.", "Please do not touch me.", "My precious leaves!"]},
            {type: GameObjectType.SOFA, position: [[22, 0], [23, 0]], variation: 0},
            {type: GameObjectType.SOFA, position: [24, [1, 2, 3, 4, 5]], variation: 1}
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
        NAME: "Food Court",
        TYPE: TypeOfRoom.CUSTOM,
        LENGTH: 19,
        WIDTH: 19,   
        MAPELEMENTS: [
            {type: GameObjectType.RIGHTWINDOW, position: [[19, 3], [19, 4], [19, 14], [19, 15]]},
            {type: GameObjectType.CONFERENCELOGO, position: [8, -1]},
        ],
        OBJECTS: [
            {type: GameObjectType.CANTEENCOUNTER, position: [17, 8]},
            {type: GameObjectType.CHAIR, variation: 0, position: [[2, 7, 12], 15]},
            {type: GameObjectType.CHAIR, variation: 1, position: [[2, 7, 12], 17]},
            {type: GameObjectType.CHAIR, variation: 2, position: [
                [3, [3, 4, 5, 9, 10, 11, 16]], 
                [8, [3, 4, 5, 9, 10, 11, 16]], 
                [13, [3, 4, 5, 9, 10, 11, 16]]
            ]},
            {type: GameObjectType.CHAIR, variation: 3, position: [
                [1, [3, 4, 5, 9, 10, 11, 16]], 
                [6, [3, 4, 5, 9, 10, 11, 16]], 
                [11, [3, 4, 5, 9, 10, 11, 16]]
            ]},
            {type: GameObjectType.RIGHTTABLE, position: [
                [2, [3, 9]], 
                [7, [3, 9]], 
                [12, [3, 9]]
            ]},
            {type: GameObjectType.SMALLDINNERTABLE, position: [[2, 16], [7, 16], [12, 16]]},
            {type: GameObjectType.SMALLDINNERTABLEFOOD, variation: 1, position: [[2, 10], [7, 9], [12, [4, 10]]]},
            {type: GameObjectType.SMALLDINNERTABLEFOOD, variation: 2, position: [[2, 5], [12, 3]]},
            {type: GameObjectType.SMALLDINNERTABLEFOOD, variation: 3, position: [[7, 4], [12, 9]]},
            {type: GameObjectType.DRINKS, position: [18, 0]},
            {type: GameObjectType.TEA, position: [[2, 11], [7, [3, 11, 16]], [12, 16]]}
        ],
        DOORS: [
            {wallSide: GlobalStrings.LEFT, logo: GlobalStrings.FOYER,  positionOfDoor: [2, -1], positionOnExit: [Settings.FOYER_ID, 24, 9], directionOnExit: Direction.DOWNLEFT},
            {wallSide: GlobalStrings.RIGHT,  positionOfDoor: [19, 17], positionOnExit: [Settings.ESCAPEROOM_ID, 14, 15], directionOnExit: Direction.DOWNLEFT, isOpen: false, codeToOpen: "42"}
        ],
        NPCS: [
            {name: FloorplanConstants.NPCNAMES.food, position: [18, 9], direction: Direction.DOWNLEFT, dialog: NPCDialog.chefDialog}
        ]
    },

    ESCAPEROOM: {
        ID: Settings.ESCAPEROOM_ID,
        NAME: "Escape Room",
        TYPE: TypeOfRoom.CUSTOM,
        LENGTH: 15,
        WIDTH: 20,
        MAPELEMENTS: [],
        OBJECTS: [
            {type: GameObjectType.PLANT, position: [[14, 0], [14, 19]]},
            {type: GameObjectType.PLANT, position: [0, 2], isClickable: true, iFrameData: {title: "KIT", url: "https://www.kit.edu/", width: 750, height: 500 }},
            {type: GameObjectType.SMALLDINNERTABLE, position: [0, 0], isClickable: true, iFrameData: {title: "Binary", url: "https://media.lehr-lern-labor.info/workshops/binary/", width: 600, height: 300 }},
            {type: GameObjectType.SMALLDINNERTABLE, position: [0, 1]},
            {type: GameObjectType.TEA, position: [0, [0, 1]], isClickable: true, iFrameData: {title: "KIT", url: "https://www.kit.edu/", width: 750, height: 500 }},
            {type: GameObjectType.SOFA, variation: 1, position: [0, 3], isClickable: true, iFrameData: {title: "KIT", url: "https://www.kit.edu/", width: 750, height: 500 }}
        ],
        DOORS: [
            {wallSide: GlobalStrings.RIGHT,  positionOfDoor: [15, 15], positionOnExit: [Settings.FOODCOURT_ID, 18, 17], directionOnExit: Direction.DOWNLEFT, isOpen: true}
        ],
        NPCS: []
    }
    
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Floorplan;
}