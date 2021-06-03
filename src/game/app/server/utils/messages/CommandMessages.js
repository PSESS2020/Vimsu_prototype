/**
 * Messages that will be emitted from a command input by a moderator/orator
 * @module CommandMessages
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    /**************************************************************************/
    /************************* PORT ALLCHAT MESSAGES **************************/
    /**************************************************************************/

    UNKNOWNPORTCOMMAND: {
        header: "Unrecognized port command",
        body: "You entered an unrecognized command. Enter '\\port' to receive an overview of all port commands and how to use them."
    },
    TELEPORTSUCCESS: {
        header: "Teleport was successful",
        body: "Teleport was successful."
    },
    USERTELEPORTFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed parameters again. There could be a collision at your passed position.",
               "Enter '\\port' to receive an overview of all port commands and how to use them."]
    },
    GROUPTELEPORTFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed parameters again. There could be a collision at your passed position, " + 
                "the passed groupname could be wrong or no group members are currently online."  ,
               "Enter '\\port' to receive an overview of all port commands and how to use them."]
    },
    TELEPORTTOUSERFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed usernames again.",
               "Enter '\\port' to receive an overview of all port commands and how to use them."]       
    },
    INVALIDUSERPORT: {
        header: "Invalid user port command",
        body: [ "Invalid user port command. Valid commands:",
                "\\port user <username> topos <roomID> <cordX> <cordY>",
                "\\port user <username1> touser <username2>"]
    },
    INVALIDGROUPPORT: {
        header: "Invalid group port command",
        body: [ "Invalid group port command. Valid commands:",
                "\\port group <groupname> topos <roomID> <cordX> <cordY>",
                "\\port group <groupname> touser <username>",]
    }
});