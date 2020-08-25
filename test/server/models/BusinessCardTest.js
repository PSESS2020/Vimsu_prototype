const BusinessCard = require('../../../game/app/server/models/BusinessCard');
const expect = require('chai').expect;

var participantId = "53f";
var username = "maxmust";
var title = "Prof.";
var surname = "Mustermann";
var forename = "Max";
var job = "Professor";
var company = "KIT";
var email = "maxmustermann@kit.edu";
var businessCard = new BusinessCard(participantId, username, title, surname, forename, job, company, email);


describe("BusinessCard Test getter", function() {
    it("Test getParticipantId", function() {
        expect(businessCard.getParticipantId()).to.be.a('string').and.equal(participantId);
    })    

    it("Test getUsername", function() {
        expect(businessCard.getUsername()).to.be.a('string').and.equal(username);
    })

    it("Test getTitle", function() {
        expect(businessCard.getTitle()).to.be.a('string').and.equal(title);
    })

    it("Test getSurname", function() {
        expect(businessCard.getSurname()).to.be.a('string').and.equal(surname);
    })

    it("Test getForename", function() {
        expect(businessCard.getForename()).to.be.a('string').and.equal(forename);
    })

    it("Test getJob", function() {
        expect(businessCard.getJob()).to.be.a('string').and.equal(job);
    })

    it("Test getCompany", function() {
        expect(businessCard.getCompany()).to.be.a('string').and.equal(company);
    })

    it("Test getEmail", function() {
        expect(businessCard.getEmail()).to.be.a('string').and.equal(email);
    })
})
