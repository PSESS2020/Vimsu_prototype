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
 * 
 * Since these do not get exported, they are not visible throughout
 * the program during runtime.
 */
const FloorplanConstants = Object.freeze({
    NPCNAMES: {
        tutorial: "Basic Tutorial",
        foyer: "Foyer Helper",
        food: "Chef"
    }
})

const Floorplan = Object.freeze({

    /**************************************************************************/
    /**************** READ BEFORE YOU START PERUSING THE GUIDE ****************/
    /**************************************************************************/
    /**                                                                      **/
    /**   After finishing the floorplan but before starting the conference,  **/
    /**   make sure that the start position defined in the Settings.js file  **/
    /**   (server-side version) is a legal position for the  conference you  **/
    /**   just specified, that is to say make sure it exists.                **/
    /**                                                                      **/
    /**************************************************************************/
    

    /**************************************************************************/
    /************************** HOW TO USE THIS FILE **************************/
    /**************************************************************************/
    /**                                                                      **/
    /**  You can add an additional room to the conference by adding an       **/
    /**  entry adhering to the following scheme to this file:                **/
    /**                                                                      **/
    /**  <key>: {                                                            **/
    /**    ID: <Integer>,    # Needs to be an unique integer, as it is used  **/
    /**                      # by the software to identify the room. In the  **/
    /**                      # next update, will be changed to string.       **/
    /**    NAME: <String>,   # Can be anything you want. Will be displayed   **/
    /**                      # in the client though.                         **/
    /**    TYPE: TypeOfRoom.CUSTOM,   # Must be TypeOfRoom.CUSTOM, as it     **/
    /**                               # only exists for legacy reasons.      **/
    /**    LENGTH: <Integer>,   # The x-axis, goes along the left wall       **/
    /**    WIDTH: <Integer>,    # The y-axis, goes along the right wall      **/
    /**    MAPELEMENTS: [],   # Array of objects adhering to proper scheme,  **/
    /**                       # for more detail see below.                   **/
    /**    OBJECTS: [],       # Array of objects adhering to proper scheme,  **/
    /**                       # for more detail see below.                   **/
    /**    DOORS: [],         # Array of objects adhering to proper scheme,  **/
    /**                       # for more detail see below.                   **/
    /**    NPCS: [],          # Array of objects adhering to proper scheme,  **/
    /**                       # for more detail see below.                   **/
    /**  }                                                                   **/
    /**                                                                      **/
    /**  NOTE The key can be whatever you like. It is not used anywhere for  **/
    /**       anything except help you remember what room you're currently   **/
    /**       creating.                                                      **/
    /**                                                                      **/
    /**  NOTE A room does not need to contain any map elements, objects,     **/
    /**       doors or npcs. But why wouldn't it?                            **/
    /**                                                                      **/
    /**************************************************************************/

    /**************************************************************************/
    /************************ HOW TO ADD A MAPELEMENT *************************/
    /**************************************************************************/
    /**                                                                      **/
    /**  Map elements are anything that functions like a wall or tile, such  **/
    /**  as windows, the schedule, the kit logo etc., but not doors.         **/
    /**  While any type of map element can be a type of game object and vice **/
    /**  versa, map elements can not be made clickable.                      **/
    /**                                                                      **/
    /**  Options:                                                            **/
    /**    type: GameObjectType.<type>,   # Any legal type of GameObject.    **/
    /**    position: <Integer[2]>         # [x coordinate, y coordinate]     **/
    /**           OR <[Integer, Integer[n]]>  # [x coord, list of y coords]  **/
    /**                                       # will draw object copy in any **/
    /**                                       # position that can be written **/
    /**                                       # [x coord, entry of list]     **/
    /**           OR <[Integer[n], Integer]>  # Analogous to above           **/
    /**           OR Array containing any combination of the above           **/
    /**                  # Object copies will be drawn in any position       **/
    /**                  # given by some entry                               **/
    /**    variation: <Integer>    # Some types of map elements and objects  **/
    /**                            # exist in several variations, meaning    **/
    /**                            # several different assets can be drawn   **/
    /**                            # in their position. If there are no      **/
    /**                            # variations available, this option will  **/
    /**                            # be ignored                              **/
    /**                                                                      **/
    /**  NOTE See below for a complete list of all available types of map    **/
    /**       elements, their variations and possible configurations.        **/
    /**                                                                      **/
    /**************************************************************************/

    /**************************************************************************/
    /************************* HOW TO ADD AN OBJECT ***************************/
    /**************************************************************************/
    /**                                                                      **/
    /**  Since game objects can also be map elements, everything from the    **/
    /**  above section still holds true. However, since game objects can be  **/
    /**  made clickable, they offer additional options.                      **/
    /**  Objects can either display a text message (story) or an iFrame (an  **/
    /**  external website openend inside of the app) on click.               **/
    /**  If both are defined, the iFrame takes precedence.                   **/
    /**                                                                      **/
    /**  Options:                                                            **/
    /**    isClickable: <Boolean>,  # Self-explanatory.                      **/
    /**    iFrameData: <Object>,    # Must be an object containg             **/
    /**                             #   title: <String>,   (header)          **/
    /**                             #   url: <String>,                       **/
    /**                             #   width: <Integer>,  (in pixel)        **/
    /**                             #   height: <Integer>  (in pixel)        **/
    /**                             # Any additonal value is ignored.        **/
    /**    story: <String[]>        # Each array entry gets its own textbox. **/
    /**                                                                      **/
    /**************************************************************************/

    /**************************************************************************/
    /*************************** HOW TO ADD A DOOR ****************************/
    /**************************************************************************/
    /**                                                                      **/
    /** // doorData = {wallSide, logo, positionOfDoor,
        //            positionOnExit, directionOnExit, isOpen,
        //            closedMessage, codeToOpen}                                                          **/
    /**                                                                      **/
    /**************************************************************************/

    /**************************************************************************/
    /*************************** HOW TO ADD AN NPC ****************************/
    /**************************************************************************/
    /**                                                                      **/
    /**  Options:                                                            **/
    /**    name: <String>,    # Name of the NPC. Purely for display purpose. **/
    /**    position: <Integer[2]>,   # See above. One option only!           **/
    /**    direction: Direction.<key>,   # Which way the NPC is facing.      **/
    /**                                  # <key> may be DOWNRIGHT, DOWNLEFT, **/
    /**                                  # UPRIGHT or UPLEFT                 **/
    /**    dialog: <String>     # What the NPC says when spoken to. If this  **/
    /**         OR <String[]>   # is an array, the contents will be what the **/
    /**                         # NPC says. If it is just a string, it will  **/
    /**                         # be used as a key to load an appropriate    **/
    /**                         # entry from the NPCDialog.js file. If it    **/
    /**                         # not a legal key, the NPC will say that it  **/
    /**                         # wasn't assigned dialog.                    **/
    /**                                                                      **/
    /**************************************************************************/
    

    RECEPTION: {
        ID: Settings.RECEPTION_ID, 
        NAME: "Reception",
        TYPE: TypeOfRoom.CUSTOM,
        LENGTH: 13, 
        WIDTH: 13, 
        MAPELEMENTS: [
            {type: GameObjectType.RIGHTWINDOW, position: [[13, 5], [13, 6], [13, 7]]},
            {type: GameObjectType.CONFERENCELOGO, position: [5, -1]}
        ],
        OBJECTS: [
            {type: GameObjectType.RECEPTIONCOUNTER, position: [10, 3],  isClickable: true, iFrameData: {title: "KIT", url: "https://www.kit.edu/", width: 750, height: 500 }},
            {type: GameObjectType.PLANT, position: [[12, 0], [12, 12]]}
        ],
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

    /**************************************************************************/
    /***************** COMPLETE LIST OF AVAILABLE OBJECT TYPES ****************/
    /**************************************************************************/
    /**                                                                      **/
    /**  See the GameObjectInfo.js file for instructions on how to add your  **/
    /**  own types of objects.                                               **/
    /**                                                                      **/
    /**                                                                      **/
    /**************************************************************************/

    // FINAL NOTE:
    // Giving any of the "standard" RoomTypes, the RoomFactory will use
    // legacy code to build them according to the standard conference.
    // Using these requires that the rest of the conference contains the
    // proper rooms for the doors to exit into, so it's best to either
    // use all of them or none of them.
    //
    // !!! NO LONGER SUPPORTED - IF YOU USE IT AND IT BREAKS, WE CAN'T HELP !!!

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
    
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Floorplan;
}