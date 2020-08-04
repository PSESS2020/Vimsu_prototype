const Schedule = require('../game/app/server/models/Schedule');
const chai = require('chai');
chai.use(require('chai-datetime'));
const expect = chai.expect;
const assert = chai.assert;
const Settings = require('../game/app/utils/Settings');
const Lecture = require('../game/app/server/models/Lecture')

var lectureList = [];
var now = new Date();
lectureList.push(new Lecture("53d", "Computer Science", "123c", 13, "Computer science is fun", new Date("Tue Aug 03 2020 10:42:24 GMT+0200"), "Prof. Max Mustermann", 1000))
lectureList.push(new Lecture("53f", "Math", "123b", 10.5, "Math is fun", new Date(now.setMinutes(now.getMinutes() + 10)), "Prof. Max Mustermann", 1000));
lectureList.push(new Lecture("53g", "Physic", "123a", 300, "Physic is fun", new Date(now.setMinutes(now.getMinutes() - 3)), "Prof. Max Mustermann", 1000));
var schedule = new Schedule(lectureList);

describe("Test getter", function() {
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

    it("Test getLecture", function() {
        var lecture = schedule.getLecture("53f");
        assert.instanceOf(lecture, Lecture)
        expect(lecture.getId()).to.be.a('string').and.equal("53f");
        expect(lecture.getTitle()).to.be.a('string').and.equal("Math");
        expect(lecture.getVideoId()).to.be.a('string').and.equal("123b");
        expect(lecture.getDuration()).to.be.a('number').and.equal(10.5);
        expect(lecture.getRemarks()).to.be.a('string').and.equal("Math is fun");
        expect(lecture.getStartingTime()).to.equalDate(new Date("Tue Aug 04 2020 10:42:24 GMT+0200"));
        expect(lecture.getOratorName()).to.be.a('string').and.equal("Prof. Max Mustermann");
        expect(lecture.getMaxParticipants()).to.be.a('number').and.equal(1000);
    })

    it("Test getAllLectures", function() {
        var lectures = schedule.getAllLectures();
        expect(lectures).to.be.an('array').and.to.have.lengthOf(3);
    })

    it("Test getCurrentLectures", function() {
        var currentLectures = schedule.getCurrentLectures();
        expect(currentLectures).to.be.an('array').and.to.have.lengthOf(2);
        expect(currentLectures[0].getId()).to.be.equal("53f");
        expect(currentLectures[1].getId()).to.be.equal("53g");
    })
})
