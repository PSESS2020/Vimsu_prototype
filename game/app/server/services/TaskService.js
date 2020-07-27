var TypeChecker = require('../../utils/TypeChecker.js');
var Task = require('../models/Task.js');
var TypeOfTask = require('../../utils/TypeOfTask')

module.exports = class TaskService {
    #tasks;

    constructor() {
        if(!!TaskService.instance){
            return TaskService.instance;
        }

        this.#tasks = [];
        this.initAllTasks();
        TaskService.instance = this;
    }

    getAllTasks() {
        return this.#tasks;
    }

    getTask(taskId) {
        TypeChecker.isInt(taskId);

        let index = this.#tasks.findIndex(task => task.getId() === taskId);

        if (index < 0) 
        {
            throw new Error(taskId + " is not in list of tasks")
        }

        return this.#tasks[index];
    }

    getTaskByType(taskType) {
        // TODO: type check

        let index = this.#tasks.findIndex(task => task.getTaskType() === taskType);

        if (index < 0) 
        {
            throw new Error(taskType + " is not in list of tasks")
        }

        return this.#tasks[index];
    }

    initAllTasks() {
        var id = 1;
        this.#tasks.push(new Task(id++, TypeOfTask.ASKQUESTIONINLECTURE, 2));
        this.#tasks.push(new Task(id++, TypeOfTask.BASICTUTORIALCLICK, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.BEFRIENDOTHER, 15));
        this.#tasks.push(new Task(id++, TypeOfTask.FOODCOURTVISIT, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.FOYERVISIT, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.INITPERSONALCHAT, 5));
        this.#tasks.push(new Task(id++, TypeOfTask.LECTUREVISIT, 30));
        this.#tasks.push(new Task(id++, TypeOfTask.RECEPTIONVISIT, 0));
    }
} 