/**
 * @enum type of door
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const TypeOfDoor = Object.freeze({
    LEFT_LECTUREDOOR: "LEFT_LECTUREDOOR",
    RIGHT_LECTUREDOOR: "RIGHT_LECTUREDOOR",
    LEFT_DOOR: "LEFT_DOOR",
    RIGHT_DOOR: "RIGHT_DOOR",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfDoor;
}