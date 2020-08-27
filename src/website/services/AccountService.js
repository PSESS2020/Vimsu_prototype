const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Account = require('../models/Account')
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');
const db = require('../../config/db');

/**
 * The Account Service
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AccountService {

    /**
     * @static checks if username is valid
     * 
     * @param {String} username username
     * @param {db} vimsudb db instance
     * 
     * @return true if valid, i.e. there's no user with this username found in the database, otherwise false
     */
    static isUsernameValid(username, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isInstanceOf(vimsudb, db)

        return vimsudb.findInCollection("accounts", { username: username }, { username: username }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })
    }

    /**
     * @static checks if email is valid
     * 
     * @param {String} email email
     * @param {db} vimsudb db instance
     * 
     * @return true if valid, i.e. there's no user with this email found in the database, otherwise false
     */
    static isEmailValid(email, vimsudb) {
        TypeChecker.isString(email);
        TypeChecker.isInstanceOf(vimsudb, db)

        return vimsudb.findInCollection("accounts", { email: email }, { email: email }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })
    }

    /**
     * @static creates a user account and saves it in the database.
     * 
     * @param {String} username account username
     * @param {String} title user's title
     * @param {String} surname user's surname
     * @param {String} forename user's forename
     * @param {String} job user's job
     * @param {String} company user's company
     * @param {String} email user's email
     * @param {String} password user's password
     * @param {db} vimsudb db instance
     * 
     * @return Account instance
     */
    static createAccount(username, title, surname, forename, job, company, email, password, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);
        TypeChecker.isString(password);
        TypeChecker.isInstanceOf(vimsudb, db);

        var accountId = new ObjectId().toString();
        var account = new Account(accountId, username, title, surname, forename, job, company, email);

        var acc = {
            accountId: account.getAccountID(),
            username: account.getUsername(),
            title: account.getTitle(),
            surname: account.getSurname(),
            forename: account.getForename(),
            job: account.getJob(),
            company: account.getCompany(),
            email: account.getEmail(),
            passwordHash: passwordHash.generate(password)
        }

        return vimsudb.insertOneToCollection("accounts", acc).then(res => {
            return account;
        }).catch(err => {
            console.error(err);
        })

    }

    /**
     * @static gets account by accountID from the database
     * 
     * @param {String} accountId account ID
     * @param {db} vimsudb db instance
     * 
     * @return user data if found, otherwise false
     */
    static getAccountById(accountId, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, "").then(user => {
            if (user) {
                return user;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }

    /**
     * @static gets account by account username from the database
     * 
     * @param {String} username account username
     * @param {db} vimsudb db instance
     * 
     * @return user data if found, otherwise false
     */
    static #getAccountByUsername = function (username, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts", { username: username }, "").then(user => {
            if (user) {
                return user;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }

    /**
     * @static gets account username
     * 
     * @param {String} accountId account ID
     * @param {db} vimsudb db instance
     * 
     * @return username
     */
    static getAccountUsername(accountId, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { username: 1 }).then(user => {

            if (user) {
                return user.username;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })
    }

    /**
     * @static updates account data in the database
     * 
     * @param {String} accountId account ID
     * @param {String} username account username
     * @param {String} newTitle new user title
     * @param {String} newSurname new user surname
     * @param {String} newForename new user forename
     * @param {String} newJob new user job
     * @param {String} newCompany new user company
     * @param {String} email user email
     * @param {db} vimsudb db instance
     * 
     * @return Account instance
     */
    static updateAccountData(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(username);
        TypeChecker.isString(newTitle);
        TypeChecker.isString(newSurname);
        TypeChecker.isString(newForename);
        TypeChecker.isString(newJob);
        TypeChecker.isString(newCompany);
        TypeChecker.isString(email);
        TypeChecker.isInstanceOf(vimsudb, db);

        var account = new Account(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email)

        return vimsudb.updateOneToCollection("accounts", { accountId: accountId }, { title: newTitle, surname: newSurname, forename: newForename, job: newJob, company: newCompany }).then(res => {
            return account;
        }).catch(err => {
            console.error(err)
        });
    }

    /**
     * @static checks if username and password in the database matches
     * 
     * @param {String} username account username
     * @param {String} password user's password
     * @param {db} vimsudb db instance
     * 
     * @return Account instance if matches, otherwise false
     */
    static verifyLoginData(username, password, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getAccountByUsername(username, vimsudb).then(user => {
            if (user && passwordHash.verify(password, user.passwordHash)) {
                var account = new Account(user.accountId, user.username, user.title, user.surname, user.forename, user.job, user.company, user.email);
                return account;
            } else {
                return false;
            }
        }).catch(err => {
            console.error(err)
        })
    }
} 