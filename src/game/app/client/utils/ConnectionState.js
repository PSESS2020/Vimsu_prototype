/**
 * @enum Connection states of the game.
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const ConnectionState = Object.freeze({
    DISCONNECTED: 0,
    CONNECTED: 1,
    RECONNECTED: 2
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ConnectionState;
}