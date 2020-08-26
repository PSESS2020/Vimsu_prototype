const TypeChecker = require("../../client/shared/TypeChecker");
const Schedule = require('./Schedule');

module.exports = class Conference {

    #schedule;

    /**
     * 
     * @param {Schedule} schedule 
     */
    constructor(schedule) {
        TypeChecker.isInstanceOf(schedule, Schedule);
        this.#schedule = schedule;
    }

    getSchedule() {
        return this.#schedule;
    }

}
