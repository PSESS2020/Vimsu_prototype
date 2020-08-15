class TableView extends GameObjectView {
    #tableImage;

    constructor(tableImage, position) {
        super(tableImage, position);
        this.#tableImage = tableImage;
    }

    draw() {
        ctx_map.drawImage(this.#tableImage, super.getPosition().getCordX(), super.getPosition().getCordY());
    }

    onclick() {
        //TODO
    }
}