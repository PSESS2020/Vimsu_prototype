module.exports = class Conference {

    #schedule;

    constructor(schedule) {
        this.#schedule = schedule;
    }

    getSchedule() {
        return this.#schedule;
    }

}
