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

    createAchievement (achvmtData) {
        // Deconstruct
        const { task, title, icon, description, levels, restriction: restrictions } = achvmtData
        const { typeOfTask, detail } = task
        let achvmtId = `${Settings.CONFERENCE_ID}_${title}_${task}_${restrictions.reduce( (acc, val) => `${val}#${acc.slice(1)}`)}`
        // handle restrictions
        // handle details
        // add to AchievementService
        // add observers for door opening
        return new Achievement(achvmtId, title, icon, description, typeOfTask, detail, levels, restrictions)
    }


}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}