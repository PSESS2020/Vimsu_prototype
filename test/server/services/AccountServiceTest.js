const AccountService = require('../../../src/website/services/AccountService');
const Account = require('../../../src/website/models/Account');
const TypeOfRole = require('../../../src/website/utils/TypeOfRole')
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var suffix = "_test"

var account1 = {
    username: "maxmust",
    title: "Prof.",
    surname: "Mustermann",
    forename: "Max",
    job: "Professor",
    company: "KIT",
    email: "maxmustermann@kit.edu",
    password: "maxpassword",
    role: TypeOfRole.PARTICIPANT,
}

var account;
var newCompany = "TUM";
var newPassword = "newpassword";
var newNewPassword = "newNewPassword";

var verificationToken;

const db = require('../../../src/config/db');
const database = new db();
database.connectDB().then(res => {

    const newAccount1 = async () => {
        return AccountService.createAccount(account1.username, account1.title, account1.surname,
            account1.forename, account1.job, account1.company, account1.email, account1.password, account1.role, suffix, database).then(res => {
                if (res.token) {
                    verificationToken = res.token;
                }
            }).catch(err => {
                console.error(err);
            })
    }

    const getAccount1 = async () => {
        return AccountService.getAccountByVerificationToken(verificationToken, suffix, database).then(user => {
            account = new Account(user.accountId, user.username, user.title, user.surname, user.forename, user.job, user.company, user.email, user.role, user.verificationToken, user.forgotPasswordToken, user.isActive);
        })
    }

    const verifyLoginDataValid = async () => {
        return AccountService.verifyLoginData(account1.username, account1.password, suffix, database).then(acc => {
            return acc;
        })
    }

    const verifyLoginDataPasswordInvalid = async () => {
        return AccountService.verifyLoginData(account1.username, "maxinvalidpassword", suffix, database).then(res => {
            return res;
        })
    }

    const verifyLoginDataUsernameInvalid = async () => {
        return AccountService.verifyLoginData("usernameinvalid", account1.password, suffix, database).then(res => {
            return res;
        })
    }

    const getAccountById = async () => {
        return AccountService.getAccountById(account.getAccountID(), suffix, database).then(acc => {
            return acc;
        })
    }

    const getAccountByIdNotFound = async () => {
        return AccountService.getAccountById("1", suffix, database).then(res => {
            return res;
        })
    }

    const getAccountUsername = async () => {
        return AccountService.getAccountUsername(account.getAccountID(), suffix, database).then(username => {
            return username;
        })
    }

    const getAccountUsernameNotFound = async () => {
        return AccountService.getAccountUsername("maxmustinvalid", suffix, database).then(username => {
            return username;
        })
    }

    const updateAccountData = async () => {
        return AccountService.updateAccountData(account.getAccountID(), account1.username, account1.title, account1.surname,
            account1.forename, account1.job, newCompany, account1.email, suffix, database).then(acc => {
                return acc;
            })
    }

    const changePassword = async () => {
        return AccountService.changePassword(account1.username, account1.password, newPassword, suffix, database).then(res => {
            return res;
        })
    }

    const verifyLoginDataNewNewPassword = async () => {
        return AccountService.verifyLoginData(account1.username, newNewPassword, suffix, database).then(acc => {
            return acc;
        })
    }

    const verifyLoginDataNewPassword = async () => {
        return AccountService.verifyLoginData(account1.username, newPassword, suffix, database).then(acc => {
            return acc;
        })
    }

    const verifyLoginDataOldPassword = async () => {
        return AccountService.verifyLoginData(account1.username, account1.password, suffix, database).then(res => {
            return res;
        })
    }

    const activateAccount = async () => {
        return AccountService.activateAccount(account.getAccountID(), verificationToken, suffix, database).then(res => {
            return res;
        })
    }

    const resetPassword = async () => {
        return AccountService.generateForgotPasswordToken(account.getEmail(), suffix, database).then(res => {
            return AccountService.resetPassword(res.token, newNewPassword, suffix, database).then(res => {
                return res;
            })
        })
    }

    describe('AccountService methods', function () {
        var globalResults;

        before(async () => {
            var newAccount1_result = await newAccount1();

            var getAccount1_result = await getAccount1();

            var verifyLoginDataValid_result = await verifyLoginDataValid();
            var verifyLoginDataPasswordInvalid_result = await verifyLoginDataPasswordInvalid();
            var verifyLoginDataUsernameInvalid_result = await verifyLoginDataUsernameInvalid();

            var getAccountById_result = await getAccountById();
            var getAccountByIdNotFound_result = await getAccountByIdNotFound();

            var getAccountUsername_result = await getAccountUsername();
            var getAccountUsernameNotFound_result = await getAccountUsernameNotFound();

            var updateAccountData_result = await updateAccountData();

            var changePassword_result = await changePassword();
            var verifyLoginDataNewPassword_result = await verifyLoginDataNewPassword();
            var verifyLoginDataOldPassword_result = await verifyLoginDataOldPassword();

            var activateAccount_result = await activateAccount();

            var resetPassword_result = await resetPassword();
            var verifyLoginDataNewNewPassword_result = await verifyLoginDataNewNewPassword();
            var verifyLoginDataOldNewPassword_result = await verifyLoginDataNewPassword();

            var newAccountResult = [newAccount1_result];

            var getAccountResult = [getAccount1_result];

            var allResults = [verifyLoginDataValid_result, verifyLoginDataPasswordInvalid_result, verifyLoginDataUsernameInvalid_result,
                getAccountById_result, getAccountByIdNotFound_result, getAccountUsername_result, getAccountUsernameNotFound_result, updateAccountData_result,
                changePassword_result, verifyLoginDataNewPassword_result, verifyLoginDataOldPassword_result, activateAccount_result, resetPassword_result, verifyLoginDataNewNewPassword_result, verifyLoginDataOldNewPassword_result];

            Promise.all(newAccountResult).then(() => {
                Promise.all(getAccountResult).then(() => {
                    Promise.all(allResults).then(() => {
                        globalResults = allResults;
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        })

        it('test verify login data', function () {
            expect(globalResults[0]).to.eql(account);
            expect(globalResults[1]).to.eql(false);
            expect(globalResults[2]).to.eql(false);
        });

        it('test get account by id', function () {
            expect(globalResults[3].accountId).to.eql(account.getAccountID());
            expect(globalResults[4]).to.eql(false);
        })

        it('test get account username', function () {
            expect(globalResults[5]).to.eql(account.getUsername());
            expect(globalResults[6]).to.eql(false);
        })

        it('test update account data', function () {
            expect(globalResults[7].getCompany()).to.eql(newCompany);
        });

        it('test update password', function () {
            expect(globalResults[8]).to.be.true;
            expect(globalResults[9]).to.be.instanceOf(Account);
            expect(globalResults[10]).to.be.false;
        });

        it('test activate account', function () {
            expect(globalResults[11]).to.be.true;
        })

        it('test reset password', function () {
            expect(globalResults[12].success).to.be.true;
            expect(globalResults[13]).to.be.instanceOf(Account);
            expect(globalResults[14]).to.be.false;
        })

        after(async () => {
            AccountService.deleteAccount(account.getAccountID(), suffix, database);
        })
    });
})


