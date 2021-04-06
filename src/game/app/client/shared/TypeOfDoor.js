/**
 * @enum type of door
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const TypeOfDoor = Object.freeze({
    LECTURE_DOOR: "LECTURE_DOOR",
    LEFT_DOOR: "LEFT_DOOR",
    RIGHT_DOOR: "RIGHT_DOOR",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfDoor;
}