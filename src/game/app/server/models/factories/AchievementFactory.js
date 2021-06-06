const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const TaskService = require("../../services/TaskService");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const Achievement = require("../Achievement");
const TaskFactory = require("./TaskFactory");
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

class AchievementFactory {

    #AchievementService
    #taskService
    #taskFactory

    /**
     * @constructor attemtps to create an instance of AchievementFactory.
     *              AchievementFactory is singleton, so if there already
     *              is an instance, it is returned instead.
     */
    constructor() {
        if (!!AchievementFactory.instance) {
            return AchievementFactory.instance;
        }
        this.#taskService = new TaskService()
        this.#taskFactory = new TaskFactory()
        AchievementFactory.instance = this;
    }

    createAchievement (achvmtName, achvmtData) {
        // Deconstruct
        // might need some type-checking here
        const { task, title, icon, description, levels, restrictions } = achvmtData
        const { typeOfTask, detail } = task
        var taskList = []
        // add handling for achvmnts with different tasks for
        // different levels
        if (Array.isArray(typeOfTask)) {
            // make sure level and task structure match
            if (!( (typeOfTask.length === levels.length) && (typeOfTask.length === detail.length) )) {
                throw new Error("When creating an achievement, the structure of the typeOfTask-field, the detail field and the count-field must match for every level!")
            }
            for (i in [...Array(typeOfTask.length)]) {
                // handle arrays in arrays
                let taskData = { typeOfTask: typeOfTask[i], detail: detail[i] }
                taskList.push(this.#taskService.getMatchingTask(taskData))
            }
        } else {
            taskList.push(this.#taskService.getMatchingTask(task))
        }
        var achvmtId = this.#calculateAchvmtID(title, taskList, levels, restrictions)
        // add observers for door opening (will be done at later point & somewhere else)
        var achvmtToReturn = new Achievement(achvmtId, title, icon, description, taskList, levels)
        this.#writeCheckRestrictionMethod(achvmtToReturn, restrictions)
        return achvmtToReturn
    }

    #calculateAchvmtID = function (title, taskList, levels, restrictions) {
        let taskString = taskList.reduce( task => `#${task.getId().split("_")[2]}` )
        let levelString = levels.reduce( level => `${AlgoLibrary.dataObjectToHashCode(level)}` )
        // change how restriction string is calculated to better
        // account for no restrictions
        return `${Settings.CONFERENCE_ID}_${AlgoLibrary.convertToHashCode(title)}_${taskString}_${levelString}_**${AlgoLibrary.dataObjectToHashCode(restrictions)}` 
    }

    #writeCheckRestrictionMethod(achvmt, restrictions) {
        var funBody = "TypeChecker.isInstanceOf(ppant, Participant);\n" 
        + "let ppantState = ppant.getState();\n"
        + "let checkResult = true;\n"
        for (const [key, val] of Object.entries(restrictions)) {
            funBody += `if (ppantState.hasOwnProperty("${key}") { \n`
            if (typeof val === 'string') {
                funBody += `checkResult = (checkResult && (ppantState.${key} === "${val}"));\n`
            } else {
                funBody += `checkResult = (checkResult && (ppantState.${key} === ${val}));\n`
            }
            funBody += "}\n" 
        }
        funBody += "return checkResult;\n"
        Object.defineProperty(achvmt, "fulfillsRestrictions", { value: new Function('ppant', funBody) })
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}