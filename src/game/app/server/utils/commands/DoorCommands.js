/**
 * Door commands that a moderator can enter in allchat
 * @module DoorCommands
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    LOGDOORS: {
        string: "log",
        method: "logAllDoors"
    },
    CLOSEDOOR: {
        string: "close",
        method: "closeDoor"
    }, 
    OPENDOOR: {
        string: "open",
        method: "openDoor"
    },
    CLOSEDOORFOR: {
        string: "closefor",
        method: "closeDoorFor",
    },
    OPENDOORFOR: {
        string: "openfor",
        method: "openDoorFor"
    },
    CLOSEALLDOORSFOR: {
        string: "closeallfor",
        method: "closeAllDoorsFor"
    },
    OPENALLDOORSFOR: {
        string: "openallfor",
        method: "openAllDoorsFor"
    },
    SETDOORCODE: {
        string: "setcode",
        method: "setDoorCode"
    }
});