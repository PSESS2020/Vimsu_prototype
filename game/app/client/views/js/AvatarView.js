/*var Views = require('./Views.js')
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports =*/ class AvatarView extends Views {

    #position;
    #direction;
    #walking = false;
    #spriteSheet;
    #isVisible;



    constructor(position, direction) {
        super();
        //TypeChecker.isInstanceOf(position, PositionClient);
        //TypeChecker.isEnumOf(direction, Direction);
        this.#position = position;
        this.#direction = direction;

        if (new.target === AvatarView) {
            throw new Error("Cannot construct abstract AvatarView instances directly");
        }    
    }


    setPosition(position) {
        TypeChecker.isInstanceOf(position, PositionClient);
        this.#position = position;
    }

    getPosition() {
        return this.#position;
    }

    setDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#direction = direction;
    }

    getDirection() {
        return this.#direction;
    }

    setSpriteSheet(spriteSheet) {
        this.#spriteSheet = spriteSheet
    }

    getSpriteSheet() {
        return this.#spriteSheet;
    }

    //returns true if the Avatar is currently walking
    isWalking() {
        return this.#walking;
    }

    getVisibility() {
        return this.#isVisible;
    }

    setVisibility(visible) {
        this.#isVisible = visible;
    }

    //setWalking(walking) {
        //TypeChecker.isBoolean(walking);
        //this.#walking = walking;
    //}

    draw() {
        throw new Error('draw() has to be implemented!');
    }

    onClick() {
        throw new Error('onClick() has to be implemented!');
    }

    update() {
        throw new Error('update() has to be implemented!' )
    }

    
}
