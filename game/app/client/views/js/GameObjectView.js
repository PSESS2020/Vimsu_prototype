if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views');
}

class GameObjectView extends Views {

    #tileImage;
    #position;
    #name;

    constructor(tileImage, position) {
        super();
        this.#tileImage = tileImage;
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
        //this.#name = name

        if (new.target === GameObjectView) {
            throw new Error("Cannot construct abstract GameObjectView instances directly");
        }
    }

    getPosition() {
        return this.#position;
    }

    updatePos(position) {

        this.#position = position;

    }

    draw() {
        throw new Error('draw() has to be implemented!');
    }

    onclick() {
        throw new Error('onClick() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectView;
}