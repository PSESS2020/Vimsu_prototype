const Settings = require('../../utils/Settings');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Lecture = require('../models/Lecture');

module.exports = class Schedule {

    #lectureList = [];
    #currentLectures = [];


    /**
    * @author Laura
    * 
    */

    constructor(lectureList) {
        lectureList.forEach(lecture => {
            TypeChecker.isInstanceOf(lecture, Lecture);
        })
        this.#lectureList = lectureList;
        this.#currentLectures = lectureList;
    }

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
        for (var i = 0; i < this.#currentLectures.length; i++) {
            var lecture = this.#currentLectures[i];
            var startingTime = lecture.getStartingTime().getTime();
            var now = new Date().getTime();
            var startToShow = (startingTime - Settings.SHOWLECTURE);
            var withinMargin = startToShow <= now;

            if (!withinMargin || lecture.isHidden()) {
                this.#currentLectures.splice(i, 1);
            }
        }
        
        return this.#currentLectures;
    }

    stopShowingLecture(lectureId) {
        for (var i = 0; i < this.#currentLectures.length; i++) {
            var lecture = this.#currentLectures[i];
            if (lecture.getId() === lectureId) {
                this.#currentLectures.splice(i, 1);
            }
        }
    }

    getAllLectures() {
        return this.#lectureList;
    }

}

