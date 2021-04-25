/**
 * Message commands that a moderator can enter in allchat and a moderator/orator can enter in lecture chat
 * @module MessageCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    LOGMESSAGES: {
        string: "log",
        method: "logMessages"
    },
    LOGBYPLAYER: {
        string: "showallby",
        method: "showAllBy"
    },
    REMOVEMESSAGE: {
        string: "rm",
        method: "removeMessage"
    },
    REMOVEMESSAGESBYPLAYER: {
        string: "rmallby",
        method: "removeAllBy"
    }
});