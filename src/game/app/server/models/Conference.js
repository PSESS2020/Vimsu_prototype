const TypeChecker = require("../../client/shared/TypeChecker");
const Schedule = require('./Schedule');

/**
 * The Conference Model
 * @module Conference
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Conference {

    #schedule;

    /**
     * Creates a conference instance
     * @constructor module:Conference
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
     * @return {Schedule} schedule
     */
    getSchedule() {
        return this.#schedule;
    }

}
