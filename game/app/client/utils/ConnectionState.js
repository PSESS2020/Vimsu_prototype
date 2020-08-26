/**
 * @enum Connection states of the game.
 */
const ConnectionState = Object.freeze({
    DISCONNECTED: 0,
    CONNECTED: 1,
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = ConnectionState;
}