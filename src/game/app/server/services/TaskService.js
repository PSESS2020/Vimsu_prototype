const TypeChecker = require('../../client/shared/TypeChecker.js');
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

    /**
     * Creates an instance of TaskService
     * @constructor 
     */
    constructor() {
        if (!!TaskService.instance) {
            return TaskService.instance;
        }
        this.#taskLibrary = []
    }

    getMatchingTask(taskData) {
        // needs to check if task is already tracked and, if yes,
        // return the original one so achvmnts depending on the same
        // task actually depend on the same task
        const { typeOfTask, detail } = taskData
        TypeChecker.isEnumOf(typeOfTask, TypeOfTask)
        if (detail === undefined) { detail = {} }
        const { points } = detail
        if (points === undefined) { points = 0 }
        var taskId = this.#calculateTaskID(typeOfTask, detail, points)
        // check if task with this id already exists
        // if yes, return it
        if (this.#taskAlreadyKnown(taskId)) { }
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