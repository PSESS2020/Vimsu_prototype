const chai = require('chai');
chai.use(require('chai-datetime'));
const assert = chai.assert;
const expect = chai.expect;

const Conference = require('../../../src/game/app/server/models/Conference.js');
const Schedule = require('../../../src/game/app/server/models/Schedule.js');
const Lecture = require('../../../src/game/app/server/models/Lecture.js');
const Settings = require('../../../src/game/app/server/utils/Settings.js');
const LectureTestData = require('./TestData/LectureTestData.js');

//Lecture Test Data
id = LectureTestData.id;
title = LectureTestData.title;
videoId = LectureTestData.videoId;
duration = LectureTestData.duration;
remarks = LectureTestData.remarks;
startingTime = new Date();
oratorName = LectureTestData.oratorName;
oratorUsername = LectureTestData.oratorUsername;
maxParticipants = LectureTestData.maxParticipants;

//Conference Test Data
var lectureList = [];
lecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
lectureList.push( new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants) );

schedule = new Schedule( lectureList );
conference = new Conference( schedule );
/*conference_2 = new Conference(new Schedule());
conference_3 = new Conference(new Schedule());
conference_4 = new Conference(new Schedule());
conference_5 = new Conference(new Schedule());
conference_6 = new Conference(new Schedule());
conference_7 = new Conference(new Schedule());
conference_8 = new Conference(new Schedule());*/

//Results
schedule_result = conference.getSchedule();
lectures_result = schedule_result.getAllLectures();

describe('Conference Testing', function() {
    it('Test instance', function() {
        assert.instanceOf(conference, Conference);
    })

    describe('Conference getter functions', function() {
        it('Test getSchedule()', function() {
            assert.instanceOf(schedule_result, Schedule);

            expect(lectures_result).to.be.an('array').and.to.have.lengthOf(1);

            //equal not working because of the stric equality of javascript.
            //eql uses the deep-algorithm to compare sameness to all depths.
            expect(schedule_result).to.be.eql(schedule);
            expect(lectures_result[0]).to.be.eql(lecture);
        })
    })
})