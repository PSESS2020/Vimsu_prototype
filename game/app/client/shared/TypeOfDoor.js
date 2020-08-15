const TypeOfDoor = Object.freeze({
    //FOYER_DOOR: "FOYER_DOOR",
    //FOODCOURT_DOOR: "FOODCOURT_DOOR",
    //RECEPTION_DOOR: "RECEPTION_DOOR",
    LECTURE_DOOR: "LECTURE_DOOR",
    LEFT_DOOR: "LEFT_DOOR",
    RIGHT_DOOR: "RIGHT_DOOR",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfDoor;
}