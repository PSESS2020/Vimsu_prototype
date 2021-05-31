/**
 * Port commands that a moderator can enter in allchat
 * @module PortCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    PORTTO: {
        string: "group",
        method: "portGroup"
    },
    PORTTOUSER: {
        string: "user",
        method: "portUser"
    }
});