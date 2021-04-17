const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Account = require('../models/Account')
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');
const db = require('../../config/db');
const crypto = require('crypto');
const TypeOfRole = require('../utils/TypeOfRole')

/**
 * The Account Service
 * @module AccountService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AccountService {

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
     * @param {TypeOfRole} role user's role
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account|boolean} Account instance if successful
     */
    static createAccount(username, title, surname, forename, job, company, email, password, role, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(job);
        TypeChecker.isString(company);
        TypeChecker.isString(email);
        TypeChecker.isString(password);
        TypeChecker.isEnumOf(role, TypeOfRole);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        const accountId = new ObjectId().toString();
        const token = crypto.randomBytes(64).toString('hex');
        const account = new Account(accountId, username, title, surname, forename, job, company, email, role, token, false);

        const acc = {
            accountId: account.getAccountID(),
            username: account.getUsername(),
            title: account.getTitle(),
            surname: account.getSurname(),
            forename: account.getForename(),
            job: account.getJob(),
            company: account.getCompany(),
            email: account.getEmail(),
            passwordHash: passwordHash.generate(password),
            role: account.getRole(),
            token: account.getToken(),
            isActive: account.getIsActive()
        }

        return vimsudb.insertOneToCollection("accounts" + suffix, acc).then(res => {
            if (res.insertedCount > 0) {
                return { token: token };
            } else if (res.code === 11000) {
                //duplicate entry found
                return res.keyValue;
            }

            return false;
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
                
            return false;
        })
    }

    /**
     * @private gets account by account username / email from the database
     * @method module:AccountService#getAccountByUsernameOrEmail
     * 
     * @param {String} usernameOrEmail account username or account email
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Object|boolean} user data if found, otherwise false
     */
    static #getAccountByUsernameOrEmail = function (usernameOrEmail, suffix, vimsudb) {
        TypeChecker.isString(usernameOrEmail);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts" + suffix, { "$or": [{ username: usernameOrEmail }, { email: usernameOrEmail }] }, "").then(user => {
            if (user) {
                return user;
            }
            
            return false;
        })
    }

    /**
     * @private gets account by token from the database
     * @method module:AccountService#getAccountByToken
     * 
     * @param {String} token account token
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Object|boolean} user data if found, otherwise false
     */
    static #getAccountByToken = function (token, suffix, vimsudb) {
        TypeChecker.isString(token);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.findOneInCollection("accounts" + suffix, { token: token }, "").then(user => {
            if (user) {
                return user;
            }

            return false;
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
            
            return false;
        })
    }

    /**
     * updates account data in the database
     * @static @method module:AccountService#updateAccountData
     * 
     * @param {String} accountId account ID
     * @param {String} newUsername new account username
     * @param {String} newTitle new user title
     * @param {String} newSurname new user surname
     * @param {String} newForename new user forename
     * @param {String} newJob new user job
     * @param {String} newCompany new user company
     * @param {String} newEmail new user email
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account|boolean} Account instance if successful
     */
    static updateAccountData(accountId, newUsername, newTitle, newSurname, newForename, newJob, newCompany, newEmail, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);
        TypeChecker.isString(newTitle);
        TypeChecker.isString(newSurname);
        TypeChecker.isString(newForename);
        TypeChecker.isString(newJob);
        TypeChecker.isString(newCompany);
        TypeChecker.isString(newEmail);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.updateOneToCollection("accounts" + suffix, { accountId: accountId }, { username: newUsername, email: newEmail, title: newTitle, surname: newSurname, forename: newForename, job: newJob, company: newCompany }).then(res => {
            if (res.modifiedCount >= 0 && res.matchedCount > 0) {
                return this.getAccountById(accountId, suffix, vimsudb).then(account => {
                    if (account) {
                        return new Account(accountId, newUsername, newTitle, newSurname, newForename, newJob, newCompany, newEmail, account.role, account.token, account.isActive);
                    }

                    return false;
                })
            } else if (res.code === 11000) {
                //duplicate entry found
                return res.keyValue;
            }
            return false;
        })
    }

    /**
     * changes user's password
     * @param {String} username account username
     * @param {String} password user's password
     * @param {String} newPassword user's new password
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * @returns {Account|boolean} Account instance if successful
     */
    static changePassword(username, password, newPassword, suffix, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);
        TypeChecker.isString(newPassword);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.verifyLoginData(username, password, suffix, vimsudb).then(account => {
            if (!account) return null;

            return vimsudb.updateOneToCollection("accounts" + suffix, { username: username }, { passwordHash: passwordHash.generate(newPassword) }).then(res => {
                if (res.modifiedCount >= 0 && res.matchedCount > 0) {
                    return true;
                }
                return false;
            })
        })
    }

    /**
     * Verifies account with token
     * 
     * @param {String} token token
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * @returns true if verified successfully
     */
    static verifyAccount(token, suffix, vimsudb) {
        TypeChecker.isString(token);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getAccountByToken(token, suffix, vimsudb).then(user => {
            if (user && !user.isActive) {
                const newToken = "";
                const isActive = true;

                return vimsudb.updateOneToCollection("accounts" + suffix, { accountId: user.accountId }, { token: newToken, isActive: isActive }).then(res => {
                    if (res.modifiedCount >= 0 && res.matchedCount > 0) {
                        return true;
                    }

                    return false;
                })
            }

            return false;
        })
    }

    /**
     * checks if username and password in the database matches
     * @static @method module:AccountService#verifyLoginData
     * 
     * @param {String} usernameOrEmail account username / email
     * @param {String} password user's password
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * 
     * @return {Account|boolean} Account instance if matches, otherwise false
     */
    static verifyLoginData(usernameOrEmail, password, suffix, vimsudb) {
        TypeChecker.isString(usernameOrEmail);
        TypeChecker.isString(password);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return this.#getAccountByUsernameOrEmail(usernameOrEmail, suffix, vimsudb).then(user => {
            if (user && passwordHash.verify(password, user.passwordHash)) {
                return new Account(user.accountId, user.username, user.title, user.surname, user.forename, user.job, user.company, user.email, user.role, user.token, user.isActive);
            } 
            
            return false;
        })
    }

    /**
     * Deletes an account  from the database
     * @static @method module:AccountService#deleteAccount
     * 
     * @param {String} accountId account ID
     * @param {String} suffix collection name suffix
     * @param {db} vimsudb db instance
     * @return {boolean} true if deleted
     */
    static deleteAccount(accountId, suffix, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(suffix);
        TypeChecker.isInstanceOf(vimsudb, db);

        return vimsudb.deleteOneFromCollection("accounts" + suffix, { accountId: accountId }).then(res => {
            if (res !== true) return false;

            console.log("account with accountId " + accountId + " deleted");
            return true;
        });
    }
}