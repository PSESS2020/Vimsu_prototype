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

    static isUsernameValid(username) {
        TypeChecker.isString(username);

        return getDB().then(res => {
            return vimsudb.findInCollection("accounts", {username: username}, {username: username}).then(results => {
                if(results.length > 0) {
                    console.log("username is taken")
                    return false;
                }
                else {
                    return true;
                }
            })
        })
    }

    static isEmailValid(email) {
        TypeChecker.isString(email);

        return getDB().then(res => {
            return vimsudb.findInCollection("accounts", {email: email}, {email: email}).then(results => {
                if(results.length > 0) {
                    console.log("this email is registered")
                    return false;
                }
                else {
                    return true;
                }
            })
        })
    }
    
    static createAccount(username, title, surname, forename, job, company, email, password) {
        
        return getDB().then(res => {
    
            var accountId = new ObjectId().toString();
            var account = new Account(accountId, username, title, surname, forename, job, company, email);
                
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

            return vimsudb.insertOneToCollection("accounts", acc).then(res => {
                console.log("user saved")
                return account;
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountById(accountId) {
        TypeChecker.isString(accountId);
        
        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, "").then(user => {
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
        }).catch(err => {
            console.error(err);
        })
    }

    static getAccountByUsername(username) {
        TypeChecker.isString(username);
        
        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {username: username}, "").then(user => {
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
        }).catch(err => {
            console.error(err);
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
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountUsername(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {username: 1}).then(user => 
            {
                if (user) {
                    console.log(user.username);
                    return user.username;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountName(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {title: 1, surname: 1, forename:1}).then(user => 
            {
                if (user) {
                    var name = user.title + " " + user.forename + " " + user.surname;
                    console.log(name);
                    return name;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountTitle(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {title: 1}).then(user => 
            {
                if (user) {
                    console.log(user.title);
                    return user.title;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static getAccountSurname(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {surname: 1}).then(user => 
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
        }).catch(err => {
            console.error(err);
        })
    }

    static getAccountForename(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {forename: 1}).then(user => 
            {
                if (user) {
                    console.log(user.forename);
                    return user.forename;
                }
                else {
                    console.log("user not found");
                    return false;
                }
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err);
        })
    }

    static getAccountEmail(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.findOneInCollection("accounts", {accountId: accountId}, {email: 1}).then(user => 
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
        }).catch(err => {
            console.error(err)
        })
    }

    static updateAccountData(accountId, newTitle, newSurname, newForename, newJob, newCompany, newPassword) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newTitle);
        TypeChecker.isString(newSurname);
        TypeChecker.isString(newForename);
        TypeChecker.isString(newJob);
        TypeChecker.isString(newCompany);
        TypeChecker.isString(newPassword);

        var newPasswordHash = passwordHash.generate(newPassword)

        return getDB().then(res => {
            vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {title: newTitle, surname: newSurname, forename: newForename, job: newJob, company: newCompany, passwordHash: newPasswordHash});
        }).catch(err => {
            console.error(err)
        });

    }

    static updateUsername(accountId, newUsername) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);

        return getDB().then(res => {
            return this.isUsernameValid(newUsername).then(res => {
                if(res)
                    return vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {username: newUsername});
                else
                    return false;
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static updateEmail(accountId, newEmail) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        return getDB().then(res => {
            return this.isEmailValid(newEmail).then(res => {
                if(res)
                    return vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {email: newEmail});
                else
                    return false;
            })
        }).catch(err => {
            console.error(err)
        });
    }

    static updatePassword(accountId, newPassword) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newPassword);
        var newPasswordHash = passwordHash.generate(newPassword);

        return getDB().then(res => {
            return vimsudb.updateOneToCollection("accounts", {accountId: accountId}, {passwordHash: newPasswordHash});
        }).catch(err => {
            console.error(err)
        });
    }

    static deleteAccount(accountId) {
        TypeChecker.isString(accountId);

        return getDB().then(res => {
            return vimsudb.deleteOneFromCollection("accounts", {accountId: accountId});
        }).catch(err => {
            console.error(err)
        });
    }

    static verifyLoginData(username, password) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);

        return getDB().then(res => {
            return this.getAccountByUsername(username).then(user => 
            {
                if (user && passwordHash.verify(password, user.passwordHash)){
                    console.log("User and password match")
                    var account = new Account(user.accountId, user.username, user.title, user.surname, user.forename, user.job, user.company, user.email);
                    return account;
                } else {
                    console.log("Credentials wrong");
                    return false;
                }            
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        }); 
    }
} 