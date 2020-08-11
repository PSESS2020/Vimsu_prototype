const GameObjectView = require("./GameObjectView");

if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView')
}

class TileView extends GameObjectView {
    #tileImage;
    #position;

    constructor(tileImage, position) {
        super(tileImage, position);
        this.#tileImage = tileImage;
        this.#position = position;
    }

    draw() {
        ctx_map.drawImage(this.#tileImage, this.#position.getCordX(), this.#position.getCordY());
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TileView;
}