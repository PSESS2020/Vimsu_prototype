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
     * @constructor Creates an instance of Slot class
     * 
     * @param {String} id lecture ID
     * @param {String} title lecture title
     * @param {String} videoId lecture video ID
     * @param {String} duration lecture video duration
     * @param {String} conferenceId lecture's conference ID
     * @param {String} remarks lecture remarks
     * @param {Date} startingTime lecture starting time
     * @param {String} oratorId lecture orator ID
     * @param {number} maxParticipants max participants of lecture
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

    /**
     * Gets lecture ID
     * 
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets lecture title
     * 
     * @return title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets lecture's conference ID
     * 
     * @return conferenceId
     */
    getConferenceId() {
        return this.#conferenceId;
    }

    /**
     * Gets lecture video duration
     * 
     * @return duration
     */
    getDuration() {
        return this.#duration;
    }

    /**
     * Gets lecture video ID
     * 
     * @return videoId
     */
    getVideoId() {
        return this.#videoId;
    }

    /**
     * Gets lecture remarks
     * 
     * @return remarks
     */
    getRemarks() {
        return this.#remarks;
    }

    /**
     * Gets lecture starting time
     * 
     * @return startingTime
     */
    getStartingTime() {
        return this.#startingTime;
    }

    /**
     * Gets lecture orator ID
     * 
     * @return oratorId
     */
    getOratorId() {
        return this.#oratorId;
    }

    /**
     * Gets max participants of lecture
     * 
     * @return maxParticipants
     */
    getMaxParticipants() {
        return this.#maxParticipants;
    }
}