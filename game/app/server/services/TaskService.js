const TypeChecker = require('../../client/shared/TypeChecker.js');
const Task = require('../models/Task.js');
const TypeOfTask = require('../utils/TypeOfTask')

module.exports = class TaskService {
    #tasks;

    /**
     * @constructor Creates an instance of TaskService
     */
    constructor() {
        if (!!TaskService.instance) {
            return TaskService.instance;
        }

        this.#tasks = [];
        this.#initAllTasks();
        TaskService.instance = this;
    }

    /**
     * Gets all tasks
     * 
     * @return tasks array
     */
    getAllTasks() {
        return this.#tasks;
    }

    /**
     * Gets task by its task type
     * 
     * @param {TypeOfTask} taskType type of task
     * 
     * @return Task instance
     */
    getTaskByType(taskType) {
        TypeChecker.isEnumOf(taskType, TypeOfTask);

        let index = this.#tasks.findIndex(task => task.getTaskType() === taskType);

        if (index < 0) {
            throw new Error(taskType + " is not in list of tasks")
        }

        return this.#tasks[index];
    }

    /**
     * Initialize all tasks
     */
    #initAllTasks = function() {
        var id = 1;
        this.#tasks.push(new Task(id++, TypeOfTask.ASKQUESTIONINLECTURE, 2));
        this.#tasks.push(new Task(id++, TypeOfTask.BASICTUTORIALCLICK, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.BEFRIENDOTHER, 15));
        this.#tasks.push(new Task(id++, TypeOfTask.FOODCOURTVISIT, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.FOYERVISIT, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.INITPERSONALCHAT, 5));
        this.#tasks.push(new Task(id++, TypeOfTask.LECTUREVISIT, 30));
        this.#tasks.push(new Task(id++, TypeOfTask.RECEPTIONVISIT, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.FOYERHELPERCLICK, 0));
        this.#tasks.push(new Task(id++, TypeOfTask.CHEFCLICK, 0));
    }
} 