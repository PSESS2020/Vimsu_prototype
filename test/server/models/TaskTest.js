const Task = require('../../../game/app/server/models/Task');
const expect = require('chai').expect;
const TypeOfTask = require('../../../game/app/server/utils/TypeOfTask')

var id = 1;
var taskType = TypeOfTask.BASICTUTORIALCLICK;
var awardPoints = 10;
var task = new Task(id, taskType, awardPoints);

describe("Task Test getter", function() {
    it("Test getId", function() {
        expect(task.getId()).to.be.a('number').and.equal(id);
    })

    it("Test id Error", function() {
        expect(() => new Task("1", 2, "3")).to.throw(TypeError);
    })

    it("Test getTaskType", function() {
        expect(task.getTaskType()).to.be.a('string').and.equal(taskType);
    })

    it("Test taskType Error", function() {
        expect(() => new Task(1, 2, "3")).to.throw(TypeError);
    })

    it("Test getAwardPoints", function() {
        expect(task.getAwardPoints()).to.be.a('number').and.equal(awardPoints);
    })

    it("Test awardPoints Error", function() {
        expect(() => new Task(1, TypeOfTask.ASKQUESTIONINLECTURE, "3")).to.throw(TypeError);
    })
})
