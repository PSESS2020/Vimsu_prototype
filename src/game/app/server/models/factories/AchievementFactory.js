const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const TaskService = require("../../services/TaskService");
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
        
        this.#AchievementService = new AchievementService()
        this.#taskService = new TaskService()
        this.#taskFactory = new TaskFactory()
        AchievementFactory.instance = this;
    }

    createAchievement (achvmtName, achvmtData) {
        // Deconstruct
        const { task, title, icon, description, levels, restrictions } = achvmtData
        const { typeOfTask, detail } = task
        let achvmtId = this.#calculateAchvmtID(task, restrictions)
        // handle restrictions
        // handle details
        // add to AchievementService
        // add observers for door opening
        return new Achievement(achvmtId, title, icon, description, typeOfTask, detail, levels)
    }

    #calculateAchvmtID = function (task, restrictions) {
        // TODO redo

        // maybe add name in here as well
        this.#taskToHexString(`${this.#convertToHashCode(Settings.CONFERENCE_ID)}_`, task)

        const { title, task: { typeOfTask, detail }, restrictions } = achvmtData
        let detailString = ( (detail instanceof String) ? detail : detail.reverse().reduce( (acc, val) => `${val}#${acc.slice(1)}` ) )
        let restrictionString = restrictions.reverse().reduce( (acc, val) => `${val}#${acc.slice(1)}` )
        return `${Settings.CONFERENCE_ID}_${title}_${typeOfTask}_${detailString}&&${restrictionString}` 
    }

    #taskToHashCode = function (acc, task) {
        if (Array.isArray(task)) {
            task.forEach( task => this.#taskToHexString(acc, task) )
        } else {
            const { typeOfTask, detail } = task
            // if typeOfTask is array, detail needs to be one
            // of equal length
            if (Array.isArray(typeOfTask)) {
                for (i in [...Array(typeOfTask.length)]) {
                    acc += `#${this.#convertToHashCode(typeOfTask[i])}_${this.#convertToHashCode(detail[i])}`
                }
            } else {
                let temp = (Array.isArray(detail)) ? `${detail.reduce( (acc, val) => `${acc}${this.#convertToHashCode(val)}+`, "" )}` : this.#convertToHashCode(detail)
                acc += `#${this.#convertToHashCode(typeOfTask[i])}_`

            }
        }
        return acc;
    }

    #convertToHashCode = function (string) {
        TypeChecker.isString(string)
        var hash = 0
        for (i in  [...Array(string.length)]) {
            hash = ((hash << 5) - hash) + string.charCodeAt(i)
            hash = hash & hash
        }
        return parseInt(hash, 10).toString(36)
    } 
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}