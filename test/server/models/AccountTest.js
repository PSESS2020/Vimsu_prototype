const Account = require('../../../src/website/models/Account')
const TypeOfRole = require('../../../src/website/utils/TypeOfRole')
const expect = require('chai').expect;

const accountID = "53f";
const username = "maxmust";
const title = "Prof.";
const surname = "Mustermann";
const forename = "Max";
const job = "Professor";
const company = "KIT";
const email = "maxmustermann@kit.edu";
const role = TypeOfRole.PARTICIPANT;
const verificationToken = "token1";
const forgotPasswordToken = "token2";
const isActive = true;
const account = new Account(accountID, username, title, surname, forename, job, company, email, role, verificationToken, forgotPasswordToken, isActive);


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

    it("Test getRole", function () {
        expect(account.getRole()).to.be.a('string').and.equal(role);
    })
    
    it("Test getVerificationToken", function () {
        expect(account.getVerificationToken()).to.be.a('string').and.equal(verificationToken);
    })
    
    it("Test getForgotPasswordToken", function () {
        expect(account.getForgotPasswordToken()).to.be.a('string').and.equal(forgotPasswordToken);
    })

    it("Test getIsActive", function () {
        expect(account.getIsActive()).to.be.a('boolean').and.equal(isActive);
    })
})
