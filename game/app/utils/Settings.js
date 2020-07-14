const Direction = require("../server/models/Direction");

const Settings = Object.freeze
({

    /* Movement-Speed Constants */
    MOVEMENTSPEED_X: 1,
    MOVEMENTSPEED_Y: 1,

    /* Start-Position Constants */
    STARTROOM: 1,
    STARTPOSITION_X: 0,
    STARTPOSITION_Y: 0,
    STARTDIRECTION: Direction.DOWNRIGHT

});

module.exports = Settings
