class WallView extends GameObjectView {
    #wallImage;

    constructor(wallImage, position) {
        super(wallImage, position);
        this.#wallImage = wallImage;
    }

    draw() {
        ctx_map.drawImage(this.#wallImage, super.getPosition().getCordX(), super.getPosition().getCordY());
    }

    onclick() {
        //TODO
    }
}