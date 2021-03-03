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
    },
    LOGDOORS: {
        string: "logdoors",
        method: "logAllDoors"
    },
    CLOSEDOOR: {
        string: "closedoor",
        method: "closeDoor"
    }, 
    OPENDOOR: {
        string: "opendoor",
        method: "openDoor"
    },
    CLOSEDOORFOR: {
        string: "closedoorfor",
        method: "closeDoorFor",
    },
    OPENDOORFOR: {
        string: "opendoorfor",
        method: "openDoorFor"
    },
    CLOSEALLDOORSFOR: {
        string: "closealldoorsfor",
        method: "closeAllDoorsFor"
    },
    OPENALLDOORSFOR: {
        string: "openalldoorsfor",
        method: "openAllDoorsFor"
    },
    SETDOORCODE: {
        string: "setdoorcode",
        method: "setDoorCode"
    },
    PORTTO: {
        string: "portto",
        method: "portTo"
    },
    PORTTOUSER: {
        string: "porttouser",
        method: "portToUser"
    },
    MODUSER: {
        string: "mod",
        method: "modUser"
    },
    UNMODUSER: {
        string: "unmod",
        method: "unmodUser"
    },
    CREATEGROUP: {
        string: "creategroup",
        method: "createGroup"
    },
    DELETEGROUP: {
        string: "deletegroup",
        method: "deleteGroup"
    },
    ADDGROUPMEMBER: {
        string: "addtogroup",
        method: "addGroupMember"
    },
    REMOVEGROUPMEMBER: {
        string: "rmfromgroup",
        method: "removeGroupMember"
    }
});