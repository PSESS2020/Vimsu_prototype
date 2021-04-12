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
        string: "msglog",
        method: "logMessages"
    },
    LOGBYPLAYER: {
        string: "msgshowallby",
        method: "showAllBy"
    },
    REMOVEPLAYER: {
        string: "userrm",
        method: "removeUser"
    },
    REMOVEMESSAGE: {
        string: "msgrm",
        method: "removeMessage"
    },
    REMOVEMESSAGESBYPLAYER: {
        string: "msgrmallby",
        method: "removeAllBy"
    },
    MUTE: {
        string: "usermute",
        method: "muteUser"
    },
    UNMUTE: {
        string: "userunmute",
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
        string: "doorlog",
        method: "logAllDoors"
    },
    CLOSEDOOR: {
        string: "doorclose",
        method: "closeDoor"
    }, 
    OPENDOOR: {
        string: "dooropen",
        method: "openDoor"
    },
    CLOSEDOORFOR: {
        string: "doorclosefor",
        method: "closeDoorFor",
    },
    OPENDOORFOR: {
        string: "dooropenfor",
        method: "openDoorFor"
    },
    CLOSEALLDOORSFOR: {
        string: "doorcloseallfor",
        method: "closeAllDoorsFor"
    },
    OPENALLDOORSFOR: {
        string: "dooropenallfor",
        method: "openAllDoorsFor"
    },
    SETDOORCODE: {
        string: "doorsetcode",
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
        string: "usermod",
        method: "modUser"
    },
    UNMODUSER: {
        string: "userunmod",
        method: "unmodUser"
    },
    CREATEGROUP: {
        string: "groupcreate",
        method: "createGroup"
    },
    DELETEGROUP: {
        string: "groupdelete",
        method: "deleteGroup"
    },
    DELETEALLGROUPS: {
        string: "groupdeleteall",
        method: "deleteAllGroups"
    },
    ADDGROUPMEMBER: {
        string: "groupadd",
        method: "addGroupMember"
    },
    REMOVEGROUPMEMBER: {
        string: "grouprm",
        method: "removeGroupMember"
    }
});