var Views = require('./Views.js')

module.exports = class MapView extends Views {
    constructor() {
        super();
    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }

    #drawGameObjects(objectType) {
        throw new Error('drawGameObjects() has to be implemented!');
    }


}
