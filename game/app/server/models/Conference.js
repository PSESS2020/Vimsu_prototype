const TypeChecker = require("../../client/shared/TypeChecker");
const Schedule = require('./Schedule');

module.exports = class Conference {

    #schedule;

    /**
     * @constructor Creates a conference instance
     * 
     * @param {Schedule} schedule lecture schedule
     */
    constructor(schedule) {
        TypeChecker.isInstanceOf(schedule, Schedule);
        this.#schedule = schedule;
    }

    /**
     * Gets lecture schedule
     * 
     * @return schedule
     */
    getSchedule() {
        return this.#schedule;
    }

}
