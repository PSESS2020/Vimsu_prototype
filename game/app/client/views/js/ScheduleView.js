class ScheduleView extends GameObjectView {
    #scheduleImage;
    #position;

    constructor(scheduleImage, position) {
        super(scheduleImage, position);
        this.#scheduleImage = scheduleImage;
        this.#position = position;
    }

    draw() {

        ctx_map.drawImage(this.#scheduleImage, this.#position.getCordX(), this.#position.getCordY());
    
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