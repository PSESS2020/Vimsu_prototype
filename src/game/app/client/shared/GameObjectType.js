/**
 * @enum game object type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GameObjectType = Object.freeze({
    /* Comment on how to use this file */

    // It should be possible to overwrite name

    // ENVIRONMENT
    SELECTED_TILE: {
        TYPE: 'SELECTED_TILE',
        NAME: 1,
        ASSET_PATH: TODO,
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
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    LEFTTILE: {
        TYPE: 'LEFTTILE',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RIGHTTILE: {
        TYPE: 'RIGHTTILE',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    LEFTSCHEDULE: {
        TYPE: 'LEFTSCHEDULE',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    PLANT: {
        TYPE: 'PLANT',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    CONFERENCELOGO: {
        TYPE: 'CONFERENCELOGO',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SOFA: {
        TYPE: 'SOFA',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RIGHTTABLE: {
        TYPE: 'RIGHTTABLE',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    CHAIR: {
        TYPE: 'CHAIR',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SMALLDINNERTABLE: {
        TYPE: 'SMALLDINNERTABLE',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    SMALLDINNERTABLEFOOD: {
        TYPE: 'SMALLDINNERTABLEFOOD',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    DRINKS: {
        TYPE: 'DRINKS',
        NAME: 1,
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
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
    RECEPTIONCOUNTERSIDEPART: {
        TYPE: 'RECEPTIONCOUNTERSIDEPART',
        NAME: 1,
        ASSET_PATH: TODO,
        WIDTH: 1,
        LENGTH: 1
    },
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectType;
}