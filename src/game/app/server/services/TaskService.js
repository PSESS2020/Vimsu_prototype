const TypeChecker = require('../../client/shared/TypeChecker.js');
const TaskFactory = require('../models/factories/TaskFactory.js');
const Task = require('../models/Task.js');
const AlgoLibrary = require('../utils/AlgoLibrary.js');
const TypeOfTask = require('../utils/TypeOfTask')

/**
 * The Task Service
 * @module TaskService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class TaskService {
    #taskLibrary;
    #taskFactory;

    /**
     * Creates an instance of TaskService
     * @constructor 
     */
    constructor() {
        if (!!TaskService.instance) {
            return TaskService.instance;
        }
        this.#taskLibrary = new Map()
        this.#taskFactory = new TaskFactory()
        TaskService.instance = this;
    }

    getMatchingTask(taskData) {
        const { typeOfTask, detail } = taskData
        TypeChecker.isEnumOf(typeOfTask, TypeOfTask)
        if (detail === undefined || detail === "") { detail = {} }
        const { points } = detail
        if (points === undefined) { points = 0 }
        var taskId = this.#calculateTaskID(typeOfTask, detail, points)
        if (this.#taskLibrary.has(taskId)) { return this.#taskLibrary.get(taskId) }
        else {
            var newTask = this.#taskFactory(taskId, typeOfTask, detail, points)
            this.#taskLibrary.set(taskId, newTask)
            return newTask
        }
    }

    checkForAndPerformTaskIncr(ppant, typeOfTask, contextObject) {
        let tasksToIncrement = this.#taskLibrary.filter( task => task.checkIfWasPerformed(typeOfTask, contextObject) )
        tasksToIncrement.forEach( task => {
            if (!ppant.isKnownTask(task)) { ppant.trackNewTask(task) }
            ppant.incrTaskCounter(task)
        })
        return tasksToIncrement
    }

    #calculateTaskID(typeOfTask, detail, points) {  
        TypeChecker.isInt(points)
        var detailToHexString = ""
        for (const [key, val] of Object.entries(detail)) {
            // handle if val isn't string
            if (!(key === "points")) { detailToHexString += `#${AlgoLibrary.convertToHashCode(key)}:${AlgoLibrary.convertToHashCode(val)}` }
        }
        if (detailToHexString === "") { detailToHexString = AlgoLibrary.convertToHashCode("NONE") }
        return `${Settings.CONFERENCE_ID}_${AlgoLibrary.convertToHashCode(typeOfTask)}_${detailToHexString}_${points}`
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskService;
}