const BusinessCard = require('../game/app/server/models/BusinessCard');
const expect = require('chai').expect;

var businessCard = new BusinessCard("53f", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");

describe("Test getter", function() {
    it("Test getParticipantId", function() {
        expect(businessCard.getParticipantId()).to.be.a('string').and.equal("53f");
    })

    it("Test getUsername", function() {
        expect(businessCard.getUsername()).to.be.a('string').and.equal("maxmust");
    })

    it("Test getTitle", function() {
        expect(businessCard.getTitle()).to.be.a('string').and.equal('Prof.');
    })

    it("Test getSurname", function() {
        expect(businessCard.getSurname()).to.be.a('string').and.equal('Mustermann');
    })

    it("Test getForename", function() {
        expect(businessCard.getForename()).to.be.a('string').and.equal('Max');
    })

    it("Test getJob", function() {
        expect(businessCard.getJob()).to.be.a('string').and.equal('Professor');
    })

    it("Test getCompany", function() {
        expect(businessCard.getCompany()).to.be.a('string').and.equal('KIT');
    })

    it("Test getEmail", function() {
        expect(businessCard.getEmail()).to.be.a('string').and.equal('maxmustermann@kit.edu');
    })
})
