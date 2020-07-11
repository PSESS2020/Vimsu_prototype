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

    static createAccount(username, title, surname, forename, job, company, email, password) {
        
        return getDB().then(res => {
            return vimsudb.findInCollection("accounts", {username: username}, {username: username}).then(results => {
                if(results.length > 0) {
                    console.log("username is taken")
                    return false;
                }
                else {
                    var accountId = new ObjectId();
                    var account = new Account(username, title, surname, forename, job, company, email);
                    account.setAccountID(accountId.toString());
                
                    var acc = {
                        accountId: accountId,
                        username: username, 
                        title: title,
                        surname: surname,
                        forename: forename,
                        job: job,
                        company: company,
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

    static getAccount(accountId) {
        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, "").then(user => {
                if (user) {
                    return user;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        })
    }

    static getAccountID(username) {
        TypeChecker.isString(username);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {username: username}, {accountId: 1}).then(user => {
                if (user) {
                    console.log(user.accountId);
                    return user.accountId;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountUsername(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {username: 1}).then(user => 
            {
                if (user) {
                    console.log(user.username);
                    return user.username;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountTitle(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {title: 1}).then(user => 
            {
                if (user) {
                    console.log(user.title);
                    return user.title;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountSurname(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {surname: 1}).then(user => 
            {
                if (user) {
                    console.log(user.surname);
                    return user.surname;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err)
            });
        });
    }

    static getAccountForename(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {forename: 1}).then(user => 
            {
                if (user) {
                    console.log(user.forename);
                    return user.forename;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            });
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountEmail(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: new ObjectId(accountId)}, {email: 1}).then(user => 
            {
                if (user) {
                    console.log(user.email);
                    return user.email;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err)
            });
        });
    }

    static updateUsername(accountId, newUsername) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);

        return getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {username: newUsername});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateTitle(accountId, newTitle) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {title: newTitle});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateSurname(accountId, newSurname) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newSurname);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {surname: newSurname});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateForename(accountId, newForename) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newForename);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {forename: newForename});
        }).catch(err => {
            console.error(err)
        });
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {email: newEmail});
        }).catch(err => {
            console.error(err)
        });
    }

    static updatePassword(accountId, newPassword) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newPassword);
        var newPasswordHash = passwordHash.generate(newPassword);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: new ObjectId(accountId)}, {passwordHash: newPasswordHash});
        }).catch(err => {
            console.error(err)
        });
    }

    static deleteAccount(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.deleteOneFromCollection("accounts", {accountId: new ObjectId(accountId)});
        }).catch(err => {
            console.error(err)
        });
    }

    static verifyLoginData(username, password) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {username: username}, {username: 1, passwordHash: 1}).then(user => 
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