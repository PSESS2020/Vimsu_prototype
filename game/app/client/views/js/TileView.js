class TileView extends GameObjectView {
    #tileImage;
    #position;

    constructor(tileImage, position) {
        super(tileImage, position);
        this.#tileImage = tileImage;
        this.#position = position;
    }
    getPosition() {
        return this.#position;
    }

    draw() {
        ctx_map.drawImage(this.#tileImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        //TODO
    }
}