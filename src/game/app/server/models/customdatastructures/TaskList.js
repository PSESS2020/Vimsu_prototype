const TypeChecker = require("../../../client/shared/TypeChecker");
const TaskService = require("../../services/TaskService");
const Task = require("../rewards/Task");

/**
 * Custom List class that guarantees that 
 *   (a) each contained element is an instance of the Task class 
 *       or the TaskList class
 *   (b) it does not contain duplicates
 * @module TaskList
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class TaskList extends Array {

    #taskService

    constructor(...values) {
        let numberOfArgs = values.length
        if (numberOfArgs === 0) { super() }
        else if (numberOfArgs === 1) {
            let len = values[0]
            if (typeof len === 'number') { super(len) }
            else { 
                TypeChecker.isInstanceOf(len, Task)
                super(len)
            }
        }
        else {
            values.forEach( task => TypeChecker.isInstanceOf(task, Task) )
            super(values)
        }
        this.#taskService = new TaskService()
    }

    concat(taskList) {
        this.addTasks(taskList)
    }

    fill(task) {

    }

    join() {

    }

    push(task) {

    }

    unshift(...tasks) {

    }

    addTasks(taskList) {

    }

    flattenRecursively() {

    }

    buildTasks(taskData) {
        const { typeOfTask: toT, detail: det } = taskData
        if (Array.isArray(toT)) {
            if ( !Array.isArray(det) || (toT.length !== det.length) ) {
                throw new Error(`Error while creating ${achvmtName}! For each task-data object, the length of the typeOfTask array and the detail array must be the same.`)
            }
            for (i in [...Array(toT.length)]) {
                this.buildTasks({ typeOfTask: toT[i], detail: det[i] })
            }
        } else {
            this.push(this.#taskService.getMatchingTask(taskData))
        }
    }

    #checkArguments(...args) {

    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskList;
}