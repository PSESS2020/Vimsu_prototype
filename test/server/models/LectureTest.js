const LectureChat = require('../../../src/game/app/server/models/LectureChat.js');
const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = require('chai');
const Lecture = require('../../../src/game/app/server/models/Lecture.js');
const Participant = require('../../../src/game/app/server/models/Participant.js');
const assert = chai.assert;

//example lecture
var id = '1a2b';
var title = 'Lineare Alegbra 3';
var videoId = 'f2c3';
var duration = 300000;
var remarks = 'linear algebra';
var startingTime = new Date();
var oratorName = 'Max Mustermann';
var oratorUsername = 'maxmustermann';
var lectureChat = new LectureChat();
var maxParticipants = 3;
var participantId1 = '1';
var participantId2 = '2';
var tokenList = [['1', undefined, 300000]];

var lecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);

describe('Lecture constructor error', function() {
    it('test id error', function() {
        expect(() => new Lecture(1, 2, 3, "4", 5, 6, 7, 8, "9")).to.throw(TypeError, "not a string");
    })

    it('test duration error', function() {
        expect(() => new Lecture("1", "2", "3", "4", 5, 6, 7, 8, "9")).to.throw(TypeError, "not a number");
    })

    it('test startingTime error', function() {
        expect(() => new Lecture("1", "2", "3", 4, "5", 6, 7, 8, "9")).to.throw(TypeError, "not a Date");
    })

    it('test maxParticipants', function() {
        expect(() => new Lecture("1", "2", "3", 4, "5", new Date(), "7", "8", "9")).to.throw(TypeError, "not an int");
    })  
})

describe('Lecture getter functions', function() {
    it('test getLectureChat', function() {
        expect(lecture.getLectureChat()).to.eql(lectureChat);
    })

    it('test getId', function() {
        expect(lecture.getId()).to.be.a('string').and.equal(id);
    })

    it('test getTitle', function() {
        expect(lecture.getTitle()).to.be.a('string').and.equal(title);
    })

    it('test getVideoId', function() {
        expect(lecture.getVideoId()).to.be.a('string').and.equal(videoId);
    })

    it('test getDuration', function() {
        expect(lecture.getDuration()).to.be.a('number').and.equal(duration);
    })

    it('test getRemarks', function() {
        expect(lecture.getRemarks()).to.be.a('string').and.equal(remarks);
    })

    it('test getStartingTime', function() {
        expect(lecture.getStartingTime()).to.equalDate(startingTime);
    })

    it('test getOratorName', function() {
        expect(lecture.getOratorName()).to.be.a('string').and.equal(oratorName);
    })

    it('test getOratorUsername', function() {
        expect(lecture.getOratorUsername()).to.be.a('string').and.equal(oratorUsername);
    })

    it('test getMaxParticipants', function() {
        expect(lecture.getMaxParticipants()).to.be.a('number').and.equal(maxParticipants);
    })
})

describe('Lecture Token handling', function() {
    it('test enterLecture', function() {
        lecture.enter(participantId1);
        assert(lecture.getActiveParticipants().includes(participantId1), true);
        let tokenListFirstElement = lecture.getTokenList()[0];
        assert.equal(tokenListFirstElement[0], participantId1);
        assert.equal(tokenListFirstElement[1], undefined);
        expect(tokenListFirstElement[2]).to.be.below(300000);
    })

    it('test leaveLecture', function() {
        lecture.enter(participantId2);
        lecture.leave(participantId2);
        let tokenListSecondElement = lecture.getTokenList()[1];
        expect(lecture.getActiveParticipants().includes(participantId2)).to.eql(false);
        expect(tokenListSecondElement[1]).to.not.undefined;
    })

    it('test hasToken', function() {
        assert.equal(lecture.hasToken(participantId1), true);
        assert.equal(lecture.hasToken('3'), false);
    })

    it('test enterLectureAgain', function() {
        lecture.enter(participantId2);
        let tokenListSecondElement = lecture.getTokenList()[1];
        expect(tokenListSecondElement[2]).to.be.below(300000);
    })

    it('test enterLecture with max Participants', function() {
        lecture.enter('5');
        lecture.enter('6');
        assert.equal(lecture.enter('4'), false);
    })
})