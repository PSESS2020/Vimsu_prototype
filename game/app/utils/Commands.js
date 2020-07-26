// This class might later be massively restructured to
// also include command-handling (compare ServerController.js)

module.exports = Object.freeze({
    GLOBAL: "global",
    LOGMESSAGES: "log",
    REMOVEPLAYER: "rmuser",
    REMOVEMESSAGE: "rmmsg",
    REMOVEMESSAGESBYPLAYER: "rmallby",
    REVOKETOKEN: "revoke",
    GRANTTOKEN: "grant",
    UNBANPLAYER: "unban",
    HELP: "help"
});
