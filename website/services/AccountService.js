const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Account = require('../models/Account')
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');
const db = require('../../config/db');

module.exports = class AccountService {

    /**
     * 
     * @param {String} username 
     * @param {db} vimsudb 
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
     * 
     * @param {String} email 
     * @param {db} vimsudb 
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
     * 
     * @param {String} username 
     * @param {String} title 
     * @param {String} surname 
     * @param {String} forename 
     * @param {String} job 
     * @param {String} company 
     * @param {String} email 
     * @param {String} password 
     * @param {db} vimsudb 
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
     * 
     * @param {String} accountId 
     * @param {db} vimsudb 
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
     * 
     * @param {String} username 
     * @param {db} vimsudb 
     */
    static #getAccountByUsername = function(username, vimsudb) {
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
     * 
     * @param {String} accountId 
     * @param {db} vimsudb 
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
     * 
     * @param {String} accountId
     * @param {String} username 
     * @param {String} newTitle 
     * @param {String} newSurname 
     * @param {String} newForename 
     * @param {String} newJob 
     * @param {String} newCompany 
     * @param {String} email 
     * @param {db} vimsudb 
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
     * 
     * @param {String} username 
     * @param {String} password 
     * @param {db} vimsudb 
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