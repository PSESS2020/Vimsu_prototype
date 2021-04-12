const AccountService = require('../../../src/website/services/AccountService');
const Account = require('../../../src/website/models/Account');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var suffix = "_test"

var account1 = {
    username: "maxmust",
    forename: "Max",
    password: "maxpassword"
}

var newForename = "Hans";
var newPassword = "newpassword";

var account;

const db = require('../../../src/config/db');
const database = new db();
database.connectDB().then(res => {

    const newAccount1 = async () => {
        return AccountService.createAccount(account1.username, account1.forename, account1.password, suffix, database).then(acc => {
                account = acc;
            }).catch(err => {
                console.error(err);
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
        return AccountService.updateAccountData(account.getAccountID(), account1.username, newForename, suffix, database).then(acc => {
            return acc;
        })
    }

    const changePassword = async () => {
        return AccountService.changePassword(account1.username, account1.password, newPassword, suffix, database).then(res => {
            return res;
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

    describe('AccountService methods', function () {
        var globalResults;

        before(async () => {
            var newAccount1_result = await newAccount1();

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

            var newAccountResult = [newAccount1_result];

            var allResults = [verifyLoginDataValid_result, verifyLoginDataPasswordInvalid_result, verifyLoginDataUsernameInvalid_result,
                getAccountById_result, getAccountByIdNotFound_result, getAccountUsername_result, 
                getAccountUsernameNotFound_result, updateAccountData_result, changePassword_result, 
                verifyLoginDataNewPassword_result, verifyLoginDataOldPassword_result];

            Promise.all(newAccountResult).then(() => {
                Promise.all(allResults).then(() => {
                    globalResults = allResults;
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
            expect(globalResults[7].getForename()).to.eql(newForename);
        });
        
        it('test update password', function () {
            expect(globalResults[8]).to.be.true;
            expect(globalResults[9]).to.be.instanceOf(Account);
            expect(globalResults[10]).to.be.false;
        });

        after(async () => {
            AccountService.deleteAccount(account.getAccountID(), suffix, database);
        })
    });
})


