const Task = require('../../../game/app/server/models/Task');
const expect = require('chai').expect;
const TypeOfTask = require('../../../game/app/utils/TypeOfTask')

var id = 1;
var taskType = TypeOfTask.BASICTUTORIALCLICK;
var awardPoints = 10;
var task = new Task(id, taskType, awardPoints);

describe("Test getter", function() {
    it("Test getId", function() {
        expect(task.getId()).to.be.a('number').and.equal(id);
        expect(() => new Task("1", 2, "3").getId()).to.throw(TypeError);
    })

    it("Test getTaskType", function() {
        expect(task.getTaskType()).to.be.a('string').and.equal(taskType);
        expect(() => new Task("1", 2, "3").getTaskType()).to.throw(TypeError);
    })

    it("Test getAwardPoints", function() {
        expect(task.getAwardPoints()).to.be.a('number').and.equal(awardPoints);
        expect(() => new Task("1", 2, "3").getAwardPoints()).to.throw(TypeError);
    })
})
