


module.exports = class Achievement {

    // all fields are public as this object is transferred to the client for direct use
    title;
    icon;
    description;
    currentLevel;
    maxLevel;
    color;

    #taskType;

    constructor(title, icon, description, currentLevel, color, maxLevel, taskType) {
        this.title = title;
        this.icon = icon;
        this.description = description;
        this.currentLevel = currentLevel;
        this.color = color;
        this.maxLevel = maxLevel;

        this.#taskType = taskType;
    }

    getTaskType() {
        return this.#taskType;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    equals(achievement) {
        return this.#taskType === achievement.getTaskType() && this.currentLevel === achievement.getCurrentLevel();
    }
}
