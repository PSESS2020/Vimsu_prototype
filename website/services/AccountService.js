var TypeChecker = require('../../game/app/utils/TypeChecker')
const dbconf = require('../../config/dbconf');
const server = require('../../server')
var vimsudb;
async function getDB() {
    return server.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    })
    .catch(err => {
        console.error(err)
    });
}

const ObjectID = require('mongodb').ObjectID;
const passwordHash = require('password-hash');

module.exports = class AccountService {

    static createAccount(accountId, username, title, surname, forename, email, passwordHash) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(email);
        TypeChecker.isString(passwordHash);

        /*var accountId = new ObjectID();

        var acc = {
            accountId: accountId,
            username: "test123", 
            title: "",
            surname: "123",
            forename: "test",
            email: "test123@test.com",
            passwordHash: passwordHash.generate("test123")
        }*/

        setTimeout(() => {
            vimsudb.insertOneToCollection("accounts", acc);
        }, 1000);
        
    }

    static getAccountID(username) {
        TypeChecker.isString(username);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {username: username}).then(user => 
                {
                    console.log(user.accountId);
                    return user.accountId;
                })
        });
    }

    static getAccountUsername(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
                {
                    console.log(user.username);
                    return user.username;
                });
        }, 1000);
    }

    static getAccountTitle(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
                {
                    console.log(user.title);
                    return user.title;
                });
        }, 1000);
    }

    static getAccountSurname(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
                {
                    console.log(user.surname);
                    return user.surname
                });
        }, 1000);
    }

    static getAccountForename(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
                {
                    console.log(user.forename);
                    return user.forename
                });
        }, 1000);
    }

    static getAccountEmail(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
                {
                    console.log(user.email);
                    return user.email
                });
        }, 1000);
    }

    static updateUsername(accountId, newUsername) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);

        setTimeout(() => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {username: newUsername});
        }, 1000);
    }

    static updateTitle(accountId, newTitle) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);

        setTimeout(() => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {title: newTitle});
        }, 1000);
    }

    static updateSurname(accountId, newSurname) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newSurname);

        setTimeout(() => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {surname: newSurname});
        }, 1000);
    }

    static updateForename(accountId, newForename) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newForename);

        setTimeout(() => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {forename: newForename});
        }, 1000);
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        setTimeout(() => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {email: newEmail});
        }, 1000);
    }

    static deleteAccount(accountId) {
        TypeChecker.isString(accountId);

        setTimeout(() => {
            vimsudb.deleteOneFromCollection("accounts", {accountId: accountId});
        }, 1000);
    }

    static verifyLoginData(username, passwordHash) {
        TypeChecker.isString(username);
        TypeChecker.isString(passwordHash);

        setTimeout(() => {
            vimsudb.findOneInCollection("accounts", {username: username}).then(user => 
                {
                    if (user && user.passwordHash === passwordHash){
                        console.log("User and password match")
                        return true;
                    } else {
                        console.log("Credentials wrong");
                        return false;
                    }            
                });
        }, 1000);       
    }
} 