/**
 * Group commands that a moderator can enter in allchat
 * @module GroupCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    CREATEGROUP: {
        string: "create",
        method: "createGroup"
    },
    DELETEGROUP: {
        string: "delete",
        method: "deleteGroup"
    },
    DELETEALLGROUPS: {
        string: "deleteall",
        method: "deleteAllGroups"
    },
    ADDGROUPMEMBER: {
        string: "add",
        method: "addGroupMember"
    },
    REMOVEGROUPMEMBER: {
        string: "rm",
        method: "removeGroupMember"
    },
    LOGGROUPS: {
        string: "log",
        method: "logAllGroups"
    }
});