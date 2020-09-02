const Account = require('../../../src/website/models/Account')
const expect = require('chai').expect;

var accountID = "53f";
var username = "maxmust";
var title = "Prof.";
var surname = "Mustermann";
var forename = "Max";
var job = "Professor";
var company = "KIT";
var email = "maxmustermann@kit.edu";
var account = new Account(accountID, username, title, surname, forename, job, company, email);


describe("Account Test getter", function () {
    it("Test getAccountID", function () {
        expect(account.getAccountID()).to.be.a('string').and.equal(accountID);
    })

    it("Test getUsername", function () {
        expect(account.getUsername()).to.be.a('string').and.equal(username);
    })

    it("Test getTitle", function () {
        expect(account.getTitle()).to.be.a('string').and.equal(title);
    })

    it("Test getSurname", function () {
        expect(account.getSurname()).to.be.a('string').and.equal(surname);
    })

    it("Test getForename", function () {
        expect(account.getForename()).to.be.a('string').and.equal(forename);
    })

    it("Test getJob", function () {
        expect(account.getJob()).to.be.a('string').and.equal(job);
    })

    it("Test getCompany", function () {
        expect(account.getCompany()).to.be.a('string').and.equal(company);
    })

    it("Test getEmail", function () {
        expect(account.getEmail()).to.be.a('string').and.equal(email);
    })
})
