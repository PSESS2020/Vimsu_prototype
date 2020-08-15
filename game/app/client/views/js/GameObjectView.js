if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views');
}

class GameObjectView extends Views {

    #objectImage;
    #position;
    #name;

    constructor(objectImage, position, name) {
        super();
        this.#objectImage = objectImage;
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
        this.#name = name

        /*if (new.target === GameObjectView) {
            throw new Error("Cannot construct abstract GameObjectView instances directly");
        }*/
    }

    getObjectImage() {
        return this.#objectImage;
    }

    getPosition() {
        return this.#position;
    }

    getName() {
        return this.#name;
    }

    updatePos(position) {

        this.#position = position;

    }

    draw() {
        ctx_avatar.drawImage(this.#objectImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        throw new Error('onClick() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectView;
}