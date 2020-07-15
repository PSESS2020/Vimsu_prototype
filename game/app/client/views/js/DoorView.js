class DoorView extends GameObjectView {
    #doorImage;
    #position;
    #DOORTYPE;

    constructor(doorImage, position, doorType) {
        super(doorImage, position);
        this.#doorImage = doorImage;
        this.#position = position;
        this.#DOORTYPE = doorType;
    }

    getDoorType() {
        return this.#DOORTYPE;
    }

    draw() {
        ctx_map.drawImage(this.#doorImage, this.#position.getCordX(), this.#position.getCordY());
    }

    onclick() {
        document.getElementById("currentLectures").style.display = "inline";
    }
}