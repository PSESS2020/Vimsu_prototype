var TypeChecker = require('../../game/app/utils/TypeChecker')

module.exports = class Account {

    #accountID;
    #username;
    #title;
    #surname;
    #forename;
    #email;

    constructor(username, title, surname, forename, email) {
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(email);
        
        this.#username = username;
        this.#title = title;
        this.#surname = surname;
        this.#forename = forename;
        this.#email = email;
    }

    setAccountID(accountID) {
        TypeChecker.isString(accountID);
        this.#accountID = accountID;
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

    getEmail() {
        return this.#email;
    }

    setUsername(newUsername) {
        TypeChecker.isString(newUsername);
        this.#username = username;
    }

    setTitle(newTitle) {
        TypeChecker.isString(newTitle);
        this.#title = title;
    }

    setSurname(newSurname) { 
        TypeChecker.isString(newSurname);
        this.#surname = surname;
    }

    setForename(newForename) {
        TypeChecker.isString(newForename);
        this.#forename = forename;
    }

    setEmail(newEmail) {
        TypeChecker.isString(newEmail);
        this.#email = email;
    }
}