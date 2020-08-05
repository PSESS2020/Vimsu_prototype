const LectureChat = require('../../../game/app/server/models/LectureChat.js');
const chai = require('chai');
const { expect } = require('chai');
const Lecture = require('../../../game/app/server/models/Lecture.js');
const Participant = require('../../../game/app/server/models/Participant.js');
const assert = chai.assert;

//example lecture
var id = '1a2b';
var title = 'Lineare Alegbra 3';
var videoId = 'f2c3';
var duration = 300000;
var remarks = 'linear algebra';
var startingTime = new Date();
var oratorName = 'Max Mustermann';
var lectureChat = new LectureChat(id);
var maxParticipants = 3;
var participantId1 = '1';
var participantId2 = '2';
var tokenList = [['1', undefined, 300000]];

lecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, maxParticipants);


describe('Lecture getter functions', function() {
    it('test getLectureChat', function() {
        expect(lecture.getLectureChat()).to.eql(lectureChat);
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