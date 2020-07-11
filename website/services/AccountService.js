var TypeChecker = require('../../game/app/utils/TypeChecker')
const dbconf = require('../../config/dbconf');
var vimsudb;

async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

//const ObjectID = require('mongodb').ObjectID;
//const passwordHash = require('password-hash');

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

        getDB().then(res => {
            vimsudb.insertOneToCollection("accounts", acc);
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountID(username) {
        TypeChecker.isString(username);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {username: username}).then(user => 
            {
                console.log(user.accountId);
                return user.accountId;
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountUsername(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
            {
                console.log(user.username);
                return user.username;
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountTitle(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
            {
                console.log(user.title);
                return user.title;
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountSurname(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
            {
                console.log(user.surname);
                return user.surname
            }).catch(err => {
                console.error(err)
            });
        });
    }

    static getAccountForename(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
            {
                console.log(user.forename);
                return user.forename
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountEmail(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {accountId: accountId}).then(user => 
            {
                console.log(user.email);
                return user.email
            }).catch(err => {
                console.error(err)
            });
        });
    }

    static updateUsername(accountId, newUsername) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {username: newUsername});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateTitle(accountId, newTitle) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {title: newTitle});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateSurname(accountId, newSurname) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newSurname);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {surname: newSurname});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateForename(accountId, newForename) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newForename);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {forename: newForename});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {email: newEmail});
        }).catch(err => {
            console.error(err)
        });
    }

    static deleteAccount(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.deleteOneFromCollection("accounts", {accountId: accountId});
        }).catch(err => {
            console.error(err)
        });
    }

    static verifyLoginData(username, passwordHash) {
        TypeChecker.isString(username);
        TypeChecker.isString(passwordHash);

        getDB().then(res => {
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
        }).catch(err => {
            console.error(err)
        }); 
    }
} 