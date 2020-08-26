const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');

module.exports = class Schedule {

    #lectureList = [];

    /**
     * 
     * @param {Lecture[]} lectureList 
     */
    constructor(lectureList) {
        lectureList.forEach(lecture => {
            TypeChecker.isInstanceOf(lecture, Lecture);
        })
        this.#lectureList = lectureList;
    }

    /**
     * 
     * @param {String} lectureId 
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

    //returns the lectures that start soon or have started already.
    //TODO: maybe move Timedeltas in global constants file
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

    getAllLectures() {
        return this.#lectureList;
    }

}

