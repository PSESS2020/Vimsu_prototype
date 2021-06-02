/**
 * This file collects a bunch of strings that are used all throughout
 * the program. It is a bit redundant as of now and could probably be
 * merged into one of the other files fulfilling a similar purpose.
 * But I hope to use this to greater effect in the future.
 * 
 * @enum GlobalStrings
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GlobalStrings = Object.freeze({

    ISDECORATED: "isDecorated",

    RECEPTION: "reception",
    FOYER: "foyer",
    FOODCOURT: "foodcourt",
    ESCAPE: "escaperoom",
    LECTURE: "lecture",
    DEFAULT: "default",
    RIGHT: "RIGHT",
    LEFT: "LEFT"

})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GlobalStrings;
}
