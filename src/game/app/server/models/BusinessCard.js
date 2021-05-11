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
     * @param {String} forename participant forename
     * @param {?String} title participant title
     * @param {?String} surname participant surname
     * @param {?String} job participant job
     * @param {?String} company participant company
     * @param {?String} email participant email
     */
    constructor(participantId, username, forename, title, surname, job, company, email) {
        TypeChecker.isString(participantId);
        TypeChecker.isString(username);
        TypeChecker.isString(forename);

        //following attributes can be undefined if registration system is not advanced
        if (title !== undefined)
            TypeChecker.isString(title);
        if (surname !== undefined)
            TypeChecker.isString(surname);
        if (job !== undefined)
            TypeChecker.isString(job);
        if (company !== undefined)
            TypeChecker.isString(company);
        if (email !== undefined) 
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
     * @method module:BusinessCard#getParticipantId
     * 
     * @return {String} participantId
     */
    getParticipantId() {
        return this.#participantId;
    }

    /**
     * Gets participant username
     * @method module:BusinessCard#getUsername
     * 
     * @return {String} username
     */
    getUsername() {
        return this.#username;
    }

    /**
     * Gets participant title
     * @method module:BusinessCard#getTitle
     * 
     * @return {?String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets participant surname
     * @method module:BusinessCard#getSurname
     * 
     * @return {?String} surname
     */
    getSurname() {
        return this.#surname;
    }

    /**
     * Gets participant forename
     * @method module:BusinessCard#getForename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }

    /**
     * Gets participant job
     * @method module:BusinessCard#getJob
     * 
     * @return {?String} job
     */
    getJob() {
        return this.#job;
    }

    /**
     * Gets participant company
     * @method module:BusinessCard#getCompany
     * 
     * @return {?String} company
     */
    getCompany() {
        return this.#company;
    }

    /**
     * Gets participant email
     * @method module:BusinessCard#getEmail
     * 
     * @return {?String} email
     */
    getEmail() {
        return this.#email;
    }
}