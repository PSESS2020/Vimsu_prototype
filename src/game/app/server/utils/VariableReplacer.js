const Participant = require("../models/Participant")
const Room = require("../models/Room")

/**
 * A simple static class that can be used to replace the variables in an
 * iFrame-url with the intended data
 * 
 * @module VariableReplacer
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class VariableReplacer {
    /* In order to add a replacement method for a variable, simply
     * add a static method with the name of the variable.
     * It should take a Participant and a Room instance as arguments.
     * Additional variables that could be added:
     *   - Group name
     *   - conference name
     * 
     * Also, I'll move the .replaceAll() call from the ServerController
     * to here to allow for easier unit-testing. */

    /**
     * Replacement for $name variable
     * 
     * @param {Participant} ppant 
     * @param {Room} room 
     * @returns {String} The forename of the passed participant
     */
    static name = function(ppant, room) {
        return ppant.getBusinessCard().getForename();
    }

    /**
     * Replacement for $username variable
     * 
     * @param {Participant} ppant 
     * @param {Room} room 
     * @returns {String} The username of the passed participant
     */
    static username = function(ppant, room) {
        return ppant.getBusinessCard().getUsername();
    }

    /**
     * Replacement for $room variable
     * 
     * @param {Participant} ppant 
     * @param {Room} room 
     * @returns {String} The name of the passed room
     */
    static room = function(ppant, room) {
        return room.getRoomName();
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = VariableReplacer;
}