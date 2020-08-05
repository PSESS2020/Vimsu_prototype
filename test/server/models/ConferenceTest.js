const chai = require('chai');
chai.use(require('chai-datetime'));
const assert = chai.assert;
const expect = chai.expect;

const Conference = require('../../../game/app/server/models/Conference.js');
const Schedule = require('../../../game/app/server/models/Schedule.js');
const Lecture = require('../../../game/app/server/models/Lecture.js');
const Settings = require('../../../game/app/utils/Settings.js');
const LectureTestData = require('./TestData/LectureTestData.js');

//Lecture Test Data
id = LectureTestData.id;
title = LectureTestData.title;
videoId = LectureTestData.videoId;
duration = LectureTestData.duration;
remarks = LectureTestData.remarks;
startingTime = new Date();
oratorName = LectureTestData.oratorName;
maxParticipants = LectureTestData.maxParticipants;

//Conference Test Data
var lectureList = [];
lectureList.push( new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, maxParticipants) );

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
            expect(lectures_result[0].getId()).to.be.a('string').and.equal(id);
            expect(lectures_result[0].getTitle()).to.be.a('string').and.equal(title);
            expect(lectures_result[0].getVideoId()).to.be.a('string').and.equal(videoId);
            expect(lectures_result[0].getDuration()).to.be.a('number').and.equal(duration);
            expect(lectures_result[0].getRemarks()).to.be.a('string').and.equal(remarks);
            expect(lectures_result[0].getStartingTime()).to.equalDate(startingTime);
            expect(lectures_result[0].getOratorName()).to.be.a('string').and.equal(oratorName);
            expect(lectures_result[0].getMaxParticipants()).to.be.a('number').and.equal(maxParticipants);
        })
    })
})