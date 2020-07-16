

module.exports = class Schedule {
    
    #lectureList;
    
    
    /**
    * @author Laura
    * 
    * @param {Lecture[]} lectureList
    */

    constructor(lectureList) {
        this.lectureList = this.lectureList;
    }

    getLecture(lectureId) {
        for(var i = 0; i < this.#lectureList.length; i++) {
            lecture = this.#lectureList[i];
            if(lecture.getId() === lectureId) {
                return lecture;
            }
        }
    }

    //returns the lectures that start soon or have started already.
    //TODO: maybe move Timedeltas in global constants file
    getcurrentLectures() {
        var currentLectures = [];
        for(var i = 0; i < this.#lectureList.length; i++) {
            lecture = this.#lectureList[i];
            startingTime = lecture.getStartingTime().getTime();
            now = new Date().now();
            startToShow = (now.getTime() + (10 * 60 * 1000)); //10 Minutes in milliseconds
            startToShowTime = startToShow.getTime();
            stopToShow = (startingTime.getTime() + (15 * 60 * 1000));
            stopToShowTime = stopToShow.getTime();
            var withinMargin = startToShowTime >= now && stopToShowTime <= now;
            if (withinMargin) {
                currentLectures.append(lecture);
            }
        }
        return currentLectures;
    }

}
   