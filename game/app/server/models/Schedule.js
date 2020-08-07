const Settings = require('../../utils/Settings');
const TypeChecker = require('../../../../config/TypeChecker.js');
const Lecture = require('../models/Lecture');

module.exports = class Schedule {
    
    #lectureList = [];
    
    
    /**
    * @author Laura
    * 
    */

    constructor(lectureList) {
        lectureList.forEach(lecture => {
            TypeChecker.isInstanceOf(lecture, Lecture);
        })
        this.#lectureList = lectureList;
    }

    getLecture(lectureId) {
        TypeChecker.isString(lectureId);
        
        for(var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];
            if(lecture.getId() === lectureId) {
                return lecture;
            }
        }
    }

    //returns the lectures that start soon or have started already.
    //TODO: maybe move Timedeltas in global constants file
    getCurrentLectures() {
        var currentLectures = [];

        for(var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];
            var startingTime = lecture.getStartingTime().getTime();
            var now = new Date().getTime();
            var startToShow = (startingTime - Settings.SHOWLECTURE);
            var stopToShow = (startingTime + lecture.getDuration()*1000);
            var withinMargin = startToShow <= now && now <= stopToShow;

            if (withinMargin) {
                currentLectures.push(lecture);
            }
        }
        return currentLectures;
    }

    getAllLectures() {
        return this.#lectureList;
    }

}
   