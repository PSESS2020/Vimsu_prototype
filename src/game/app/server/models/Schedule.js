const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');

/**
 * The Schedule Model
 * @module Schedule
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Schedule {

    #lectureList = [];

    /**
     * Creates a Schedule instance
     * @constructor module:Schedule
     * 
     * @param {Lecture[]} lectureList list of lectures
     */
    constructor(lectureList) {
        lectureList.forEach(lecture => {
            TypeChecker.isInstanceOf(lecture, Lecture);
        })
        this.#lectureList = lectureList;
    }

    /**
     * Gets a lecture based on its ID
     * @method module:Schedule#getLecture
     * 
     * @param {String} lectureId lecture ID
     * 
     * @return {Lecture} lecture with passed id or nothing if no such lecture exists
     */
    getLecture(lectureId) {
        TypeChecker.isString(lectureId);

        for (var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];
            if (lecture.getId() === lectureId) {
                return lecture;
            }
        }
    }

    /**
     * Gets the lectures that start soon or have started already.
     * @method module:Schedule#getCurrentLectures
     * 
     * @return {Lecture[]} Array of current lectures
     */
    getCurrentLectures() {
        var currentLectures = [];

        for (var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];

            if (lecture.isAccessible() && !lecture.isHidden()) {
                currentLectures.push(lecture);
            }
        }
        return currentLectures;
    }

    /**
     * Gets all lectures
     * @method module:Schedule#getAllLectures
     * 
     * @return {Lecture[]} Array of lectures
     */
    getAllLectures() {
        return this.#lectureList;
    }

}

