const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');

module.exports = class Slot {

    #id;
    #title;
    #conferenceId;
    #videoId;
    #duration;
    #remarks;
    #startingTime;
    #oratorId;
    #maxParticipants;

    /**
     * 
     * @param {String} id
     * @param {String} title 
     * @param {String} videoId 
     * @param {String} duration
     * @param {String} conferenceId
     * @param {String} remarks 
     * @param {Date} startingTime 
     * @param {String} oratorId 
     * @param {number} maxParticipants 
     */
    constructor(id, title, conferenceId, videoId, duration, remarks, startingTime, oratorId, maxParticipants) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(conferenceId);
        TypeChecker.isString(videoId);
        TypeChecker.isNumber(duration);
        TypeChecker.isString(remarks);
        TypeChecker.isDate(startingTime);
        TypeChecker.isString(oratorId);
        TypeChecker.isInt(maxParticipants);

        this.#id = id;
        this.#title = title;
        this.#videoId = videoId;
        this.#conferenceId = conferenceId;
        this.#duration = duration;
        this.#remarks = remarks;
        this.#startingTime = startingTime;
        this.#oratorId = oratorId;
        this.#maxParticipants = maxParticipants;
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getConferenceId() {
        return this.#conferenceId;
    }

    getDuration() {
        return this.#duration;
    }

    getVideoId() {
        return this.#videoId;
    }

    getRemarks() {
        return this.#remarks;
    }

    getStartingTime() {
        return this.#startingTime;
    }

    getOratorId() {
        return this.#oratorId;
    }

    getMaxParticipants() {
        return this.#maxParticipants;
    }
}