const Task = require('../game/app/server/models/Task');
const expect = require('chai').expect;
const TypeOfTask = require('../game/app/utils/TypeOfTask')

var task = new Task(1, TypeOfTask.BASICTUTORIALCLICK, 10);

describe("Test getter", function() {
    it("Test getId", function() {
        expect(task.getId()).to.be.a('number');
        expect(task.getId()).to.be.equal(1);
    })

    it("Test getTaskType", function() {
        expect(task.getTaskType()).to.be.a('string');
        expect(task.getTaskType()).to.be.equal(TypeOfTask.BASICTUTORIALCLICK);
    })

    it("Test getAwardPoints", function() {
        expect(task.getAwardPoints()).to.be.a('number');
        expect(task.getAwardPoints()).to.be.equal(10);
    })
})
