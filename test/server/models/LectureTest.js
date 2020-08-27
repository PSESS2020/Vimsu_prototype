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
var participantUsername1 = 'User1';
var participantUsername2 = 'User2';
var tokenList = [['1', undefined, 300000]];

var lecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

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
        lecture.enter(participantId1, participantUsername1);
        assert(lecture.getActiveParticipants().includes(participantId1), true);
        let tokenListFirstElement = lecture.getTokenList()[0];
        assert.equal(tokenListFirstElement[0], participantId1);
        assert.equal(tokenListFirstElement[1], undefined);
        expect(tokenListFirstElement[2]).to.be.below(300000);
    })

    it('test leaveLecture', function() {
        lecture.enter(participantId2, participantUsername2);
        lecture.leave(participantId2, participantUsername2);
        let tokenListSecondElement = lecture.getTokenList()[1];
        expect(lecture.getActiveParticipants().includes(participantId2)).to.eql(false);
        expect(tokenListSecondElement[1]).to.not.undefined;

        //un
        lecture.leave("unbekannt", "unwichtig");
    })

    it('test leaveLecture Unknown', function() {
        lecture.leave("unbekannt", "unwichtig"); // should not fail
    })

    it('test hasToken', function() {
        assert.equal(lecture.hasToken(participantId1, participantUsername1), true);
        assert.equal(lecture.hasToken('3', 'random'), false);
    })

    it('test enterLectureAgain', function() {
        lecture.enter(participantId2, participantUsername2);
        let tokenListSecondElement = lecture.getTokenList()[1];
        expect(tokenListSecondElement[2]).to.be.below(300000);
    })

    it('test enterLecture with max Participants', function() {
        lecture.enter('5', 'random');
        lecture.enter('6', 'modnar');
        assert.equal(lecture.enter('4', 'nardom'), false);
    })

    it('test revokeToken', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.enter(participantId1, participantUsername1), true)
        testLecture.revokeToken(participantId1, participantUsername1)
        assert.equal(testLecture.hasToken(participantId1, participantUsername1), false);
    });

    it('test grantToken', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.enter(participantId1, participantUsername1), true)
        testLecture.revokeToken(participantId1, participantUsername1)
        assert.equal(testLecture.hasToken(participantId1, participantUsername1), false);
        testLecture.grantToken(participantId1, participantUsername1)
        assert.equal(testLecture.hasToken(participantId1, participantUsername1), true);
        assert.equal(testLecture.grantToken("rambazamba", "asdf"), false);
    });

    it('test hasPPant', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        testLecture.enter(participantId1, participantUsername1);
        assert.equal(testLecture.hasPPant(participantId1), true)
        assert.equal(testLecture.hasPPant("random"), false)
    });

    it('test ban', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        testLecture.ban("asdf")
        assert.equal(testLecture.isBanned("asdf"), true)
    });

    it('test isBanned', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        testLecture.ban("asdf")
        assert.equal(testLecture.isBanned("asdf"), true)
        assert.equal(testLecture.isBanned("fdsa"), false)
    });

    it('test hide', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        testLecture.hide()
        assert.equal(testLecture.isHidden(), true)
        testLecture.hide()
        assert.equal(testLecture.isHidden(), true)
    });

    it('test isHidden', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.isHidden(), false)
        testLecture.hide()
        assert.equal(testLecture.isHidden(), true)
    });

    it('test ppantIsOrator', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.enter('oratorid', oratorUsername), true);
        assert.equal(testLecture.enter('u1', 'n1'), true);
        assert.equal(testLecture.enter('u2', 'n2'), true);
        assert.equal(testLecture.enter('u3', 'n3'), true);
        assert.equal(testLecture.enter('u4', 'n4'), false);
    });

    it('test oratorHasToken', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.hasToken('oratorid', oratorUsername), true);
    });

    it('test leave before lecture start', function() {
        var testLecture = new Lecture(id, title, videoId, duration, remarks, addMinutes(new Date(), 3), oratorName, oratorUsername, maxParticipants);
        assert.equal(testLecture.enter('u1', 'n1'), true);
        testLecture.leave('u1');
    });


})