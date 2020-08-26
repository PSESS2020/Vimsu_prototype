/**
 * @enum type of door
 */
const TypeOfDoor = Object.freeze({
    LECTURE_DOOR: "LECTURE_DOOR",
    LEFT_DOOR: "LEFT_DOOR",
    RIGHT_DOOR: "RIGHT_DOOR",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfDoor;
}