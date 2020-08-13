if (typeof module === 'object' && typeof exports === 'object') {
    Direction = require('./Direction');
}

const Settings = Object.freeze({

    /* Movement-Speed Constants */
    MOVEMENTSPEED_X: 1,
    MOVEMENTSPEED_Y: 1,

    /* Start-Position Constants */
    FOYER_ID: 1,
    FOODCOURT_ID: 2,
    RECEPTION_ID: 3,
    STARTROOM_ID: 3,
    STARTPOSITION_X: 3,
    STARTPOSITION_Y: 12,
    STARTDIRECTION: Direction.UPLEFT,
    TYPE_OF_STARTROOM: 'RECEPTION',

    /* Chat Constants */
    MAXNUMMESSAGES_LECTURECHAT: 100,
    MAXNUMMESSAGES_ALLCHAT: 100,
    MAXNUMMESSAGES_GROUPCHAT: 100,
    MAXNUMMESSAGES_ONETOONECHAT: 100,
    MAXGROUPPARTICIPANTS: 255,


    CONFERENCE_ID: '1',

    /* Lecture Constants */
    SHOWLECTURE: 10 * 60 * 1000, //lecture is shown 10 minutes before lecture start 
    TOKENCOUNTERSTART: 5 * 60 * 1000,

    /* StatusBar Constants */
    TIME_UNTIL_LEAVE: 60,

    /* Moderator-Settings */
    CMDSTARTCHAR: "\\", // moved the actual commands into a seperate file for easier handling

    /* Map constants */
    MAP_BLANK_TILES_WIDTH: 3,
    MAP_BLANK_TILES_LENGTH: 3,
    WALL_OFFSET: 1,

});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Settings;
}