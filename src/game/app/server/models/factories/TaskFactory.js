const TypeOfTask = require("../../utils/TypeOfTask");
const Task = require("../rewards/Task");

class TaskFactory {

    constructor() {
        if (!!TaskFactory.instance) {
            return TaskFactory.instance;
        }
        TaskFactory.instance = this;
    }

    createTask (taskId, typeOfTask, detail, points) {
        // TODO handle array combinations that are possible in taskData
        // these will be handled in AchievementFactory
        
        // sanitizing detail and deleting the points field from it
        // this will prevent the checkIfWasPerformed method from failing
        // from the contextObject not having a "points" field
        var creationDetail
        if (detail.hasOwnProperty(points)) {
            creationDetail = Object.assign({}, detail)
            delete creationDetail.points
        } else { creationDetail = detail }
        return new Task(taskId, typeOfTask, creationDetail, points)
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskFactory;
}