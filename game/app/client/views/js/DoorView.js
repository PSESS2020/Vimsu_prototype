class DoorView extends GameObjectView {
    #doorImage;
    #position;

    constructor(doorImage, position) {
        super(doorImage, position);
        this.#doorImage = doorImage;
        this.#position = position;
    }

    draw() {
        ctx.drawImage(this.#doorImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        //TODO
    }
}