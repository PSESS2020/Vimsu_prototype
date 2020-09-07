const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');

/**
 * The Slot Model
 * @module Slot
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
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
     * Creates an instance of Slot class
     * @constructor module:Slot
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
     * @method module:Slot#getId
     * 
     * @return {String} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets lecture title
     * @method module:Slot#getTitle
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets lecture's conference ID
     * @method module:Slot#getConferenceId
     * 
     * @return {String} conferenceId
     */
    getConferenceId() {
        return this.#conferenceId;
    }

    /**
     * Gets lecture video duration
     * @method module:Slot#getDuration
     * 
     * @return {number} duration
     */
    getDuration() {
        return this.#duration;
    }

    /**
     * Gets lecture video ID
     * @method module:Slot#getVideoId
     * 
     * @return {String} videoId
     */
    getVideoId() {
        return this.#videoId;
    }

    /**
     * Gets lecture remarks
     * @method module:Slot#getRemarks
     * 
     * @return {String} remarks
     */
    getRemarks() {
        return this.#remarks;
    }

    /**
     * Gets lecture starting time
     * @method module:Slot#getStartingTime
     * 
     * @return {Date} startingTime
     */
    getStartingTime() {
        return this.#startingTime;
    }

    /**
     * Gets lecture orator ID
     * @method module:Slot#getOratorId
     * 
     * @return {String} oratorId
     */
    getOratorId() {
        return this.#oratorId;
    }

    /**
     * Gets max participants of lecture
     * @method module:Slot#getMaxParticipants
     * 
     * @return {number} maxParticipants
     */
    getMaxParticipants() {
        return this.#maxParticipants;
    }
}