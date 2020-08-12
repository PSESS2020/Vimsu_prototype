const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = require('chai');
const Slot = require('../../../website/models/Slot');
const Settings = require('../../../game/app/client/shared/Settings.js');

var id = '1a2b';
var title = 'Lineare Alegbra 3';
var conferenceId = Settings.CONFERENCE_ID;
var videoId = 'f2c3';
var duration = 10.5;
var remarks = 'linear algebra';
var startingTime = new Date();
var oratorId = '53f';
var maxParticipants = 3;

var slot = new Slot(id, title, conferenceId, videoId, duration, remarks, startingTime, oratorId, maxParticipants);

describe('Lecture getter functions', function() {
    it('test getId', function() {
        expect(slot.getId()).to.be.a('string').and.equal(id);
    })

    it('test getTitle', function() {
        expect(slot.getTitle()).to.be.a('string').and.equal(title);
    })

    it('test getConferenceId', function() {
        expect(slot.getConferenceId()).to.be.a('string').and.equal(conferenceId);
    })
    
    it('test getVideoId', function() {
        expect(slot.getVideoId()).to.be.a('string').and.equal(videoId);
    })

    it('test getDuration', function() {
        expect(slot.getDuration()).to.be.a('number').and.equal(duration);
    })

    it('test getRemarks', function() {
        expect(slot.getRemarks()).to.be.a('string').and.equal(remarks);
    })

    it('test getStartingTime', function() {
        expect(slot.getStartingTime()).to.equalDate(startingTime);
    })

    it('test getOratorId', function() {
        expect(slot.getOratorId()).to.be.a('string').and.equal(oratorId);
    })

    it('test getMaxParticipants', function() {
        expect(slot.getMaxParticipants()).to.be.a('number').and.equal(maxParticipants);
    })
})