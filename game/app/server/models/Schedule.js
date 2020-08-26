const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');

module.exports = class Schedule {

    #lectureList = [];

    /**
     * @constructor Creates a Schedule instance
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
     * 
     * @param {String} lectureId lecture ID
     * 
     * @return Lecture instance
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
     * 
     * @return Array of current lectures
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
     * 
     * @return Array of lectures
     */
    getAllLectures() {
        return this.#lectureList;
    }

}

