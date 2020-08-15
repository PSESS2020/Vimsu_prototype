class ScheduleView extends GameObjectView {
    #scheduleImage;

    constructor(scheduleImage, position) {
        super(scheduleImage, position);
        this.#scheduleImage = scheduleImage;
    }

    draw() {

        ctx_map.drawImage(this.#scheduleImage, super.getPosition().getCordX(), super.getPosition().getCordY());

    }

    onclick() {
        //TODO
    }
}