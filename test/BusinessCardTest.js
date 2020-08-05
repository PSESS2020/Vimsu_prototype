const BusinessCard = require('../game/app/server/models/BusinessCard');
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


describe("Test getter", function() {
    it("Test getParticipantId", function() {
        expect(businessCard.getParticipantId()).to.be.a('string').and.equal(participantId);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getParticipantId()).to.throw(TypeError);
    })

    it("Test getUsername", function() {
        expect(businessCard.getUsername()).to.be.a('string').and.equal(username);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getUsername()).to.throw(TypeError);
    })

    it("Test getTitle", function() {
        expect(businessCard.getTitle()).to.be.a('string').and.equal(title);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getTitle()).to.throw(TypeError);
    })

    it("Test getSurname", function() {
        expect(businessCard.getSurname()).to.be.a('string').and.equal(surname);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getSurname()).to.throw(TypeError);
    })

    it("Test getForename", function() {
        expect(businessCard.getForename()).to.be.a('string').and.equal(forename);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getForename()).to.throw(TypeError);
    })

    it("Test getJob", function() {
        expect(businessCard.getJob()).to.be.a('string').and.equal(job);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getJob()).to.throw(TypeError);
    })

    it("Test getCompany", function() {
        expect(businessCard.getCompany()).to.be.a('string').and.equal(company);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getCompany()).to.throw(TypeError);
    })

    it("Test getEmail", function() {
        expect(businessCard.getEmail()).to.be.a('string').and.equal(email);
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getEmail()).to.throw(TypeError);
    })
})
