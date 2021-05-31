/**
 * General commands that a moderator/orator can enter in lecture chat
 * @module LectureChatCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    MESSAGE: {
        string: "msg",
        method: "handleMsgCommand"
    },
    REMOVEPLAYER: {
        string: "ban",
        method: "removeUser"
    },
    REVOKETOKEN: {
        string: "revoke",
        method: "muteUser"
    },
    GRANTTOKEN: {
        string: "grant",
        method: "unmuteUser"
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