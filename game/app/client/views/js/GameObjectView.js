
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
        TypeChecker.isInstanceOf(gridPosition, PositionClient);
        TypeChecker.isInstanceOf(objectImage, Image);
        TypeChecker.isInstanceOf(screenPositionOffset, Object);
        TypeChecker.isString(name);


        this.#objectImage = objectImage;
        this.#gridPosition = gridPosition;
        this.#screenPositionOffset = screenPositionOffset;
        this.#name = name;

        /*if (new.target === GameObjectView) {
            throw new Error("Cannot construct abstract GameObjectView instances directly");
        }*/
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
        TypeChecker.isInstanceOf(gridPosition, PositionClient);

        this.#gridPosition = gridPosition;
    }

    updateScreenPos(screenPosition) {
        TypeChecker.isInstanceOf(screenPosition, PositionClient);

        this.#screenPosition = screenPosition;
    }

    draw() {
        //screen position is not set yet
        if (!this.#screenPosition) {
            return;
        }

        ctx_avatar.drawImage(this.#objectImage, this.#screenPosition.getCordX() + this.#screenPositionOffset.x, 
                                                this.#screenPosition.getCordY() + this.#screenPositionOffset.y);
    }

    onclick(){
        throw new Error('onclick() has to be implemented!');
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectView;
}