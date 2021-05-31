/**
 * Room commands that a moderator can enter in allchat
 * @module RoomCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 module.exports = Object.freeze({
    LOG: {
        string: "log",
        method: "logAllRooms"
    },
    USERLOG: {
        string: "userlog",
        method: "logAllParticipantsByRoom"
    }
});