const Direction = require('../server/models/Direction')

module.exports = Object.freeze
({

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
    MAXNUMMESSAGES_LECTURECHAT: 100,
    MAXNUMMESSAGES_ALLCHAT: 100,
    MAXNUMMESSAGES_GROUPCHAT: 100,
    MAXNUMMESSAGES_ONETOONECHAT: 100,
    MAXGROUPPARTICIPANTS: 255,

    /* Moderator-Settings */
    CMDSTARTCHAR: "\\" // moved the actual commands into a seperate file for easier handling

});
