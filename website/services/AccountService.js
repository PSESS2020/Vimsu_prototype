var TypeChecker = require('../../game/app/utils/TypeChecker')
const dbconf = require('../../server');
const ObjectID = require('mongodb').ObjectID;
const passwordHash = require('password-hash');

module.exports = class AccountService {

    static createAccount() {
        //TypeChecker.isString(accountId);
        /*TypeChecker.isString(username);
        TypeChecker.isString(title);
        TypeChecker.isString(surname);
        TypeChecker.isString(forename);
        TypeChecker.isString(email);
        TypeChecker.isString(passwordHash);*/

        var accountId = new ObjectID();

        var acc = {
            accountId: accountId,
            username: "test123", 
            title: "",
            surname: "123",
            forename: "test",
            email: "test123@test.com",
            passwordHash: passwordHash.generate("test123")
        }

        

        var db;
        db = dbconf.getDB();
        console.log(1)
        console.log(db)
        db.insertOneToCollection("accounts", acc);
    }

    static getAccountID(username) {
        TypeChecker.isString(username);

        var user = vimsudb.findOneInCollection("accounts", {username: username});
        return user.id;
    }

    static getAccountUsername(accountId) {
        TypeChecker.isString(accountId);

        var user = vimsudb.findOneInCollection("accounts", {accountId: accountId});
        return user.username;
    }

    static getAccountTitle(accountId) {
        TypeChecker.isString(accountId);

        var user = vimsudb.findOneInCollection("accounts", {accountId: accountId});
        return user.title;
    }

    static getAccountSurname(accountId) {
        TypeChecker.isString(accountId);

        var user = vimsudb.findOneInCollection("accounts", {accountId: accountId});
        return user.surname;
    }

    static getAccountForename(accountId) {
        TypeChecker.isString(accountId);

        var user = vimsudb.findOneInCollection("accounts", {accountId: accountId});
        return user.forename;
    }

    static getAccountEmail(accountId) {
        TypeChecker.isString(accountId);

        var user = vimsudb.findOneInCollection("accounts", {accountId: accountId});
        return user.email;
    }

    static updateUsername(accountId, newUsername) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);

        vimsudb.updateOneInCollection("accounts", {accountId: accountId}, {username: newUsername});
    }

    static updateTitle(accountId, newTitle) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);

        vimsudb.updateOneInCollection("accounts", {accountId: accountId}, {title: newTitle});
    }

    static updateSurname(accountId, newSurname) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newSurname);

        vimsudb.updateOneInCollection("accounts", {accountId: accountId}, {surname: newSurname});
    }

    static updateForename(accountId, newForename) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newForename);

        vimsudb.updateOneInCollection("accounts", {accountId: accountId}, {forename: newForename});
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        vimsudb.updateOneInCollection("accounts", {accountId: accountId}, {email: newEmail});
    }

    static verifyLoginData(username, passwordHash) {
        TypeChecker.isString(username);
        TypeChecker.isString(passwordHash);

        var user = vimsudb.findOneInCollection("accounts", {username: username});

        if (user && user.passwordHash === passwordHash){
            console.log("User and password match")
            return true;
        } else {
            console.log("Credentials wrong");
            return false;
        }              
    }
} 