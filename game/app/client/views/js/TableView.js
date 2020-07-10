class TableView extends GameObjectView {
    #tableImage;
    #position;

    constructor(tableImage, position) {
        super(tableImage, position);
        this.#tableImage = tableImage;
        this.#position = position;
    }

    draw() {
        ctx_map.drawImage(this.#tableImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        //TODO
    }
}