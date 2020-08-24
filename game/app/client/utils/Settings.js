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

    SHOWLECTURE: 10 * 60 * 1000,

    /* Avatar constants */
    AVATAR_WIDTH: 64,
    AVATAR_HEIGHT: 128,

    //Needed for calculating because avatar asset gets shrinked when drawn. 
    AVATAR_SCALE_WIDTH: 1.5,
    AVATAR_SCALE_HEIGHT: 0.3125,

    PARTICIPANT_COLOR: 'antiquewhite',
    MODERATOR_COLOR: 'gold',

    //constants for arrow drawn above own Avatar
    ARROW_LENGTH: 20,
    ARROW_WIDTH: 7,

});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Settings;
}