const BusinessCard = require('../../src/game/app/client/shared/BusinessCard.js');
const expect = require('chai').expect;

var participantId = "53f";
var username = "maxmust";
var forename = "Max";
var businessCard = new BusinessCard(participantId, username, forename);


describe("BusinessCard Test getter", function () {
    it("Test getParticipantId", function () {
        expect(businessCard.getParticipantId()).to.be.a('string').and.equal(participantId);
    })

    it("Test getUsername", function () {
        expect(businessCard.getUsername()).to.be.a('string').and.equal(username);
    })

    it("Test getForename", function () {
        expect(businessCard.getForename()).to.be.a('string').and.equal(forename);
    })
})