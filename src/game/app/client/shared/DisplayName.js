/**
 * @enum Name that is displayed above avatars and in meetings
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 const DisplayName = Object.freeze({
    USERNAME: "username",
    FORENAME: "forename",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DisplayName;
}