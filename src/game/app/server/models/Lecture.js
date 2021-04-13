const TypeChecker = require('../../client/shared/TypeChecker.js');
const LectureChat = require('./LectureChat.js');
const Settings = require('../utils/ServerSettings.js');

/**
 * The Lecture Model
 * @module Lecture
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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
     * Creates a lecture instance
     * @constructor module:Lecture
     * 
     * @param {String} id lecture ID
     * @param {String} title lecture title
     * @param {String} videoId lecture video ID
     * @param {number} duration lecture video duration
     * @param {String} remarks lecture remarks
     * @param {Date} startingTime lecture starting time
     * @param {String} oratorName lecture orator name
     * @param {String} oratorUsername lecture orator username
     * @param {number} maxParticipants lecture max participants
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

        //includes every ppant including orator
        this.#activeParticipants = [];
        this.#removedParticipants = [];

        // will prevent this from showing up on the current lectures screen
        this.#hideThis = false;

        /*This will be an array of arrays with with size 3
          that means every element is an array, 
          element[0] is the participantID (String),
          element[1] is the leaving time (Date),
          element[2] is the token counter (Int, init. with 300.000ms (5min))
        */
        this.#tokenList = [];

        this.#lectureChat = new LectureChat();
    }

    /**
     * Gets lecture ID
     * @method module:Lecture#getId
     * 
     * @return {String} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets lecture title
     * @method module:Lecture#getTitle
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets lecture video ID
     * @method module:Lecture#getVideoId
     * 
     * @return {String} videoId
     */
    getVideoId() {
        return this.#videoId;
    }

    /**
     * Gets lecture duration
     * @method module:Lecture#getDuration
     * 
     * @return {number} duration
     */
    getDuration() {
        return this.#duration;
    }

    /**
     * Gets lecture remarks
     * @method module:Lecture#getRemarks
     * 
     * @return {String} remarks
     */
    getRemarks() {
        return this.#remarks;
    }

    /**
     * Gets lecture starting time
     * @method module:Lecture#getStartingTime
     * 
     * @return {Date} startingTime
     */
    getStartingTime() {
        return this.#startingTime;
    }

    /**
     * Gets lecture orator name
     * @method module:Lecture#getOratorName
     * 
     * @return {String} oratorName
     */
    getOratorName() {
        return this.#oratorName;
    }

    /**
     * Gets lecture orator username
     * @method module:Lecture#getOratorUsername
     * 
     * @return {String} oratorUsername
     */
    getOratorUsername() {
        return this.#oratorUsername;
    }

    /**
     * Gets lecture max participants
     * @method module:Lecture#getMaxParticipants
     * 
     * @return {number} maxParticipants
     */
    getMaxParticipants() {
        return this.#maxParticipants
    }

    /**
     * Gets lecture chat instance
     * @method module:Lecture#getLectureChat
     * 
     * @return {LectureChat} lecture chat instance
     */
    getLectureChat() {
        return this.#lectureChat;
    }

    /**
     * Gets lecture active participants
     * @method module:Lecture#getActiveParticipants
     * 
     * @return {String[]} activeParticipants
     */
    getActiveParticipants() {
        return this.#activeParticipants;
    };

    /**
     * Gets lecture hide status
     * @method module:Lecture#isHidden
     * 
     * @return {boolean} true if lecture is hidden, otherwise false
     */
    isHidden() {
        return this.#hideThis;
    };

    /**
     * Hides the lecture, so that it will no longer be displayed in the currentLecturesView 
     * @method module:Lecture#hide
     */
    hide() {
        if (!this.#hideThis) {
            this.#hideThis = true;
        }
    };

    /**
     * Gets lecture token list
     * @method module:Lecture#getTokenList
     * 
     * @return {Object[]} tokenList
     */
    getTokenList() {
        return this.#tokenList;
    }

    /**
     * Is called when a participant with this ID joins a lecture
     * @method module:Lecture#enter
     * 
     * @param {String} participantId participant ID
     * @param {String} ppantUsername participant username
     * @param {boolean} isModerator true if participant is moderator, otherwise false
     * 
     * @returns {boolean} true, if the joining was successful, false otherwise
     */
    enter(participantId, ppantUsername, isModerator) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(ppantUsername);
        TypeChecker.isBoolean(isModerator);

        //orator and moderator can join every time if lecture is opened and not ended
        if ((ppantUsername === this.#oratorUsername || isModerator) && !this.isEnded() && this.isOpened()) {

            this.#activeParticipants.push(participantId);
            return true;
        }

        //listeners can join if lecture is not full and opened and not ended
        if (this.#numberOfActiveListeners < this.#maxParticipants && !this.isEnded() && this.isOpened()) {

            this.#numberOfActiveListeners++;
            this.#activeParticipants.push(participantId);
            this.#checkToken(participantId);
            return true;
        }

        //listeners can't join if lecture is full, already ended, or not yet opened
        else {
            return false;
        }
    }

    /**
     * Is called when a participant with this ID leaves a lecture
     * @method module:Lecture#leave
     * 
     * @param {String} participantId participant ID
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

                //orator and moderator has no entry in token list, so active participants only get decremented for listeners
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

    /**
     * checks if lecture is already opened
     * @method module:Lecture#isOpened
     * 
     * @return {boolean} true if opened, otherwise false
     */
    isOpened() {
        var now = new Date().getTime();
        var startingTime = this.#startingTime.getTime() - Settings.SHOWLECTURE;
        return (startingTime <= now)
    }

    /**
     * checks if lecture is already ended
     * @method module:Lecture#isEnded
     * 
     * @return {boolean} true if ended, otherwise false
     */
    isEnded() {
        var now = new Date().getTime();
        return (now >= this.getEndTime());
    }

    /**
     * Gets lecture end time
     * @method module:Lecture#getEndTime
     * 
     * @return {Date} end time
     */
    getEndTime() {
        return (this.#startingTime.getTime() + this.#duration * 1000);
    }

    /**
     * checks if lecture is accessible
     * @method module:Lecture#isAccessible
     * 
     * @return {boolean} true if accessible, otherwise false
     */
    isAccessible() {
        var now = new Date().getTime();
        return (this.isOpened() && now <= this.getEndTime());
    }

    /**
     * checks if this participant is in list of active participants
     * @method module:Lecture#hasPPant
     * 
     * @param {String} participantId participant ID
     * 
     * @return {boolean} true if found, otherwise false
     */
    hasPPant(participantId) {
        TypeChecker.isString(participantId);
        return this.#activeParticipants.includes(participantId);
    };

    /**
     * bans user from this lecture
     * @method module:Lecture#ban
     * 
     * @param {String} accountId account ID
     */
    ban(accountId) {
        TypeChecker.isString(accountId);
        this.#removedParticipants.push(accountId);
    };

    /**
     * checks if user is banned from this lecture
     * @method module:Lecture#isBanned
     * 
     * @param {String} accountId account ID
     * 
     * @return {boolean} true if banned, otherwise false
     */
    isBanned(accountId) {
        TypeChecker.isString(accountId)
        return this.#removedParticipants.includes(accountId);
    };

    /**
     * Checks if participant with this ID has a token for this lecture
     * @method module:Lecture#hasToken
     * 
     * @param {String} participantId participant ID
     * @param {String} ppantUsername participant username
     * @param {boolean} isModerator true if participant is moderator, otherwise false
     * 
     * @returns {boolean} true, if so, false otherwise
     */
    hasToken(participantId, ppantUsername, isModerator) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(ppantUsername);
        TypeChecker.isBoolean(isModerator);

        //orator and moderator has token in every case
        if (ppantUsername === this.#oratorUsername || isModerator) {
            return true;
        }

        //check for listeners
        for (var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];
            if (element[0] === participantId) {
                if (element[2] >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Traverses through the tokenList of the lecture and checks for an entry
     * that belongs to the passed participant. If it finds such a token,
     * and the token has not already run out, it revokes it by setting 
     * the counter to zero. 
     * @method module:Lecture#revokeToken
     * 
     * @param {String} participantId participant ID
     */
    revokeToken(participantId) {
        TypeChecker.isString(participantId);

        //it's not possible to revoke a token from the orator or moderator
        for (var i = 0; i < this.#tokenList.length; i++) {
            var element = this.#tokenList[i];
            if (element[0] === participantId && element[2] >= 0) {
                element[2] = -100; // needs to be negative as setting it to zero won't
                // change behaviour of hasToken
            }
        }
    };

    /**
     * Grants token to a participant
     * @method module:Lecture#grantToken
     * 
     * @param {String} participantID participant ID
     * 
     * @return {boolean} true if token is granted, otherwise false
     */
    grantToken(participantID) {
        TypeChecker.isString(participantID);

        // If the participant is the orator, moderator or already has a token, we don't need to do anything
        // We can not grant a token to a participant not yet in the lecture
        if (this.#tokenList[this.#getTokenIndex(participantID)] === undefined || this.#tokenList[this.#getTokenIndex(participantID)][2] >= 0 || !this.#activeParticipants.includes(participantID)) {
            return false;
        }
        this.#tokenList[this.#getTokenIndex(participantID)][2] = 30000;
        return true;
    };

    /**
     * @private Checks participant's token
     * 
     * @method module:Lecture#checkToken
     * 
     * @param {String} participantId participant ID
     */
    #checkToken = function (participantId) {
        TypeChecker.isString(participantId);

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

    /**
     * @private Gets token index of this participant
     * 
     * @method module:Lecture#getTokenIndex
     * 
     * @param {String} participantId participant ID
     * 
     * @return {number} token index
     */
    #getTokenIndex = function (participantId) {
        TypeChecker.isString(participantId);

        for (var i = 0; i < this.#tokenList.length; i++) {
            if (this.#tokenList[i][0] === participantId) {
                return i;
            }
        }
        return -1;
    }


}
