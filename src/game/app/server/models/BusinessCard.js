const TypeChecker = require('../../client/shared/TypeChecker.js');

/**
 * The Business Card Model
 * @module BusinessCard
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class BusinessCard {

    #participantId;
    #username;
    #title;
    #surname;
    #forename;
    #job;
    #company;
    #email;

    /**
     * Creates an instance of BusinessCard
     * @constructor module:BusinessCard
     * 
     * @param {String} participantId participant ID
     * @param {String} username participant username
     * @param {String} title participant title
     * @param {String} surname participant surname
     * @param {String} forename participant forename
     * @param {String} job participant job
     * @param {String} company participant company
     * @param {String} email participant email
     */
    constructor(participantId, username, title, surname, forename, job, company, email) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);

        this.#participantId = participantId;
        this.#username = username;
        this.#title = title;
        this.#surname = surname;
        this.#forename = forename;
        this.#job = job;
        this.#company = company;
        this.#email = email;
    }

    /**
     * Gets participant ID
     * 
     * @return {String} participantId
     */
    getParticipantId() {
        return this.#participantId;
    }

    /**
     * Gets participant username
     * 
     * @return {String} username
     */
    getUsername() {
        return this.#username;
    }

    /**
     * Gets participant title
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets participant surname
     * 
     * @return {String} surname
     */
    getSurname() {
        return this.#surname;
    }

    /**
     * Gets participant forename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }

    /**
     * Gets participant job
     * 
     * @return {String} job
     */
    getJob() {
        return this.#job;
    }

    /**
     * Gets participant company
     * 
     * @return {String} company
     */
    getCompany() {
        return this.#company;
    }

    /**
     * Gets participant email
     * 
     * @return {String} email
     */
    getEmail() {
        return this.#email;
    }
}