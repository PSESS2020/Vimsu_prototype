const Account = require('../../../src/website/models/Account')
const expect = require('chai').expect;

var accountID = "53f";
var username = "maxmust";
var forename = "Max";
var account = new Account(accountID, username, forename);


describe("Account Test getter", function () {
    it("Test getAccountID", function () {
        expect(account.getAccountID()).to.be.a('string').and.equal(accountID);
    })

    it("Test getUsername", function () {
        expect(account.getUsername()).to.be.a('string').and.equal(username);
    })

    it("Test getForename", function () {
        expect(account.getForename()).to.be.a('string').and.equal(forename);
    })
})