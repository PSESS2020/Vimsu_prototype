module.exports = class AvatarView {

    #position;
    #direction;
    #walking = false;
    #spriteSheet;

    constructor(position, direction) {
        this.#position = position;
        this.#direction = direction;
    }


    setPosition(position) {
        this.#position = position;
    }

    getPosition() {
        return this.#position;
    }

    setDirection(direction) {
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

    setWalking(walking) {
        this.walking;
    }

    draw() {

    }

    onClick() {
          
    }
}