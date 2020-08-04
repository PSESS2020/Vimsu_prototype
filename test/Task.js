const Task = require('../game/app/server/models/Task');
const expect = require('chai').expect;
const TypeOfTask = require('../game/app/utils/TypeOfTask')

var task = new Task(1, TypeOfTask.BASICTUTORIALCLICK, 10);

describe("Test getter", function() {
    it("Test getId", function() {
        expect(task.getId()).to.be.a('number').and.equal(1);
        expect(() => new Task("1", 2, "3").getId()).to.throw(TypeError);
    })

    it("Test getTaskType", function() {
        expect(task.getTaskType()).to.be.a('string').and.equal(TypeOfTask.BASICTUTORIALCLICK);
        expect(() => new Task("1", 2, "3").getTaskType()).to.throw(TypeError);
    })

    it("Test getAwardPoints", function() {
        expect(task.getAwardPoints()).to.be.a('number').and.equal(10);
        expect(() => new Task("1", 2, "3").getAwardPoints()).to.throw(TypeError);
    })
})
