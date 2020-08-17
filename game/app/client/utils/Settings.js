const Settings = Object.freeze({

    /* Movement-Speed Constants */
    MOVEMENTSPEED_X: 1,
    MOVEMENTSPEED_Y: 1,

    /* StatusBar Constants */
    TIME_UNTIL_LEAVE: 60,

    /* Map constants */
    MAP_BLANK_TILES_WIDTH: 3,
    MAP_BLANK_TILES_LENGTH: 3,
    WALL_OFFSET: 1,

    SHOWLECTURE: 10 * 60 * 1000

});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Settings;
}