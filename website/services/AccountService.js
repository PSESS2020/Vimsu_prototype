const TypeChecker = require('../../game/app/client/shared/TypeChecker.js');
const Account = require('../models/Account')
const ObjectId = require('mongodb').ObjectID;
const passwordHash = require('password-hash');

module.exports = class AccountService {

    static isUsernameValid(username, vimsudb) {
        TypeChecker.isString(username);

        return vimsudb.findInCollection("accounts", { username: username }, { username: username }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })

    }

    static isEmailValid(email, vimsudb) {
        TypeChecker.isString(email);


        return vimsudb.findInCollection("accounts", { email: email }, { email: email }).then(results => {
            if (results.length > 0) {
                return false;
            }
            else {
                return true;
            }
        })

    }

    static createAccount(username, title, surname, forename, job, company, email, password, vimsudb) {

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

    static getAccountById(accountId, vimsudb) {
        TypeChecker.isString(accountId);


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

    static getAccountByUsername(username, vimsudb) {
        TypeChecker.isString(username);


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

    static getAccountID(username, vimsudb) {
        TypeChecker.isString(username);


        return vimsudb.findOneInCollection("accounts", { username: username }, { accountId: 1 }).then(user => {

            if (user) {
                return user.accountId;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }

    static getAccountUsername(accountId, vimsudb) {
        TypeChecker.isString(accountId);


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

    static getAccountName(accountId, vimsudb) {
        TypeChecker.isString(accountId);


        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { title: 1, surname: 1, forename: 1 }).then(user => {

            if (user) {
                var name = user.title + " " + user.forename + " " + user.surname;
                return name;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }

    static getAccountTitle(accountId, vimsudb) {
        TypeChecker.isString(accountId);


        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { title: 1 }).then(user => {

            if (user) {
                return user.title;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err);
        })

    }

    static getAccountSurname(accountId, vimsudb) {
        TypeChecker.isString(accountId);


        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { surname: 1 }).then(user => {

            if (user) {
                return user.surname;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err)
        });

    }

    static getAccountForename(accountId, vimsudb) {
        TypeChecker.isString(accountId);


        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { forename: 1 }).then(user => {

            if (user) {
                return user.forename;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err)
        })

    }

    static getAccountEmail(accountId, vimsudb) {
        TypeChecker.isString(accountId);


        return vimsudb.findOneInCollection("accounts", { accountId: accountId }, { email: 1 }).then(user => {

            if (user) {
                return user.email;
            }
            else {
                return false;
            }
        }).catch(err => {
            console.error(err)
        });

    }

    static updateAccountData(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email, vimsudb) {
        var account = new Account(accountId, username, newTitle, newSurname, newForename, newJob, newCompany, email)

        return vimsudb.updateOneToCollection("accounts", { accountId: accountId }, { title: newTitle, surname: newSurname, forename: newForename, job: newJob, company: newCompany }).then(res => {

            return account;
        }).catch(err => {
            console.error(err)
        });


    }

    static updateUsername(accountId, newUsername, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newUsername);


        return this.isUsernameValid(newUsername).then(res => {
            if (res) {
                return vimsudb.updateOneToCollection("accounts", { accountId: accountId }, { username: newUsername })
                .catch(err => {
                    console.error(err)
                });

            }
            else {
                return false;
            }
        })
    }

    static updateEmail(accountId, newEmail, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newEmail);

        return this.isEmailValid(newEmail).then(res => {
            if (res) {

                return vimsudb.updateOneToCollection("accounts", { accountId: accountId }, { email: newEmail })
                .catch(err => {
                    console.error(err)
                });

            }
            else {
                return false;
            }
        })
    }

    static updatePassword(accountId, newPassword, vimsudb) {
        TypeChecker.isString(accountId);
        TypeChecker.isString(newPassword);
        var newPasswordHash = passwordHash.generate(newPassword);

        return vimsudb.updateOneToCollection("accounts", { accountId: accountId }, { passwordHash: newPasswordHash })
        .catch(err => {
            console.error(err)
        });

    }

    static deleteAccount(accountId, vimsudb) {
        TypeChecker.isString(accountId);

        return vimsudb.deleteOneFromCollection("accounts", { accountId: accountId }).then(res => {
            console.log("account with " + accountId + " is deleted")
        }).catch(err => {
            console.error(err)
        });


    }

    static verifyLoginData(username, password, vimsudb) {
        TypeChecker.isString(username);
        TypeChecker.isString(password);

        return this.getAccountByUsername(username, vimsudb).then(user => {
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