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

    createTask (taskData) {
        // TODO handle array combinations that are possible in taskData
        // these will be handled in AchievementFactory
        const { typeOfTask, detail, points } = taskData
        if (points === undefined) { points = 0 }
        if (detail === undefined) { detail = {} }
        var taskId = this.#calculateTaskID(typeOfTask, detail, points)
        var taskToReturn = new Task(taskId, typeOfTask, points)
        this.#writeCheckDetailMethodOfTask(taskToReturn, typeOfTask, detail)
        return taskToReturn
    }

    // move this to task service
    #calculateTaskID(typeOfTask, detail, points) {
        TypeChecker.isEnumOf(typeOfTask, TypeOfTask)
        TypeChecker.isInt(points)
        var detailToHexString = ""
        for (const [key, val] of Object.entries(detail)) {
            // handle if val isn't string
            detailToHexString += `#${CodeLibrary.convertToHashCode(key)}:${CodeLibrary.convertToHashCode(val)}`
        }
        return `${Settings.CONFERENCE_ID}_${CodeLibrary.convertToHashCode(typeOfTask)}_${detailToHexString}_${points}`
    }

    #writeCheckDetailMethodOfTask(task, typeOfTask, detail) {
        var funBody = `if (this.getTypeOfTask() !== "${typeOfTask}") { return false };\n`
        +  "let contextObjectState = contextObject.getState();\n"
        +  "let checkResult = true;\n"
        for (const [key, val] of Object.entries(detail)) {
            if (key.toLowerCase() === "class") {
                funBody += `if (contextObject.constructor.name === "${val}") { return false; }\n`
            } else {
                funBody += `if (contextObjectState.hasOwnProperty("${key}") { \n`
                if (typeof val === 'string') {
                    funBody += `checkResult = (checkResult && (contextObjectState.${key} === "${val}"))\n`
                } else {
                    funBody += `checkResult = (checkResult && (contextObjectState.${key} === ${val}))\n`
                }
                funBody += "}\n"
            }
        }
        funBody += "return checkResult\n"
        Object.defineProperty(task, "checkDetail", { value: new Function('contextObject', funBody) })
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TaskFactory;
}