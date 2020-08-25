const TypeChecker = require('../../client/shared/TypeChecker.js');
const LectureChat = require('./LectureChat.js');
const Settings = require('../utils/Settings.js');

module.exports = class Lecture {

    #id;
    #title;
    #videoId;
    #duration;
    #remarks;
    #startingTime;
    #oratorName;
    #oratorUsername;
    #lectureChat;
    #maxParticipants;
    #numberOfActiveListeners;
    #activeParticipants;
    #removedParticipants;
    #tokenList;
    #hideThis;
    


    /**
     * 
     * @param {String} id 
     * @param {String} title 
     * @param {String} videoId 
     * @param {String} remarks 
     * @param {Date} startingTime 
     * @param {String} oratorName
     * @param {String} oratorUsername
     * @param {int} maxParticipants 
     */
    constructor(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(videoId);
        TypeChecker.isNumber(duration);
        TypeChecker.isString(remarks);
        TypeChecker.isDate(startingTime);
        TypeChecker.isString(oratorName);
        TypeChecker.isString(oratorUsername);
        TypeChecker.isInt(maxParticipants);

        this.#id = id;
        this.#title = title;
        this.#videoId = videoId;
        this.#duration = duration;
        this.#remarks = remarks;
        this.#startingTime = startingTime;
        this.#oratorName = oratorName;
        this.#oratorUsername = oratorUsername;
        this.#maxParticipants = maxParticipants;

        //includes every ppant except orator
        this.#numberOfActiveListeners = 0;

        //incluedes every ppant including orator
        this.#activeParticipants = [];
        this.#removedParticipants = [];

        this.#hideThis = false; // will prevent this from showing up on the current lectures screen

        /*This will be an array of arrays with with size 3
        that means every element is an array, 
        element[0] is the participantID (String),
        element[1] is the leaving time (Date),
        element[2] is the token counter (Int, init. with 300.000ms (5min))
        */
        this.#tokenList = [];

        this.#lectureChat = new LectureChat();
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

    getOratorUsername() {
        return this.#oratorUsername;
    }

    getMaxParticipants() {
        return this.#maxParticipants
    }

    getLectureChat() {
        return this.#lectureChat;
    }

    getActiveParticipants() {
        return this.#activeParticipants;
    };

    isHidden() {
        return this.#hideThis;
    };

    // Hides the lecture, so that it will no longer be displayed
    // in the currentLecturesView 
    hide() {
        if (!this.#hideThis) {
            this.#hideThis = true;
        }
    };

    getTokenList() {
        return this.#tokenList;
    }

    /**
     * Is called when a participant with this ID joins a lecture
     * 
     * 
     * @param {String} participantId  
     * @param {String} ppantUsername
     * @returns true, if the joining was successful
     *          false, otherwise
     */
    enter(participantId, ppantUsername) {

        TypeChecker.isString(participantId);
        TypeChecker.isString(ppantUsername);

        //orator can join every time if lecture is opened and not ended
        if(ppantUsername === this.#oratorUsername && !this.isEnded() && this.#isOpened()) {

            this.#activeParticipants.push(participantId);
            return true;
        }

        //listeners can join if lecture is not full and opened and not ended
        if (this.#numberOfActiveListeners < this.#maxParticipants && !this.isEnded() && this.#isOpened()) {

            this.#numberOfActiveListeners++;
            this.#activeParticipants.push(participantId);
            this.#checkToken(participantId);
            console.log('check token');
            return true;
        }

        //listeners can't join if lecture is full, already ended, or not yet opened
        else {
            return false;
        }
    }

    /**
     * Is called when a participant with this ID leaves a lecture
     * 
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

                //orator has no entry in token list, so active participants only get decremented for listeners
                this.#numberOfActiveListeners--;

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

    #isOpened = function() {
        var now = new Date().getTime();
        var startingTime = this.#startingTime.getTime() - Settings.SHOWLECTURE;
        return (startingTime <= now)
    }

    isEnded() {
        var now = new Date().getTime();
        var endTime = (this.#startingTime.getTime() + this.#duration * 1000);
        return (now >= endTime);
    }
    
    isAccessible() {
        var now = new Date().getTime();
        var endTime = (this.#startingTime.getTime() + this.#duration * 1000);
        return (this.#isOpened() && now <= endTime);
    }

    hasPPant(participantId) {
        return this.#activeParticipants.includes(participantId);
    };

    ban(accountId) {
        this.#removedParticipants.push(accountId);
    };

    isBanned(accountId) {
        return this.#removedParticipants.includes(accountId);
    };

    /**
     * Is called to check, if participant with this ID has an token for this lecture
     * 
     * 
     * @param {String} participantId 
     * @param {String} ppantUsername
     * @returns true, if so
     *          false, otherwise
     */
    hasToken(participantId, ppantUsername) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(ppantUsername);

        //orator has token of his own lecture in every case
        if(ppantUsername === this.#oratorUsername) {
            return true;
        }

        //check for listeners
        for (var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];
            if (element[0] === participantId) {
                if (element[2] >= 0) {
                    console.log(true);
                    return true;
                }
            }
        }
        return false;
    }

    /* Traverses through the tokenList of the lecture and checks for an entry
     * that belongs to the passed participant. If it finds such a token,
     * and the token has not already run out, it revokes it by setting 
     * the counter to zero. 
     * - (E) */
    revokeToken(participantId) {
        TypeChecker.isString(participantId);

        //it's not possible to revoke a token from the orator
        for (var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];
            if (element[0] === participantId && element[2] >= 0) {
                element[2] = -100; // needs to be negative as setting it to zero won't
                // change behaviour of hasToken
            }
        }
    };

    grantToken(participantID) {
        TypeChecker.isString(participantID);

        // If the participant is the orator or already has a token, we don't need to do anything
        // We can not grant a token to a participant not yet in the lecture
        if (this.#tokenList[this.#getTokenIndex(participantID)] === undefined || this.#tokenList[this.#getTokenIndex(participantID)][2] >= 0 || !this.#activeParticipants.includes(participantID)) {
            return false;
        }
        this.#tokenList[this.#getTokenIndex(participantID)][2] = 30000;
        return true;
    };

    #checkToken = function (participantId) {
        let currDate = new Date();

        //check if participant was in this lecture before
        for (var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];

            //participant was here before
            if (element[0] === participantId) {

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

    #getTokenIndex = function (participantId) {
        for (var i = 0; i < this.#tokenList.length; i++) {
            if (this.#tokenList[i][0] === participantId) {
                return i;
            }
        }
        return -1;
    }


}
