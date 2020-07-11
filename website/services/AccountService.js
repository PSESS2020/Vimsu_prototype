const TypeChecker = require('../../game/app/utils/TypeChecker')
const Account = require('../models/Account')
const dbconf = require('../../config/dbconf');
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');

var vimsudb;
async function getDB() {
    return dbconf.setDB().then(res => {
        vimsudb = dbconf.getDB()
        console.log("get DB success")
    }).catch(err => {
        console.error(err)
    });
}

module.exports = class AccountService {

    static createAccount(username, title, surname, forename, email, password) {
        
        return getDB().then(res => {
            return vimsudb.findInCollection("accounts", {username: username}, {username: username}).then(results => {
                if(results.length > 0) {
                    console.log("username is taken")
                    return false;
                }
                else {
                    var accountId = new ObjectId();
                    var account = new Account(username, title, surname, forename, email);
                    account.setAccountID(accountId.toString());
                
                    var acc = {
                        accountId: accountId,
                        username: username, 
                        title: title,
                        surname: surname,
                        forename: forename,
                        email: email,
                        passwordHash: passwordHash.generate(password)
                    }

                    getDB().then(res => {
                        vimsudb.insertOneToCollection("accounts", acc);
                    }).catch(err => {
                        console.error(err)
                    });
                    
                    return account;
                }
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountID(username) {
        TypeChecker.isString(username);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {username: username}, {accountId: 1}).then(user => 
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
            vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {username: 1}).then(user => 
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
            vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {title: 1}).then(user => 
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
            vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {surname: 1}).then(user => 
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
            vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {forename: 1}).then(user => 
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
            vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {email: 1}).then(user => 
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
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {username: newUsername});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateTitle(accountId, newTitle) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {title: newTitle});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateSurname(accountId, newSurname) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newSurname);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {surname: newSurname});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateForename(accountId, newForename) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newForename);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {forename: newForename});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {email: newEmail});
        }).catch(err => {
            console.error(err)
        });
    }

    static deleteAccount(accountId) {
        TypeChecker.isString(accountId);

        getDB().then(res => {
            vimsudb.deleteOneFromCollection("accounts", {accountId: new ObjectId(accountId)});
        }).catch(err => {
            console.error(err)
        });
    }

    static verifyLoginData(username, password) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);

        getDB().then(res => {
            vimsudb.findOneInCollection("accounts", {username: username}, {username: 1, passwordHash: 1}).then(user => 
            {
                if (user && passwordHash.verify(password, user.passwordHash)){
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