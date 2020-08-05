const TaskService = require('../../../game/app/server/services/TaskService');
const { expect } = require('chai');
const TypeOfTask = require('../../../game/app/utils/TypeOfTask')
const Task = require('../../../game/app/server/models/Task')

var taskService = new TaskService();
var taskId = 3;
var taskType = TypeOfTask.BEFRIENDOTHER;
var awardPoints = 15;
var task1 = new Task(taskId, taskType, awardPoints);

describe('TaskServiceTest getter', function() {
    it('test getAllTasks', function() {
        expect(taskService.getAllTasks()).to.be.an('array').and.to.have.lengthOf(10);
    });

    it('test getTask', function() {
        expect(taskService.getTask(taskId)).to.eql(task1);
        expect(() => taskService.getTask(30)).to.throw(Error);
    });

    it('test getTaskByType', function() {
        expect(taskService.getTaskByType(taskType)).to.eql(task1);
        expect(() => taskService.getTaskByType(TypeOfTask.SENDALLCHAT)).to.throw(Error);
    });
});
