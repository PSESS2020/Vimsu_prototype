const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const TaskService = require("../../services/TaskService");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const LevelList = require("../customlisttypes/LevelList");
const TaskList = require("../customlisttypes/TaskList");
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
        var isSilentFlag 
        var isHiddenFlag
        if (visMods === undefined) { 
            isSilentFlag = false; isHiddenFlag = false 
        } else {
            const { isSilent, isHidden } = visMods
            isSilentFlag = (isSilent !== undefined) ? isSilent : false
            isHiddenFlag = (isSilentFlag || isHidden)
        }

        const { taskList, levelList } = this.#buildTasksAndLevels(task, levels)

        var achvmtId = this.#calculateAchvmtID(title, taskList, levels, restrictions)
        // add observers for door opening (will be done at later point & somewhere else)
       return new Achievement(achvmtId, title, icon, description, taskList, levelList, restrictions, isSilentFlag, isHiddenFlag)
    }

    #calculateAchvmtID = function (title, taskList, levels, restrictions) {
        let taskString = taskList.reduce( task => `#${task.getId().split("_")[2]}` )
        let levelString = levels.reduce( level => `${AlgoLibrary.dataObjectToHashCode(level)}`, "" )
        // change how restriction string is calculated to better
        // account for no restrictions
        return `${Settings.CONFERENCE_ID}_${AlgoLibrary.convertToHashCode(title)}_${taskString}_${levelString}_**${AlgoLibrary.dataObjectToHashCode(restrictions)}` 
    }

    #buildTasksAndLevels = function(task, levels) {
        var taskListToReturn = new TaskList()
        var levelListToReturn = new LevelList()
        if (Array.isArray(task)) {
            if (task.length !== levels.length) { throw new Error(`Error while creating ${achvmtName}! When defining level-specific tasks, length of task array and length of level array must be the same.`) }
            for (i in [...Array(task.length)]) {
                const { taskList: newTasks, levelList: newLevels } = this.#buildTasksAndLevels(task[i], [ levels[i] ])
                taskListToReturn.addTasks(newTasks)
                levelListToReturn.addLevels(newLevels)
            }
        } else {
            taskListToReturn.buildTasks(task)
            levels.forEach( level => {
                this.#checkFormat(task, level)
                var newLevel = this.#levelFactory.createLevel(level)
                let fn = this.#writeEligibilityCheckingMethod(task)
                Object.defineProperty(newLevel, "isEligibleForLevel", { value: new Function('ppant', fn) })
                levelListToReturn.add(level)
            })
        }
        return { taskList: taskListToReturn, levelList: levelListToReturn }
    }

    #writeEligibilityCheckingMethod = function (task) {
        var fn = ""
        // TODO 
        return fn
    }

    // TODO
    // maybe rethink how to connect tasks?
    #checkFormat = function (task, level) {
        const { typeOfTask: toT, detail: det } = task
        const { counter: cou } = level
        const errorString = `Error while creating ${achvmtName}! The structure of the typeOfTask field of a task definition, the detail field of a task definition and the counter field of the corresponding level definition must match.`
        if (Array.isArray(toT)) {
            if (!Array.isArray(cou)) {
                
            }
            if ( !Array.isArray(det) || (toT.length !== det.length) || (toT.length !== cou.length) ) { throw new Error(errorString) }
            else {
                for (i in [...Array(toT.length)]) {
                    if (Array.isArray(toT[i])) {

                    }
                }
            }
        } else { 
            if (Array.isArray(cou)) { throw new Error(errorString) }
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}