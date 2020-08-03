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
        TypeChecker.isString(remarks);
        TypeChecker.isInstanceOf(startingTime, Date);
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

        //time difference in ms
        //let timeDifference = currDate - this.#startingTime;
        //lecture is full or started longer than 5 minutes ago
        if (this.#activeParticipants.length >= this.#maxParticipants/* || timeDifference >= 300000*/) { 

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

        //Adds current time as leaving time in token list
        this.#tokenList.forEach(element => {

            //check if there is an element with this ID
            if (element[0] === participantId) {
                element[1] = new Date();
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

        for(var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];
            if(element[0] === participantId) {
                
                //time difference in ms between Leaving Date and Current Date
                let timeDifference = currDate - element[1];

                //Token Counter - timeDifference
                element[2] -= timeDifference;
                console.log(this.#tokenList);
                return;  

            }

        }

        let timeLeftUntilStart = this.#startingTime.getTime() - currDate.getTime();
        let tokenCounter = Settings.TOKENCOUNTERSTART;

        if(timeLeftUntilStart > 0) {
            tokenCounter = tokenCounter + timeLeftUntilStart;
        }

        //There is no entry with participantId
        //make new entry with participantID, undefined Leaving Time, Token Counter 300.000ms
        this.#tokenList.push([participantId, undefined, tokenCounter]);
        console.log(this.#tokenList);
    }

}
