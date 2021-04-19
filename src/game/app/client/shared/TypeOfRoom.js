/**
 * @enum type of room
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const TypeOfRoom = Object.freeze({
    FOYER: "Foyer",
    FOODCOURT: "Food Court",
    RECEPTION: "Reception",
    ESCAPEROOM: "Escape Room",
    CUSTOM: "Custom Room"
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeOfRoom;
}