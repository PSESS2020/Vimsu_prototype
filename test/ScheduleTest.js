const Schedule = require('../game/app/server/models/Schedule');
const chai = require('chai');
chai.use(require('chai-datetime'));
const expect = chai.expect;
const assert = chai.assert;
const Settings = require('../game/app/utils/Settings');
const Lecture = require('../game/app/server/models/Lecture')

var lectureList = [];
var now = new Date();
var id = "53f";
var title = "Math";
var videoId = "123b";
var duration = 10.5;
var remarks = "Math is fun";
var startingTime = new Date(now.setMinutes(now.getMinutes() + 10));
var oratorName = "Prof. Max Mustermann";
var maxParticipants = 1000;
lectureList.push(new Lecture("53d", "Computer Science", "123c", 13, "Computer science is fun", new Date("Tue Aug 03 2020 10:42:24 GMT+0200"), "Prof. Max Mustermann", 1000))
lectureList.push(new Lecture(id, title, videoId, duration, remarks, startingTime, oratorName, maxParticipants));
lectureList.push(new Lecture("53g", "Physic", "123a", 300, "Physic is fun", new Date(now.setMinutes(now.getMinutes() - 3)), "Prof. Max Mustermann", 1000));
var schedule = new Schedule(lectureList);


describe("Test constructor", function () {
    it("Test schedule constructor", function() {
        var lectureList2 = [1];
        expect(() => new Schedule(lectureList2.push(new Lecture(1, 2, 3, "4", 5, 6, 7, "8")))).to.throw(TypeError, "not a string");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", 2, 3, "4", 5, 6, 7, "8")))).to.throw(TypeError, "not a string");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", 3, "4", 5, 6, 7, "8")))).to.throw(TypeError, "not a string");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", "3", "4", 5, 6, 7, "8")))).to.throw(TypeError, "not a number");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", "3", 4, 5, 6, 7, "8")))).to.throw(TypeError, "not a string");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", "3", 4, "5", 6, 7, "8")))).to.throw(TypeError, "not a Date");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", "3", 4, "5", new Date(), 7, "8")))).to.throw(TypeError, "not a string");
        expect(() => new Schedule(lectureList2.push(new Lecture("1", "2", "3", 4, "5", new Date(), "7", "8")))).to.throw(TypeError, "not an int");
        expect(() => new Schedule(lectureList2)).to.throw(TypeError, "an instance of");
    })
})

describe("Test getter", function() {
    
    it("Test getLecture", function() {
        var lecture = schedule.getLecture(id);
        assert.instanceOf(lecture, Lecture)
        expect(lecture.getId()).to.be.a('string').and.equal(id);
        expect(lecture.getTitle()).to.be.a('string').and.equal(title);
        expect(lecture.getVideoId()).to.be.a('string').and.equal(videoId);
        expect(lecture.getDuration()).to.be.a('number').and.equal(duration);
        expect(lecture.getRemarks()).to.be.a('string').and.equal(remarks);
        expect(lecture.getStartingTime()).to.equalDate(startingTime);
        expect(lecture.getOratorName()).to.be.a('string').and.equal(oratorName);
        expect(lecture.getMaxParticipants()).to.be.a('number').and.equal(maxParticipants);
    })

    it("Test getAllLectures", function() {
        var lectures = schedule.getAllLectures();
        expect(lectures).to.be.an('array').and.to.have.lengthOf(3);
    })

    it("Test getCurrentLectures", function() {
        var currentLectures = schedule.getCurrentLectures();
        expect(currentLectures).to.be.an('array').and.to.have.lengthOf(2);
        expect(currentLectures[0].getId()).to.be.equal(id);
        expect(currentLectures[1].getId()).to.be.equal("53g");
    })
})
