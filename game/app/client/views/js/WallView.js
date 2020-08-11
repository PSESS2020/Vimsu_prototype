const GameObjectView = require("./GameObjectView");

if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView')
}

class WallView extends GameObjectView {
    #wallImage;
    #position;

    constructor(wallImage, position) {
        super(wallImage, position);
        this.#wallImage = wallImage;
        this.#position = position;
    }

    draw() {
        ctx_map.drawImage(this.#wallImage, this.#position.getCordX(), this.#position.getCordY());
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = WallView;
}