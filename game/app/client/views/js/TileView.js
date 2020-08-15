class TileView extends GameObjectView {
    #tileImage;

    constructor(tileImage, position) {
        super(tileImage, position);
        this.#tileImage = tileImage;
    }

    draw() {
        ctx_map.drawImage(this.#tileImage, super.getPosition().getCordX(), super.getPosition().getCordY());
    }

    onclick() {
        //TODO
    }
}