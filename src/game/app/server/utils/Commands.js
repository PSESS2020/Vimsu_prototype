/**
 * Commands that a moderator/orator can enter
 * @module Commands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    GLOBAL: {
        string: "global",
        method: "globalMsg"
    },
    GLOBALNOTE: {
        string: "testmsg",
        method: "globalNote"
    },
    LOGMESSAGES: {
        string: "log",
        method: "logMessages"
    },
    LOGBYPLAYER: {
        string: "showallby",
        method: "showAllBy"
    },
    REMOVEPLAYER: {
        string: "rmuser",
        method: "removeUser"
    },
    REMOVEMESSAGE: {
        string: "rmmsg",
        method: "removeMessage"
    },
    REMOVEMESSAGESBYPLAYER: {
        string: "rmallby",
        method: "removeAllBy"
    },
    MUTE: {
        string: "mute",
        method: "muteUser"
    },
    UNMUTE: {
        string: "unmute",
        method: "unmuteUser"
    },
    REVOKETOKEN: {
        string: "revoke",
        method: "muteUser"
    },
    GRANTTOKEN: {
        string: "grant",
        method: "unmuteUser"
    },
    UNBANPLAYER: {
        string: "unban",
        method: "unbanUser"
    },
    CLOSE: {
        string: "close",
        method: "close"
    },
    HELP: {
        string: "help",
        method: "printHelp"
    }
});
