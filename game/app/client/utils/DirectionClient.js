if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

const DirectionClient = Object.freeze
({
    UPLEFT: "UPLEFT",
    DOWNLEFT: "DOWNLEFT",
    UPRIGHT: "UPRIGHT",
    DOWNRIGHT: "DOWNRIGHT"
});

define(function(require, exports, module) {
    module.exports = DirectionClient;
});