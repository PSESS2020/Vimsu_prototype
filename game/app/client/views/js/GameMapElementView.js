if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView');
    EventManager = require('../../utils/EventManager')
}

class GameMapElementView extends GameObjectView {

    constructor(mapElementImage, position, name) {
        super(mapElementImage, position, name);
    }

    draw() {
        ctx_map.drawImage(super.getObjectImage(), super.getPosition().getCordX(), super.getPosition().getCordY());
    }

    onclick() {
       
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameMapElementView;
}