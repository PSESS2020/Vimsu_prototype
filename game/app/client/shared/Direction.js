/**
 * @enum Avatar direction 
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