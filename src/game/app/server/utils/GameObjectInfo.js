const GameObjectType = require('../../client/shared/GameObjectType.js');
const Settings = require('../utils/Settings.js');

/**
 * Indexed by the contents of the GameObjectType-file,
 * this file makes the information need to generate
 * an object from just its type easily accessible.
 * 
 * Uses the values of the GameObjectType-properties as keys.
 * This needed to be in a separate file, as changing the
 * GameObjectType-file to contain this surplus of information
 * would break several client-side classes, and I can't be bothered
 * to fix them all.
 * 
 * Done as a static class for reasons of privacy. It is just nicer to
 * call a function instead of nested calls of object properties.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectInfo { 
    /******************************************************************/
    /************* USER GUIDE -- READ BEFORE EDITING FILE *************/
    /******************************************************************/
    /** When adding the information for a new GameObjectType to      **/
    /** this file, please stick to the following instructions:       **/
    /**                                                              **/
    /**   (a) Make sure you have added an appropriate property       **/
    /**       to the /client/shared/GameObjectType.js file.          **/
    /**       While this is not strictly necessary, not doing        **/
    /**       so risks breaking the game engine, so consider         **/
    /**       yourself warned. This will serve as an identifier      **/
    /**       for the object you added and be used to add a copy     **/
    /**       of the object to a room in the Floorplan.              **/
    /**                                                              **/
    /**   (b) Make sure you have added an appropriate property       **/
    /**       to the /client/shared/AssetPaths.js file. This is      **/
    /**       strictly necessary, as the game engine needs it        **/
    /**       to draw the object in the client view.                 **/
    /**       ATTENTION: if the object isn't drawn in the proper     **/
    /**                  position, try adding an offset in the       **/
    /**                  /client/utils/GameObjectOffsets.js file     **/
    /**                                                              **/
    /**   (c) Add the information specifying your new object to      **/
    /**       the #INFORMATION-field as a new property.              **/
    /**         (i) For the key, chose the value of the property     **/
    /**             you added to the GameObjectType-file (if you     **/
    /**             did not add one, any string will suffice).       **/
    /**             So, if, for example, you added the property      **/
    /**             newObjectKey: "newObjectName",                   **/
    /**             to the GameObjectType-file, you should add       **/
    /**             [GameObjectType.newObjectKey]: {},               **/
    /**             to this one. You don't need to stick to the      **/
    /**             categories,  but it helps keeping the file       **/
    /**             more clearly structured.                         **/
    /**        (ii) Add any of the following attributes to your      **/
    /**             new object (attributes marked with a * are       **/
    /**             MANDATORY):                                      **/
    /**              - isSolid*: Boolean                             **/
    /**              - width*: integer                               **/
    /**              - length*: integer                              **/
    /**              - assetName*: String                            **/
    /**                         OR String[]                          **/
    /**                         OR String[][] (see below)            **/
    /**              - hasVariation: Boolean  (see below)            **/
    /**              - isMultiPart: Boolean   (see below)            **/
    /**              - hasAdditionalParts: Boolean (see below)       **/
    /**              - size: integer[2]            (see below)       **/
    /**              - parts: Object[]             (see below)       **/
    /**                                                              **/
    /**   (d) Some notes on the more advanced options:               **/
    /**       hasVariation: If this flag is set, the assetName must  **/
    /**                     be an array of strings. When adding an   **/
    /**                     in the floorplan, you can then specify   **/
    /**                     a variation by giving a valid index.     **/
    /**                     A different image will be drawn.         **/
    /**        isMultiPart: If this flag is set, the size-attribute  **/
    /**                     must be added to the object, and the     **/
    /**                     assetName must be of type String[i][j_i] **/
    /**                     with i = size[0], j_i <= size[1].        **/
    /**                     (so the length of the arrays need not be **/
    /**                     the same for all)                        **/
    /**                     This will cause an array Object[i][j_i]  **/
    /**                     to be drawn, each object with the same   **/
    /**                     type, width, length and solidity, but    **/
    /**                     the asset stored under the same indices  **/
    /** hasAdditionalParts: If this flag is set, the parts-attribute **/
    /**                     must be defined. It must be an array of  **/
    /**                     which each entry is an object following  **/
    /**                     the scheme:                              **/
    /**                     {                                        **/
    /**                       type*: String,     # GameObjectType    **/
    /**                       offset_x: integer, # relative position **/
    /**                                            x-axis            **/
    /**                       offset_y: integer, # relative position **/
    /**                                            y-axis            **/
    /**                       variation: inetger # if well-defined   **/
    /**                                            for this type     **/
    /**                     }                                        **/
    /**                    No other options are currently available  **/
    /**                    for the additional parts.                 **/
    /**         WARNING: AN OBJECT-TYPE MAY NEVER HAVE ITSELF AS AN  **/
    /**                  ADDITIONAL PART!!!                          **/
    /**                                                              **/
    /** NOTE: While it won't necessarily break the game, no two of   **/
    /**       the advanced options should be used in conjunction.    **/
    /**       (unless you know what you're doing)                    **/
    /**                                                              **/
    /** NOTE: The strings in the assetName must be property-keys     **/
    /**       from the /client/shared/AssetPaths-file.               **/
    /****__________________________________________________________****/

    // TODO
    // - add custom-type object
 
    // All the info for each GameObjectType
    static #INFORMATION = Object.freeze({
        // Blank
        [GameObjectType.BLANK]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "blank",
        },

        // Tiles
        [GameObjectType.TILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "tile_default",
        },
        [GameObjectType.SELECTED_TILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "tile_selected",
        },
        [GameObjectType.LEFTTILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "tile_default",
        },
        [GameObjectType.RIGHTTILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "tile_default",
        },

        // Walls
        [GameObjectType.LEFTWALL]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "leftwall_default",
        },
        [GameObjectType.RIGHTWALL]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "rightwall_default",
        },

        // Wall-like objects
        // Schedule, Windows, Logo, Picture Frames...
        [GameObjectType.LEFTSCHEDULE]: {
            // MULTIPART OBJECT
            isMultiPart: true,
            size: [3, 1],
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["leftschedule_default0", "leftschedule_default1", "leftschedule_default2"],
        },
        [GameObjectType.RIGHTWINDOW]: {
            hasVariation: true,
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["rightwindow_default0", "rightwindow_default1"]
        },
        [GameObjectType.LEFTWINDOW]: {
            hasVariation: true,
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["leftwindow_default0", "leftwindow_default1"]
        },
        [GameObjectType.PICTUREFRAME]: {
            isMultiPart: true,
            size: [1, 3],
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: [["rightwallframe_default0", "rightwallframe_default1", 
            "rightwallframe_default2"]],
        },
        [GameObjectType.CONFERENCELOGO]: {
            // MULTIPART OBJECT
            /* How does this work?
             *   (i) Set flag (isMultiPart = true) 
             *  (ii) Set size-field (this is the size
             *       of the completed object, whereas
             *       width and length give part-size)
             * (iii) assetName needs to be array of
             *       arrays, size[0] * size[1].    */
            isMultiPart: true,
            size: [5, 1],
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["leftconferencelogo_default0",
                "leftconferencelogo_default1", "leftconferencelogo_default2",
                "leftconferencelogo_default3",
                "leftconferencelogo_default4"],
        },
        
        // Plant 
        [GameObjectType.PLANT]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "plant_default",
        },    

        // Seating
        [GameObjectType.CHAIR]: {
            hasVariation: true,
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["leftchair_default", "leftchairback_default", "rightchair_default", "rightchairback_default",],
        },
        [GameObjectType.SOFA]: {
            hasVariation: true,
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["leftsofa_default", "rightsofa_default"],
        },

        // Tables
        [GameObjectType.TABLE]: {
            // NOT COHERENT WITH ART STYLE
            // DO NOT USE
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "table_default",
        },
        [GameObjectType.RIGHTTABLE]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: 3 * Settings.SMALL_OBJECT_LENGTH,
            assetName: "righttable_default",
        },
        [GameObjectType.SMALLDINNERTABLE]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "smalldinnertable_default",
        },

        // Counters
        [GameObjectType.CANTEENCOUNTER]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: 3 * Settings.SMALL_OBJECT_LENGTH,
            assetName: "canteencounter_default",
        },
        [GameObjectType.RECEPTIONCOUNTER]: {
            // OBJECT WITH ADDITIONAL PARTS
            hasAdditionalParts: true,
            parts: [
                // type, positional offsets, maybe variation
                {type: GameObjectType.RECEPTIONCOUNTERSIDEPART, offset_x: 1, offset_y: 0, variation: 0}, 
                {type: GameObjectType.RECEPTIONCOUNTERSIDEPART, offset_x: 1, offset_y: 6, variation: 1}
            ],
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: 7 * Settings.SMALL_OBJECT_LENGTH,
            assetName: "receptionCounterFrontPart_default",
        },
        [GameObjectType.RECEPTIONCOUNTERSIDEPART]: {
            // OBJECT WITH VARIATIONS
            hasVariation: true,
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["receptionCounterLeftPart_default","receptionCounterRightPart_default"],
        },

        // Food & Drinks
        [GameObjectType.DRINKS]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: 2 * Settings.SMALL_OBJECT_LENGTH,
            assetName: "drinks_default",
        },
        [GameObjectType.TEA]: {
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "tea_default",
        },
        [GameObjectType.SMALLDINNERTABLEFOOD]: {
            // OBJECT WITH VARIATIONS
            hasVariation: true,
            isSolid: true,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: ["koeriWurst_default", "koeriWurst_bothSides", "koeriWurst_upperSide", "koeriWurst_lowerSide"],
        },
    });

    /**
     * Takes a GameObjectType and a <key> as arguments and checks
     * if a property with the name <key> is stored for the passed
     * GameObjectType. If yes, it is returned. If no, throws error.
     * 
     * TypeChecking should be done by whoever calls this method!
     * 
     * @method module:GameObjectInfo#getInfo
     * 
     * @param {String} objectType 
     * @param {String} key 
     * @returns {*} The information saved for the passed GameObjectType
     *              under the passed key (if it exists).
     */
     static getInfo(objectType, key) {
        if (GameObjectInfo.#INFORMATION[objectType].hasOwnProperty(key)) {
            return GameObjectInfo.#INFORMATION[objectType][key];
        } else {
            throw new Error("The passed GameObjectType " + objectType + " does not have the property " + key);
        }
    } 
    
    /**
     * Takes a GameObjectType and a <key> as arguments and checks
     * if a property with the name <key> is stored for the passed
     * GameObjectType. If yes, returns true, if no, returns false.
     * 
     * @method module:GameObjectInfo#hasProperty
     * 
     * @param {String} objectType 
     * @param {String} key
     *  
     * @returns {Boolean} If the object specified by the passed type
     *                    has a property indexed by the passed key
     */
     static hasProperty(objectType, key) {
        return GameObjectInfo.#INFORMATION[objectType].hasOwnProperty(key)
     }
    
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectInfo;
}