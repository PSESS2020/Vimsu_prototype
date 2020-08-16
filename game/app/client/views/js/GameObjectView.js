if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views');
}

class GameObjectView extends Views {

    #objectImage;
    #gridPosition;
    #screenPositionOffset;
    #name;

    #screenPosition;

    constructor(objectImage, gridPosition, screenPositionOffset, name) {
        super();
        this.#objectImage = objectImage;
<<<<<<< HEAD
        TypeChecker.isInstanceOf(gridPosition, PositionClient);
        this.#gridPosition = gridPosition;
        this.#screenPositionOffset = screenPositionOffset;
        this.#name = name;

        /*if (new.target === GameObjectView) {
            throw new Error("Cannot construct abstract GameObjectView instances directly");
        }*/
=======
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
        this.#name = name
>>>>>>> d49a018231bb727c1c57ae120f5c9a657814ff5a
    }

    getObjectImage() {
        return this.#objectImage;
    }

    getGridPosition() {
        return this.#gridPosition;
    }

    getScreenPosition() {
        return this.#screenPosition;
    }

    getScreenPositionOffset() {
        return this.#screenPositionOffset;
    }

    getName() {
        return this.#name;
    }

    updateGridPos(gridPosition) {

        this.#gridPosition = gridPosition;

    }

    updateScreenPos(screenPosition) {
        this.#screenPosition = screenPosition;
    }

    draw() {
        ctx_avatar.drawImage(this.#objectImage, this.#screenPosition.getCordX() + this.#screenPositionOffset.x, 
                                                this.#screenPosition.getCordY() + this.#screenPositionOffset.y);
    }

    onclick() {
        throw new Error('onClick() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectView;
}