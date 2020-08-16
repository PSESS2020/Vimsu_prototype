if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView');
    EventManager = require('../../utils/EventManager')
}

class GameMapElementView extends GameObjectView {

    constructor(mapElementImage, position, screenPositionOffset, name) {
        super(mapElementImage, position, screenPositionOffset, name);
    }

    draw() {
        ctx_map.drawImage(super.getObjectImage(), super.getScreenPosition().getCordX() + super.getScreenPositionOffset().x, 
                                                  super.getScreenPosition().getCordY() + super.getScreenPositionOffset().y);
    }

    onclick() {

    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameMapElementView;
}