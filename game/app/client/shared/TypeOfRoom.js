/**
 * @enum type of room
 */
const TypeOfRoom = Object.freeze({
    FOYER: "Foyer",
    FOODCOURT: "Food Court",
    RECEPTION: "Reception"
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfRoom;
}