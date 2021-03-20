const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Account = require('../models/Account')
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');
const db = require('../../config/db');

/**
 * The Account Service
 * @module AccountService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AccountService {

    /**
     * checks if username is valid
     * @static @method module:AccountService#isUsernameValid
     * 
     * @param {String} username username
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if valid, i.e. there's no user with this username found in the database, otherwise false
     */
    static isUsernameValid(username, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db)

        return vimsudb.findInCollection("accounts" + suffix, { username: username }, { username: username }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })
    }

    /**
     * checks if email is valid
     * @static @method module:AccountService#isEmailValid
     * 
     * @param {String} email email
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {boolean} true if valid, i.e. there's no user with this email found in the database, otherwise false
     */
    static isEmailValid(email, suffix, vimsudb) {
        TypeChecker.isString(email);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db)

        return vimsudb.findInCollection("accounts" + suffix, { email: email }, { email: email }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })
    }

    /**
     * creates a user account and saves it in the database.
     * @static @method module:AccountService#createAccount
     * 
     * @param {String} username account username
     * @param {String} title user's title
     * @param {String} surname user's surname
     * @param {String} forename user's forename
     * @param {String} job user's job
     * @param {String} company user's company
     * @param {String} email user's email
     * @param {String} password user's password
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account} Account instance
     */
    static createAccount(username, title, surname, forename, job, company, email, password, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);
        TypeChecker.isString(password);
        TypeChecker.isString(suffix);
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

        return vimsudb.insertOneToCollection("accounts" + suffix, acc).then(res => {
            return account;
        }).catch(err => {
            console.error(err);
        })

    }

    /**
     * gets account by accountID from the database
     * @static @method module:AccountService#getAccountById
     * 
     * @param {String} accountId account ID
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Object|boolean} user data if found, otherwise false
     */
    static getAccountById(accountId, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts" + suffix, { accountId: accountId }, "").then(user => {
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
     * @private gets account by account username from the database
     * @method module:AccountService#getAccountByUsername
     * 
     * @param {String} username account username
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Object|boolean} user data if found, otherwise false
     */
    static #getAccountByUsername = function (username, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts" + suffix, { username: username }, "").then(user => {
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
     * gets account username
     * @static @method module:AccountService#getAccountUsername
     * 
     * @param {String} accountId account ID
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {String} username
     */
    static getAccountUsername(accountId, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts" + suffix, { accountId: accountId }, { username: 1 }).then(user => {
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
     * updates account data in the database
     * @static @method module:AccountService#updateAccountData
     * 
     * @param {String} accountId account ID
     * @param {String} username account username
     * @param {String} newTitle new user title
     * @param {String} newSurname new user surname
     * @param {String} newForename new user forename
     * @param {String} newJob new user job
     * @param {String} newCompany new user company
     * @param {String} email user email
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account} Account instance
     */
    static updateAccountData(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(username);
        TypeChecker.isString(newTitle);
        TypeChecker.isString(newSurname);
        TypeChecker.isString(newForename);
        TypeChecker.isString(newJob);
        TypeChecker.isString(newCompany);
        TypeChecker.isString(email);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        var account = new Account(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email)

        return vimsudb.updateOneToCollection("accounts" + suffix, { accountId: accountId }, { title: newTitle, surname: newSurname, forename: newForename, job: newJob, company: newCompany }).then(res => {
            return account;
        }).catch(err => {
            console.error(err)
        });
    }

    /**
     * checks if username and password in the database matches
     * @static @method module:AccountService#verifyLoginData
     * 
     * @param {String} username account username
     * @param {String} password user's password
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account|boolean} Account instance if matches, otherwise false
     */
    static verifyLoginData(username, password, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getAccountByUsername(username, suffix, vimsudb).then(user => {
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

    /**
     * Deletes an account from the database
     * @static @method module:AccountService#deleteAccount
     * 
     * @param {String} accountId account ID
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     */
    static deleteAccount(accountId, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("accounts" + suffix, { accountId: accountId }).then(res => {
            console.log("account with accountId " + accountId + " deleted");
            return res;
        }).catch(err => {
            console.error(err);
        })

    }
}