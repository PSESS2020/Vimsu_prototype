const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const TaskService = require("../../services/TaskService");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const LevelList = require("../customlisttypes/LevelList");
const TaskList = require("../customlisttypes/TaskList");
const Achievement = require("../rewards/Achievement");
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

class AchievementFactory {

    #AchievementService
    #taskService
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
            this.#checkIfProperlyFormattedTask(task)
            let taskStrucForLevel = this.#taskService.buildTaskStructureForLevel(task)
            // flatten taskStruc and add to taskList w/o double entries
            levels.forEach( level => {
                this.#checkLevelFormatMatchesTask(task, level)
                levelListToReturn.add( this.#levelFactory.createLevel(level, taskStrucForLevel) )
            })
        }
        return { taskList: taskListToReturn, levelList: levelListToReturn }
    }

    #checkIfProperlyFormattedTask = function ({ typeOfTask, detail }) {
        const errorString = `Error while creating ${achvmtName}! The structure of the typeOfTask and  the detail field of a task definition must match.`
        if (Array.isArray(typeOfTask)) {
            if(!Array.isArray(detail) || (typeOfTask.length !== detail.length)) { throw new Error(errorString) }           
            for (i in [...Array(typeOfTask.length)]) {
                this.#checkIfProperlyFormattedTask({ typeOfTask: typeOfTask[i], detail: detail[i] })
            }
        } else if (Array.isArray(detail)) { throw new Error(errorString) }
    }

    // TODO
    // maybe rethink how to connect tasks?
    #checkLevelFormatMatchesTask = function (task, level) {
        const { typeOfTask: toT } = task
        const { counter: cou } = level
        const errorString = `Error while creating ${achvmtName}! The structure of the task definition and the counter field of the corresponding level definition must match.`
        if (Array.isArray(toT)) {
            if (!Array.isArray(cou) || (toT.length !== cou.length)) {
                throw new Error(errorString)
            }
            for (i in [...Array(toT.length)]) {
                this.#checkLevelFormatMatchesTask( {typeOfTask: toT[i]}, {counter: cou[i]} )
            }          
        } else if (Array.isArray(cou)) { throw new Error(errorString) }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}