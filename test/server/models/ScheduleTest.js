const Schedule = require('../../../src/game/app/server/models/Schedule');
const chai = require('chai');
const expect = chai.expect;
const Lecture = require('../../../src/game/app/server/models/Lecture');
const LectureTestData = require('./TestData/LectureTestData');

var lectureList = [];
var now = new Date();
var id = LectureTestData.id;
var title = LectureTestData.title;
var videoId = LectureTestData.videoId;
var duration = LectureTestData.duration;
var remarks = LectureTestData.remarks;
var startingTime = new Date(now.setMinutes(now.getMinutes() + 10));
var oratorName = LectureTestData.oratorName;
var oratorUsername = LectureTestData.oratorUsername;
var maxParticipants = LectureTestData.maxParticipants;
var lecture = new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, oratorUsername, maxParticipants);
var lecture2 = new Lecture("53g", "Physic", "123a", 300, "Physic is fun", new Date(now.setMinutes(now.getMinutes() - 3)), "Prof. Max Mustermann", oratorUsername, 1000)
lectureList.push(new Lecture("53d", "Computer Science", "123c", 13, "Computer science is fun", new Date("Tue Aug 03 2020 10:42:24 GMT+0200"), "Prof. Max Mustermann", oratorUsername, 1000))
lectureList.push(lecture);
lectureList.push(lecture2);
var schedule = new Schedule(lectureList);


describe("Schedule Test constructor", function () {
    it("Test schedule constructor", function () {
        var lectureList2 = [1];
        expect(() => new Schedule(lectureList2)).to.throw(TypeError, "an instance of");
    })
})

describe("Schedule Test getter", function () {

    it("Test getLecture", function () {
        expect(schedule.getLecture(id)).to.eql(lecture);
    })

    it("Test getAllLectures", function () {
        var lectures = schedule.getAllLectures();
        expect(lectures).to.be.an('array').and.to.have.lengthOf(3);
    })

    it("Test getCurrentLectures", function () {
        var currentLectures = schedule.getCurrentLectures();
        expect(currentLectures).to.be.an('array').and.to.have.lengthOf(2);
        expect(currentLectures[0]).to.eql(lecture);
        expect(currentLectures[1]).to.eql(lecture2);
    })
})
