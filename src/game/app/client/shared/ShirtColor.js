/**
 * @enum Avatar shirt color
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const ShirtColor = Object.freeze({
    BLUE: "Blue",
    RED: "Red",
    GREEN: "Green",
    YELLOW: "Yellow",
    WHITE: "White",
    PURPLE: "Purple",
    ORANGE: "Orange",
    PINK: "Pink",
    TOSCA: "Tosca"
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ShirtColor;
}