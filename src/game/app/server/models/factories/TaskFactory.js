const TypeChecker = require("../../../client/shared/TypeChecker");
const CodeLibrary = require("../../utils/AlgoLibrary");
const TypeOfTask = require("../../utils/TypeOfTask");
const Task = require("../Task");
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

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
        var taskToReturn = new Task(taskId, typeOfTask, points)
        this.#writeCheckDetailMethodOfTask(taskToReturn, typeOfTask, detail)
        return taskToReturn
    }

    #writeCheckDetailMethodOfTask(task, typeOfTask, detail) {
        // maybe add another safety check to guarantee that contextObject
        // has getState() method
        var funBody = `if (this.getTypeOfTask() !== "${typeOfTask}") { return false };\n`
        +  "let contextObjectState = contextObject.getState();\n"
        +  "let checkResult = true;\n"
        for (const [key, val] of Object.entries(detail)) {
            if (key.toLowerCase() === "class") {
                funBody += `if (contextObject.constructor.name === "${val}") { return false; }\n`
            } else {
                funBody += `if (contextObjectState.hasOwnProperty("${key}") { \n`
                if (typeof val === 'string') {
                    funBody += `checkResult = (checkResult && (contextObjectState.${key} === "${val}"));\n`
                } else {
                    funBody += `checkResult = (checkResult && (contextObjectState.${key} === ${val}));\n`
                }
                funBody += "}\n"
            }
        }
        funBody += "return checkResult;\n"
        Object.defineProperty(task, "checkDetail", { value: new Function('contextObject', funBody) })
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskFactory;
}