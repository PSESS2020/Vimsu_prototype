/**
 * General commands that a moderator can enter in allchat
 * @module AllchatCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    GLOBAL: {
        string: "global",
        method: "globalMsg"
    },
    MESSAGE: {
        string: "msg",
        method: "handleMsgCommand"
    },
    REMOVEPLAYER: {
        string: "ban",
        method: "removeUser"
    },
    MUTE: {
        string: "mute",
        method: "muteUser"
    },
    UNMUTE: {
        string: "unmute",
        method: "unmuteUser"
    },
    HELP: {
        string: "help",
        method: "printHelp"
    },
    DOOR: {
        string: "door",
        method: "handleDoorCommand"
    },
    PORT: {
        string: "port",
        method: "handlePortCommand"
    },
    MODUSER: {
        string: "mod",
        method: "modUser"
    },
    UNMODUSER: {
        string: "unmod",
        method: "unmodUser"
    },
    GROUP: {
        string: "group",
        method: "handleGroupCommand"
    },
    ROOMS: {
        string: "rooms",
        method: "logAllRooms"
    }
});