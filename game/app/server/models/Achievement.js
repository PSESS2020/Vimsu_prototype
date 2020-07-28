


module.exports = class Achievement {

    // all fields are public as this object is transferred to the client for direct use
    id
    title;
    icon;
    description;
    currentLevel;
    maxLevel;
    color;
    awardPoints;

    #taskType;

    constructor(id, title, icon, description, currentLevel, color, awardPoints, maxLevel, taskType) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.description = description;
        this.currentLevel = currentLevel;
        this.color = color;
        this.awardPoints = awardPoints;
        this.maxLevel = maxLevel;

        this.#taskType = taskType;
    }

    getTaskType() {
        return this.#taskType;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getAwardPoints() {
        return this.awardPoints;
    }

    equals(achievement) {
        return this.#taskType === achievement.getTaskType() && this.currentLevel === achievement.getCurrentLevel();
    }
}
