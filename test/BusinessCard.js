const BusinessCard = require('../game/app/server/models/BusinessCard');
const expect = require('chai').expect;

var businessCard = new BusinessCard("53f", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");

describe("Test getter", function() {
    it("Test getParticipantId", function() {
        expect(businessCard.getParticipantId()).to.be.a('string');
        expect(businessCard.getParticipantId()).to.be.equal("53f");
    })

    it("Test getUsername", function() {
        expect(businessCard.getUsername()).to.be.a('string');
        expect(businessCard.getUsername()).to.be.equal("maxmust");
    })

    it("Test getTitle", function() {
        expect(businessCard.getTitle()).to.be.a('string');
        expect(businessCard.getTitle()).to.be.equal('Prof.');
    })

    it("Test getSurname", function() {
        expect(businessCard.getSurname()).to.be.a('string');
        expect(businessCard.getSurname()).to.be.equal('Mustermann');
    })

    it("Test getForename", function() {
        expect(businessCard.getForename()).to.be.a('string');
        expect(businessCard.getForename()).to.be.equal('Max');
    })

    it("Test getJob", function() {
        expect(businessCard.getJob()).to.be.a('string');
        expect(businessCard.getJob()).to.be.equal('Professor');
    })

    it("Test getCompany", function() {
        expect(businessCard.getCompany()).to.be.a('string');
        expect(businessCard.getCompany()).to.be.equal('KIT');
    })

    it("Test getEmail", function() {
        expect(businessCard.getEmail()).to.be.a('string');
        expect(businessCard.getEmail()).to.be.equal('maxmustermann@kit.edu');
    })
})
