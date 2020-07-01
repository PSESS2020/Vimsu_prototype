var Views = require('./Views.js')

module.exports = class MapView extends Views {
    constructor() {
        super();

        if (new.target === MapView) {
            throw new Error("Cannot construct abstract MapView instances directly");
        }
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }

    #drawGameObjects = function(objectType) {
        throw new Error('drawGameObjects() has to be implemented!');
    }
}
