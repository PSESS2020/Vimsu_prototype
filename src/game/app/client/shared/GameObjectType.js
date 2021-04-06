const Settings = require("../../server/utils/Settings");

/**
 * @enum game object type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GameObjectType = Object.freeze({
    /* Comment on how to use this file */

    // Does this file break th way objects are done client side?
    // yes.
    // it's shit anyway, just re-do

    // How are we gonna do names...?
    // the name is actually used to find the correct asset-path
    // so it's probably best to keep the assetPath.js-file
    // and figure a way to smoothly implement this s.t. there
    // is no need to add several objects for one in-game object

    // change NAME to VARIANT or STYLE and have it parased as an argument
    // from the floorplan. This also makes for easier implementation of
    // the walls and tiles.

    // also how to handle objects that have multiple variants?

    // how to do objects with multiple parts?

    // ENVIRONMENT
        SELECTED_TILE: 'SELECTED_TILE',
        BLANK: 'BLANK',
        TILE: 'TILE',
        LEFTWALL: 'LEFTWALL',
        RIGHTWALL: 'RIGHTWALL',
        TABLE: 'TABLE',
        LEFTTILE: 'LEFTTILE',
        RIGHTTILE: 'RIGHTTILE',
        LEFTSCHEDULE: 'LEFTSCHEDULE',
        PLANT: 'PLANT',
        CONFERENCELOGO: 'CONFERENCELOGO',
        SOFA: 'SOFA',
        RIGHTTABLE: 'RIGHTTABLE',
        CHAIR: 'CHAIR',
        SMALLDINNERTABLE: 'SMALLDINNERTABLE',
        SMALLDINNERTABLEFOOD: 'SMALLDINNERTABLEFOOD',
        DRINKS: 'DRINKS',
        CANTEENCOUNTER: 'CANTEENCOUNTER',
        RECEPTIONCOUNTER: 'RECEPTIONCOUNTER',
        RECEPTIONCOUNTERSIDEPART: 'RECEPTIONCOUNTERSIDEPART',
    });
    
    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = GameObjectType;
    }