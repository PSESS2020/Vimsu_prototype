const Settings = require("../../server/utils/Settings");

/**
 * @enum game object type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GameObjectType = Object.freeze({
    /* Comment on how to use this file */

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
    SELECTED_TILE: {
        TYPE: 'SELECTED_TILE',
        ASSET_PATH: 'const',
        WIDTH: 1,
        LENGTH: 1
    },
    BLANK: 'BLANK',
    TILE: 'TILE',
    LEFTWALL: 'LEFTWALL',
    RIGHTWALL: 'RIGHTWALL',

    // OBJECTS
    TABLE: {
        TYPE: 'TABLE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    LEFTTILE: {
        TYPE: 'LEFTTILE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RIGHTTILE: {
        TYPE: 'RIGHTTILE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    LEFTSCHEDULE: {
        TYPE: 'LEFTSCHEDULE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    PLANT: {
        TYPE: 'PLANT',
        ASSET_PATH: "client/assets/plants/plant.png",
        WIDTH: Settings.SMALL_OBJECT_WIDTH,
        LENGTH: Settings.SMALL_OBJECT_WIDTH
    },
    CONFERENCELOGO: {
        TYPE: 'CONFERENCELOGO',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SOFA: {
        TYPE: 'SOFA',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RIGHTTABLE: {
        TYPE: 'RIGHTTABLE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    CHAIR: {
        TYPE: 'CHAIR',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SMALLDINNERTABLE: {
        TYPE: 'SMALLDINNERTABLE',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SMALLDINNERTABLEFOOD: {
        TYPE: 'SMALLDINNERTABLEFOOD',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    DRINKS: {
        TYPE: 'DRINKS',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    CANTEENCOUNTER: {
        TYPE: 'CANTEENCOUNTER',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RECEPTIONCOUNTER: {
        TYPE: 'RECEPTIONCOUNTER',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RECEPTIONCOUNTERSIDEPART: {
        TYPE: 'RECEPTIONCOUNTERSIDEPART',
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectType;
}