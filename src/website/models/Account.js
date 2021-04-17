const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const TypeOfRole = require('../utils/TypeOfRole')

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
    #role;
    #token;
    #isActive;

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
     * @param {TypeOfRole} role user's role
     * @param {String} token user's token
     * @param {Boolean} isActive true if account is active
     */
    constructor(accountID, username, title, surname, forename, job, company, email, role, token, isActive) {
        TypeChecker.isString(accountID);
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);
        TypeChecker.isEnumOf(role, TypeOfRole);
        TypeChecker.isString(token);
        TypeChecker.isBoolean(isActive);

        this.#accountID = accountID;
        this.#username = username;
        this.#title = title;
        this.#surname = surname;
        this.#forename = forename;
        this.#job = job;
        this.#company = company;
        this.#email = email;
        this.#role = role;
        this.#token = token;
        this.#isActive = isActive;
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

    /**
     * Gets user's role
     * @method module:Account#getRole
     * 
     * @returns {TypeOfRole} role
     */
     getRole() {
        return this.#role;
    }

    /**
     * Gets user's token
     * @method module:Account#getToken
     * 
     * @returns {String} token
     */
    getToken() {
        return this.#token;
    }

    /**
     * Gets account activation status
     * @method module:Account#getIsActive
     * 
     * @returns {Boolean} true if account is active
     */
    getIsActive() {
        return this.#isActive;
    }
}