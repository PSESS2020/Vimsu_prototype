/**
 * @enum on click data type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const OnClickDataType = Object.freeze({
    IFRAME: "IFRAME",
    STORY: "STORY",
    MEETING: "MEETING"
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = OnClickDataType;
}