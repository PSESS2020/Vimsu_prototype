const GameObjectType = require("../../client/shared/GameObjectType");

/**
 * @enum GameObjectInformation
 * 
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
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GameObjectInfo = Object.freeze({
    // Necessary information for each to add:
    // - isSolid
    // - size
    // - necessary assetPaths
    // - is there an easy way to group similar objects
    //   as variations of the same type?

    // Blank
    [GameObjectType.BLANK]: {},
    // Tiles
    [GameObjectType.SELECTED_TILE]: {},
    [GameObjectType.TILE]: {},
    [GameObjectType.LEFTTILE]: {},
    [GameObjectType.RIGHTTILE]: {},
    // Walls
    [GameObjectType.LEFTWALL]: {},
    [GameObjectType.RIGHTWALL]: {},
    // Schedule
    [GameObjectType.LEFTSCHEDULE]: {},
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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectInfo;
}