// This class might later be massively restructured to
// also include command-handling (compare ServerController.js)

module.exports = Object.freeze({
    GLOBAL: "global",
    LOGMESSAGES: "log",
    REMOVEPLAYER: "rmuser",
    REMOVEMESSAGE: "rmmsg",
    REMOVEMESSAGESBYPLAYER: "rmallby",
    MUTE: "mute",
    UNMUTE: "unmute",
    REVOKETOKEN: "revoke",
    GRANTTOKEN: "grant",
    UNBANPLAYER: "unban",
    CLOSE: "close",
    HELP: "help"
});
