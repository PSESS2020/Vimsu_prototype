var TypeChecker = require('../../game/app/utils/TypeChecker')
var Account = require('./Account')

module.exports = class Slot {

    #id;
    #title;
    #videoId;
    #remarks;
    #startingTime;
    #oratorId;
    #maxParticipants;

    /**
     * @author Klaudia
     * 
     * @param {String} title 
     * @param {String} videoId 
     * @param {String} remarks 
     * @param {Date} startingTime 
     * @param {String} oratorId 
     * @param {int} maxParticipants 
     */
    constructor(title, videoId, remarks, startingTime, oratorId, maxParticipants) {
        TypeChecker.isString(title);
        TypeChecker.isString(videoId);
        TypeChecker.isString(remarks);
        TypeChecker.isInstanceOf(startingTime, Date);
        TypeChecker.isString(oratorId);
        TypeChecker.isInt(maxParticipants);

        this.#title = title;
        this.#videoId = videoId;
        this.#remarks = remarks;
        this.#startingTime = startingTime;
        this.#oratorId = oratorId;
        this.#maxParticipants = maxParticipants;
    }

    setId(id) {
        TypeChecker.isString(id);
        this.#id = id;
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