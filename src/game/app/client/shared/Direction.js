/**
 * @enum Avatar direction 
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const Direction = Object.freeze({
    UPLEFT: "UPLEFT",
    DOWNLEFT: "DOWNLEFT",
    UPRIGHT: "UPRIGHT",
    DOWNRIGHT: "DOWNRIGHT"
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Direction;
}