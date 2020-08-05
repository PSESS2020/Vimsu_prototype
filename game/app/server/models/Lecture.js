var TypeChecker = require('../../utils/TypeChecker.js');
var Orator = require('./Orator.js');
const LectureChat = require('./LectureChat.js');
const Settings = require('../../utils/Settings.js');

module.exports = class Lecture {

    #id;
    #title;
    #videoId;
    #duration;
    #remarks;
    #startingTime;
    #oratorName;
    #lectureChat; 
    #maxParticipants;
    #activeParticipants;
    #tokenList;                 
    //#lectureController //Probably not needed 


    /**
     * @author Philipp
     * 
     * @param {String} id 
     * @param {String} title 
     * @param {String} videoId 
     * @param {String} remarks 
     * @param {Date} startingTime 
     * @param {String} oratorName
     * @param {int} maxParticipants 
     */
    constructor(id, title, videoId, duration, remarks, startingTime, oratorName, maxParticipants) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(videoId);
        TypeChecker.isNumber(duration);
        TypeChecker.isString(remarks);
        TypeChecker.isDate(startingTime);
        TypeChecker.isString(oratorName);
        TypeChecker.isInt(maxParticipants);

        this.#id = id;
        this.#title = title;
        this.#videoId = videoId;
        this.#duration = duration;
        this.#remarks = remarks;
        this.#startingTime = startingTime;
        this.#oratorName = oratorName;
        this.#maxParticipants = maxParticipants;
        this.#activeParticipants = [];

        /*This will be an array of arrays with with size 3
        that means every element is an array, 
        element[0] is the participantID (String),
        element[1] is the leaving time (Date),
        element[2] is the token counter (Int, init. with 300.000ms (5min))
        */
        this.#tokenList = []; 

        this.#lectureChat = new LectureChat(this.#id);
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getVideoId() {
        return this.#videoId;
    }

    getDuration() {
        return this.#duration;
    }

    getRemarks() {
        return this.#remarks;
    }

    getStartingTime() {
        return this.#startingTime;
    }

    getOratorName() {
        return this.#oratorName;
    }

    getMaxParticipants() {
        return this.#maxParticipants
    }

 
    getLectureChat() {
        return this.#lectureChat;
    }

    getActiveParticipants() {
        return this.#activeParticipants;
    }

    getTokenList() {
        return this.#tokenList;
    }


    /**
     * Is called when a participant with this ID joins a lecture
     * 
     * @author Philipp
     * 
     * @param {String} participantId 
     * @returns true, if the joining was successful
     *          false, otherwise
     */
    enter(participantId) {

        TypeChecker.isString(participantId);
        let currDate = new Date();


        //lecture is full
        if (this.#activeParticipants.length >= this.#maxParticipants) { 

            return false;
        } 
        
        //lecture is not full and started not longer than 5 minutes ago
        else {
            this.#activeParticipants.push(participantId);
            this.#checkToken(participantId);
            console.log('check token');
            return true;
        }
    }

    /**
     * Is called when a participant with this ID leaves a lecture
     * 
     * @author Philipp
     * 
     * @param {String} participantId 
     */
    leave(participantId) {
        TypeChecker.isString(participantId);

        //Remove participant Id from list of active participants
        if (this.#activeParticipants.includes(participantId)) {
            let index = this.#activeParticipants.indexOf(participantId);
            this.#activeParticipants.splice(index, 1);
        }

        this.#tokenList.forEach(element => {

            //check if there is an element with this ID
            if (element[0] === participantId) {
                let leaveDate = new Date();

                //check if ppant left before lecture started
                //if so, leaving time should be the starting time so the token counter gets decreased correctly when he joins again during the lecture
                if (this.#startingTime.getTime() > leaveDate.getTime()) {
                    element[1] = this.#startingTime;
                } 
                
                //if not, leaving date needs to be stored to decrease the token counter when ppant joins again
                else {
                    element[1] = leaveDate;
                }
            }
        });
    }

    /**
     * Is called to check, if participant with this ID has an token for this lecture
     * 
     * @author Philipp
     * 
     * @param {String} participantId 
     * @returns true, if so
     *          false, otherwise
     */
    hasToken(participantId) {
        TypeChecker.isString(participantId);

            for(var i = 0; i < this.#tokenList.length; i++) {
                var element = this.#tokenList[i];
                if(element[0] === participantId) {
                    if (element[2] >= 0) {
                        console.log(true);
                        return true;
                    }
                }
            }
            return false;
    }

    #checkToken = function(participantId) {
        let currDate = new Date();

        //check if participant was in this lecture before
        for(var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];

            //participant was here before
            if(element[0] === participantId) {

                //check if lecture has already begon
                //if so, token counter needs to be decreased
                if (currDate.getTime() > this.#startingTime.getTime()) {

                    //time difference in ms between Leaving Date and Current Date
                    let timeDifference = currDate.getTime() - element[1].getTime();

                    //Token Counter - timeDifference
                    element[2] -= timeDifference;
                    
                }
                console.log('token counter: ' + element[2]);

                //if not, token counter stays the same
                return;  
            }

        }

        //There is no entry with participantId
        
        var timeToLate = 0;

        //calculate time difference between starting time and date, if user joined the lecture after starting time
        if (currDate.getTime() > this.#startingTime.getTime()) {
            timeToLate = currDate.getTime() - this.#startingTime.getTime();
        }

        let tokenCounter = Settings.TOKENCOUNTERSTART;

        //make new entry with participantID, undefined Leaving Time, Token Counter 300.000ms - Time to late
        tokenCounter = tokenCounter - timeToLate;
        console.log('token counter: ' + tokenCounter);
        
        
        this.#tokenList.push([participantId, undefined, tokenCounter]);
    }

}
