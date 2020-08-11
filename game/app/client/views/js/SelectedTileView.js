const GameObjectView = require("./GameObjectView");

if (typeof module === 'object' && typeof exports === 'object') {
    GameObjectView = require('./GameObjectView')
}

class SelectedTileView extends GameObjectView {
    #tileImage;
    #position;

    constructor(tileImage, position) {
        super(tileImage, position);
        this.#tileImage = tileImage;
        this.#position = position;
    }

    draw() {

        ctx_avatar.drawImage(this.#tileImage, this.#position.getCordX(), this.#position.getCordY());
    
    }

    updatePos(position) {

        this.#position = position;

    }

    getPosition()  {

        return this.#position;

    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = SelectedTileView;
}