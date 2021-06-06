const TypeChecker = require('../../client/shared/TypeChecker.js');
const Task = require('../models/Task.js');
const TypeOfTask = require('../utils/TypeOfTask')

/**
 * The Task Service
 * @module TaskService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class TaskService {
    #taskSet;
    #taskLibrary;

    /**
     * Creates an instance of TaskService
     * @constructor 
     */
    constructor() {
        if (!!TaskService.instance) {
            return TaskService.instance;
        }

        this.#taskSet = new Set()
        this.#taskLibrary = []
    }

    addNewTask(task) {
        // needs to check if task is already tracked and, if yes,
        // return the original one so achvmnts depending on the same
        // task actually depend on the same task
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskService;
}