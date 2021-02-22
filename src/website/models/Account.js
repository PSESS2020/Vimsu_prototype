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
    #forename;

    /**
     * Creates an instance of Account class
     * @constructor module:Account
     * 
     * @param {String} accountID account ID
     * @param {String} username account username
     * @param {String} forename user's forename
     */
    constructor(accountID, username, forename) {
        TypeChecker.isString(accountID);
        TypeChecker.isString(username);
        TypeChecker.isString(forename);

        this.#accountID = accountID;
        this.#username = username;
        this.#forename = forename;
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
     * Gets user's forename
     * @method module:Account#getForename
     * 
     * @return {String} forename
     */
    getForename() {
        return this.#forename;
    }
}