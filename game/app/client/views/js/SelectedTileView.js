class SelectedTileView extends GameObjectView {
    #tileImage;
    #position;

    constructor(tileImage, position) {
        super(tileImage, position);
        this.#tileImage = tileImage;
        this.#position = position;
    }

    draw() {

        ctx_avatar.drawImage(this.#tileImage, this.#position.getCordX(), this.#position.getCordY());
    
    }

    updatePos(position) {

        this.#position = position;

    }

    getPosition()  {

        return this.#position;

    }

    onclick() {
        //TODO
    }
}