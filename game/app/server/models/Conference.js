// Add required imports

const Schedule = require("./Schedule");

module.exports = class Conference {
     
    #schedule;
     
    constructor(lectureList) {
        this.#schedule = new Schedule(lectureList);
    }

    getSchedule() {
        return this.#schedule;
    }

}
