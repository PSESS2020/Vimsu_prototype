if (typeof module === 'object' && typeof exports === 'object') {
    TypeChecker = require('../shared/TypeChecker.js');
}

/**
 * The Business Card Client Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class BusinessCardClient {

    participantId;
    username;
    title;
    surname;
    forename;
    job;
    company;
    email;

    /**
     * Creates an instance of Business Card on client-side
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
    constructor(cardData) {
        const { ppantId, username, forename } = cardData
        
        TypeChecker.isString(ppantId);
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

        this.participantId = ppantId;
        this.username = username;
        this.forename = forename;
        this.title = title;
        this.surname = surname;
        this.job = job;
        this.company = company;
        this.email = email;
    }

    /**
     * Gets participant ID
     * 
     * @return {String} participantId
     */
    getParticipantId() {
        return this.participantId;
    }

    /**
     * Gets participant username
     * 
     * @return {String} username
     */
    getUsername() {
        return this.username;
    }

    /**
     * Gets participant title
     * 
     * @return {?String} title
     */
    getTitle() {
        return this.title;
    }

    /**
     * Gets participant surname
     * 
     * @return {?String} surname
     */
    getSurname() {
        return this.surname;
    }

    /**
     * Gets participant forename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.forename;
    }

    /**
     * Gets participant job
     * 
     * @return {?String} job
     */
    getJob() {
        return this.job;
    }

    /**
     * Gets participant company
     * 
     * @return {?String} company
     */
    getCompany() {
        return this.company;
    }

    /**
     * Gets participant email
     * 
     * @return {?String} email
     */
    getEmail() {
        return this.email;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = BusinessCardClient;
}