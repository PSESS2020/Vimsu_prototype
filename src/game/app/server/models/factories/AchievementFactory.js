const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const TaskService = require("../../services/TaskService");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const Achievement = require("../rewards/Achievement");
const TaskFactory = require("./TaskFactory");
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

class AchievementFactory {

    #AchievementService
    #taskService
    #taskFactory
    #levelFactory

    /**
     * @constructor attemtps to create an instance of AchievementFactory.
     *              AchievementFactory is singleton, so if there already
     *              is an instance, it is returned instead.
     */
    constructor() {
        if (!!AchievementFactory.instance) {
            return AchievementFactory.instance;
        }
        this.#taskService  = new TaskService()
        this.#taskFactory  = new TaskFactory()
        this.#levelFactory = new LevelFactory() 
        AchievementFactory.instance = this;
    }

    createAchievement (achvmtName, achvmtData) {
        // Deconstruct
        // might need some type-checking here
        // add modifier for less intrusive notification
        const { task, title, icon, description, levels, restrictions, visibilityModifiers: visMods } = achvmtData
        const { typeOfTask, detail } = task
        var isSilentFlag 
        var isHiddenFlag
        if (visMods === undefined) { 
            isSilentFlag = false; isHiddenFlag = false 
        } else {
            const { isSilent, isHidden } = visMods
            isSilentFlag = (isSilent !== undefined) ? isSilent : false
            isHiddenFlag = (isSilentFlag || isHidden)
        }

        var taskList  = []
        var levelList = []
        if (Array.isArray(task)) {
            if (task.length !== levels.length) { throw new Error(`Error while creating ${achvmtName}! When defining level-specific tasks, length of task array and length of level array must be the same.`) }
            for (i in [...Array(task.length)]) {
                this.#checkFormat(task[i], levels[i])
                var newLevel = this.#levelFactory.createLevel(levels[i])
                let fn = this.#writeEligibilityCheckingMethod(task[i])
                Object.defineProperty(newLevel, "isEligibleForLevel", { value: new Function('ppant', fn) })
                levelList.push(newLevel)
            }
        } else {
            let fn = this.#writeEligibilityCheckingMethod(task)
            levels.forEach( level => {
                this.#checkFormat(task, level)
                var newLevel = this.#levelFactory.createLevel(level)
                Object.defineProperty(newLevel, "isEligibleForLevel", { value: new Function('ppant', fn) })
                levelList.push(newLevel) 
            })
        }

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
       return new Achievement(achvmtId, title, icon, description, taskList, levels, restrictions, isSilentFlag, isHiddenFlag)
    }

    #calculateAchvmtID = function (title, taskList, levels, restrictions) {
        let taskString = taskList.reduce( task => `#${task.getId().split("_")[2]}` )
        let levelString = levels.reduce( level => `${AlgoLibrary.dataObjectToHashCode(level)}`, "" )
        // change how restriction string is calculated to better
        // account for no restrictions
        return `${Settings.CONFERENCE_ID}_${AlgoLibrary.convertToHashCode(title)}_${taskString}_${levelString}_**${AlgoLibrary.dataObjectToHashCode(restrictions)}` 
    }

    #writeEligibilityCheckingMethod(task) {
        const { typeOfTask: type, detail } = task
        var fn = ""
        if (Array.isArray(type)) {
            
        }

    }

    #checkFormat(task, level) {
        const { typeOfTask, detail } = task
        const { counter } = level
        if (Array.isArray(typeOfTask)) {
            /* TODO */
        } else { /* TODO */}
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}