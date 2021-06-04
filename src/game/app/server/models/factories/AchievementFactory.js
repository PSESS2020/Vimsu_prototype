const TypeChecker = require("../../../client/shared/TypeChecker");
const AchievementService = require("../../services/AchievementService");
const Achievement = require("../Achievement");
const Settings = require(`../../utils/${process.env.SETTINGS_FILENAME}`);

class AchievementFactory {

    #AchievementService

    /**
     * @constructor attemtps to create an instance of AchievementFactory.
     *              AchievementFactory is singleton, so if there already
     *              is an instance, it is returned instead.
     */
    constructor() {
        if (!!AchievementFactory.instance) {
            return AchievementFactory.instance;
        }
        AchievementFactory.instance = this;
        this.#AchievementService = new AchievementService()
    }

    createAchievement (achvmtName, achvmtData) {
        // Deconstruct
        const { task, title, icon, description, levels, restrictions } = achvmtData
        const { typeOfTask, detail } = task
        let achvmtId = this.#calculateAchvmtID(achvmtName, title, description, level)
        // handle restrictions
        // handle details
        // add to AchievementService
        // add observers for door opening
        return new Achievement(achvmtId, title, icon, description, typeOfTask, detail, levels)
    }

    #calculateAchvmtID = function (achvmtName, title, description, level) {
        // TODO redo


        const { title, task: { typeOfTask, detail }, restrictions } = achvmtData
        let detailString = ( (detail instanceof String) ? detail : detail.reverse().reduce( (acc, val) => `${val}#${acc.slice(1)}` ) )
        let restrictionString = restrictions.reverse().reduce( (acc, val) => `${val}#${acc.slice(1)}` )
        return `${Settings.CONFERENCE_ID}_${title}_${typeOfTask}_${detailString}&&${restrictionString}` 
    }

    #convertToHex = function (string) {
        TypeChecker.isString(string)
        var hexString = ""
        for (i in  [...Array(string.length)]) {
            hexString += string.charCodeAt(i).toString(16)
        }
        return hexString
    } 


}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}