const AssetPaths = require("../../client/shared/AssetPaths");
const GameObjectType = require("../../client/shared/GameObjectType");
const TypeChecker = require("../../client/shared/TypeChecker");
const Settings = require("./Settings");

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
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GameObjectInfo {
    /**********************************************************/
    /** When adding the information for a new GameObjectType **/
    /** file, please stick to the following instructions:    **/
    /**                                                      **/
    /**   (a) Add the  needed information as a  new entry to **/ 
    /**       #INFORMATION-field. You don't need to stick to **/
    /**       the categories,  but it helps keeping the file **/
    /**       more clearly structured.                       **/
    /**                                                      **/
    /**   (b) Add a new property  to the #INFORMATION-field. **/
    /**       It should be formatted like this:              **/
    /**       [GameObjectType.<property_key>]: {},           **/
    /**                  (key)               (value)         **/
    /**       The brackets [] around the key are mandatory!  **/
    /**       Replace  <property_key>  with the  KEY of the  **/
    /**       property you just added to the GameObjectType. **/
    /**                                                      **/
    /**   (c) For the value of the just added*/
    /**********************************************************/


    // Necessary information for each to add:
    // - isSolid
    // - size
    // - necessary assetPaths
    //   (these should not be the value, but the key)
    // - is there an easy way to group similar objects
    //   as variations of the same type?
 
    // All the info for each GameObjectType
    static #INFORMATION = Object.freeze({
        // Blank
        // what is this for?
        [GameObjectType.BLANK]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: '', 
        },
        // Tiles
        
        [GameObjectType.SELECTED_TILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: '', // Wait, how is this done client-side?
        },
        // the righttile and lefttile types seem to do nothing?
        // for the asset paths, we need to pass keys not values (ugh)
        [GameObjectType.TILE]: {
            isSolid: false,
            width: Settings.SMALL_OBJECT_WIDTH,
            length: Settings.SMALL_OBJECT_LENGTH,
            assetName: "",
        },
        // Walls
        [GameObjectType.LEFTWALL]: {},
        [GameObjectType.RIGHTWALL]: {},
        // Schedule
        [GameObjectType.LEFTSCHEDULE]: {},
        // Windows
        [GameObjectType.WINDOW]: {},
        // Plant
        [GameObjectType.PLANT]: {},
        // Logo
        [GameObjectType.CONFERENCELOGO]: {},
        // Seating
        [GameObjectType.CHAIR]: {},
        [GameObjectType.SOFA]: {},
        // Tables
        [GameObjectType.TABLE]: {},
        [GameObjectType.RIGHTTABLE]: {},
        [GameObjectType.SMALLDINNERTABLE]: {},
        // Counters
        [GameObjectType.CANTEENCOUNTER]: {},
        [GameObjectType.RECEPTIONCOUNTER]: {},
        [GameObjectType.RECEPTIONCOUNTERSIDEPART]: {},
        // Food & Drinks
        [GameObjectType.DRINKS]: {},
        [GameObjectType.SMALLDINNERTABLEFOOD]: {},
    });

    /**
     * Takes a GameObjectType and a <key> as arguments and checks
     * if a property with the name <key> is stored for the passed
     * GameObjectType. If yes, it is returned. If no, throws error.
     * 
     * TypeChecking should be done by whoever calls this method!
     * 
     * @method moduke:GameObjectInfo#getInfo
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
    
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectInfo;
}