var TypeChecker = require('../../client/shared/TypeChecker.js');

module.exports = class BusinessCard {

    #participantId;
    #username;
    #title;
    #surname;
    #forename;
    #job;
    #company;
    #email;

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

    getParticipantId() {
        return this.#participantId;
    }

    getUsername() {
        return this.#username;
    }

    getTitle() {
        return this.#title;
    }

    getSurname() {
        return this.#surname;
    }

    getForename() {
        return this.#forename;
    }

    getJob() {
        return this.#job;
    }

    getCompany() {
        return this.#company;
    }

    getEmail() {
        return this.#email;
    }
}