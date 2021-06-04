const AchievementService = require("../../services/AchievementService");

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

    


}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementFactory;
}