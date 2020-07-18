module.exports = class Schedule {
    
    #lectureList = [];
    
    
    /**
    * @author Laura
    * 
    */

    constructor(lectureList) {
        this.#lectureList = lectureList;
    }

    getLecture(lectureId) {
        for(var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];
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
            var lecture = this.#lectureList[i];
            var startingTime = lecture.getStartingTime().getTime();
            var now = new Date().getTime();
            var startToShow = (startingTime - (10 * 60 * 400000)); //10 Minutes in milliseconds
            var stopToShow = (startingTime + (15 * 60 * 400000));
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
   