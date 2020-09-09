const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');

/**
 * The Account Model
 * @module Account
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Account {

    #accountID;
    #username;
    #title;
    #surname;
    #forename;
    #job;
    #company;
    #email;

    /**
     * Creates an instance of Account class
     * @constructor module:Account
     * 
     * @param {String} accountID account ID
     * @param {String} username account username
     * @param {String} title user's title
     * @param {String} surname user's surname
     * @param {String} forename user's forename
     * @param {String} job user's job
     * @param {String} company user's company
     * @param {String} email user's email
     */
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

    /**
     * Gets account ID
     * @method module:Account#getAccountID
     * 
     * @return {String} accountID
     */
    getAccountID() {
        return this.#accountID;
    }

    /**
     * Gets account username
     * @method module:Account#getUsername
     * 
     * @return {String} username
     */
    getUsername() {
        return this.#username;
    }

    /**
     * Gets user's title
     * @method module:Account#getTitle
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets user's surname
     * @method module:Account#getSurname
     * 
     * @return {String} surname
     */
    getSurname() {
        return this.#surname;
    }

    /**
     * Gets user's forename
     * @method module:Account#getForename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }

    /**
     * Gets user's job
     * @method module:Account#getJob
     * 
     * @return {String} job
     */
    getJob() {
        return this.#job;
    }

    /**
     * Gets user's company
     * @method module:Account#getCompany
     * 
     * @return {String} company
     */
    getCompany() {
        return this.#company;
    }

    /**
     * Gets user's email
     * @method module:Account#getEmail
     * 
     * @return {String} email
     */
    getEmail() {
        return this.#email;
    }
}