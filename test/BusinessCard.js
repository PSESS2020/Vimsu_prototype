const BusinessCard = require('../game/app/server/models/BusinessCard');
const expect = require('chai').expect;

var businessCard = new BusinessCard("53f", "maxmust", "Prof.", "Mustermann", "Max", "Professor", "KIT", "maxmustermann@kit.edu");


describe("Test getter", function() {
    it("Test getParticipantId", function() {
        expect(businessCard.getParticipantId()).to.be.a('string').and.equal("53f");
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getParticipantId()).to.throw(TypeError);
    })

    it("Test getUsername", function() {
        expect(businessCard.getUsername()).to.be.a('string').and.equal("maxmust");
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getUsername()).to.throw(TypeError);
    })

    it("Test getTitle", function() {
        expect(businessCard.getTitle()).to.be.a('string').and.equal('Prof.');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getTitle()).to.throw(TypeError);
    })

    it("Test getSurname", function() {
        expect(businessCard.getSurname()).to.be.a('string').and.equal('Mustermann');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getSurname()).to.throw(TypeError);
    })

    it("Test getForename", function() {
        expect(businessCard.getForename()).to.be.a('string').and.equal('Max');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getForename()).to.throw(TypeError);
    })

    it("Test getJob", function() {
        expect(businessCard.getJob()).to.be.a('string').and.equal('Professor');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getJob()).to.throw(TypeError);
    })

    it("Test getCompany", function() {
        expect(businessCard.getCompany()).to.be.a('string').and.equal('KIT');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getCompany()).to.throw(TypeError);
    })

    it("Test getEmail", function() {
        expect(businessCard.getEmail()).to.be.a('string').and.equal('maxmustermann@kit.edu');
        expect(() => new BusinessCard(1, 2, 3, 4, 5, 6, 7, 8).getEmail()).to.throw(TypeError);
    })
})
