const Direction = require('../../client/shared/Direction');
const ShirtColor = require('../../client/shared/ShirtColor.js');
const DisplayName = require('../../client/shared/DisplayName.js');

/**
 * Settings for default conference
 * @module Settings_Default
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({

    /* Start-Position Constants */
    RECEPTION_ID: 0,
    FOYER_ID: 1,
    FOODCOURT_ID: 2, 
    ESCAPEROOM_ID:3,
    STARTROOM_ID: 0,
    STARTPOSITION_X: 3,
    STARTPOSITION_Y: 12,
    STARTDIRECTION: Direction.UPLEFT,
    TYPE_OF_STARTROOM: 'CUSTOM',

    /* Chat Constants */
    MAXNUMMESSAGES_LECTURECHAT: 100,
    MAXNUMMESSAGES_ALLCHAT: 100,
    MAXNUMMESSAGES_GROUPCHAT: 100,
    MAXNUMMESSAGES_ONETOONECHAT: 100,
    MAXGROUPPARTICIPANTS: 255,

    /* Ranklist Constants */
    MAXNUMRANKLIST: 21,

    /* Object Constants */
    SMALL_OBJECT_WIDTH: 1,
    SMALL_OBJECT_LENGTH: 1,

    /* Conference Constants */
    CONFERENCE_ID: '1',

    /* Meeting Constants */
    CONFERENCE_MEETINGNAME: 'Conference Meeting',
    DEFAULT_MEETINGDOMAIN: 'meet.jit.si/vimsu',

    /* Lecture Constants */
    SHOWLECTURE: 10 * 60 * 1000, //lecture is shown 10 minutes before lecture start 
    TOKENCOUNTERSTART: 5 * 60 * 1000,

    /* Moderator-Settings */
    CMDSTARTCHAR: "\\", // moved the actual commands into a separate file for easier handling,

    /* Movement-Speed Constants */
    MOVEMENTSPEED_X: 1,
    MOVEMENTSPEED_Y: 1,

    /* Shirt Color Default Settings */
    DEFAULT_SHIRTCOLOR_PPANT: ShirtColor.BLUE,
    DEFAULT_SHIRTCOLOR_NPC: ShirtColor.RED,

    /* Decides wheter video storage is needed or not */
    VIDEOSTORAGE_ACTIVATED: true,

    /* Decides wheter chat meeting is allowed or not */
    CHATMEETING_ACIVATED: true,

    /* Decides which registration system is used */
    /* Advanced registration system includes username, title, surname, forename, job, company, email */
    /* Non advanced registration system just includes username and forename (+ registration time) */
    ADVANCED_REGISTRATION_SYSTEM: true,

    /* Name that is displayed above avatar and in meetings */
    DISPLAY_NAME: DisplayName.USERNAME,

    /* Suffix of account collection in DB: account collection name = accountsACCOUNTDB_SUFFIX */
    ACCOUNTDB_SUFFIX: "",

    /* Decides which language is selected as default if clients preferred language is not available */
    DEFAULT_LANGUAGE: "en",

    /* Decides whether or not moderators have the power to see chats and meetings 
       from all exisiting groups, even if they are not part of them */
    MODS_SEE_EVERYTHING: false
});