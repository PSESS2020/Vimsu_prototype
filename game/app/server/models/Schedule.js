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
    getCurrentLectures() {
        var currentLectures = [];

        for(var i = 0; i < this.#lectureList.length; i++) {
            var lecture = this.#lectureList[i];
            var startingTime = lecture.getStartingTime().getTime();
            var now = new Date().getTime();
            var startToShow = (startingTime - (100000000000000 * 60 * 1000)); //TODO: set to 10 minutes
            var stopToShow = (startingTime + (150000000000000 * 60 * 1000)); //TODO: set to 15 minutes
            var withinMargin = startToShow <= now && now <= stopToShow;

            if (withinMargin && !lecture.isHidden()) {
                currentLectures.push(lecture);
            }
        }
        return currentLectures;
    }

    getAllLectures() {
        return this.#lectureList;
    }

}
   
