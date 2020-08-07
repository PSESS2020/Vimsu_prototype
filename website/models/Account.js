var TypeChecker = require('../../config/TypeChecker')

module.exports = class Account {

    #accountID;
    #username;
    #title;
    #surname;
    #forename;
    #job;
    #company;
    #email;

    constructor(accountID, username, title, surname, forename, job, company, email) {
        TypeChecker.isString(accountID);
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);
        
        this.#accountID = accountID;
        this.#username = username;
        this.#title = title;
        this.#surname = surname;
        this.#forename = forename;
        this.#job = job;
        this.#company = company;
        this.#email = email;
    }

    getAccountID() {
        return this.#accountID;
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