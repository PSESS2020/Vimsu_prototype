const TypeChecker = require("../../client/shared/TypeChecker");
const Schedule = require('./Schedule');

/**
 * The Conference Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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
