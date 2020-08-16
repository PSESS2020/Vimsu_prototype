module.exports = class Achievement {

    #id
    #title;
    #icon;
    #description;
    #currentLevel;
    #maxLevel;
    #color;
    #awardPoints;
    #taskType;

    constructor(id, title, icon, description, currentLevel, color, awardPoints, maxLevel, taskType) {
        this.#id = id;
        this.#title = title;
        this.#icon = icon;
        this.#description = description;
        this.#currentLevel = currentLevel;
        this.#color = color;
        this.#awardPoints = awardPoints;
        this.#maxLevel = maxLevel;
        this.#taskType = taskType;
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getIcon() {
        return this.#icon;
    }

    getDescription() {
        return this.#description;
    }

    getTaskType() {
        return this.#taskType;
    }

    getCurrentLevel() {
        return this.#currentLevel;
    }

    getAwardPoints() {
        return this.#awardPoints;
    }

    getColor() {
        return this.#color;
    }

    getMaxLevel() {
        return this.#maxLevel;
    }

    setCurrentLevel(currentLevel) {
        this.#currentLevel = currentLevel;
    }

    setColor(color) {
        this.#color = color;
    }

    setAwardPoints(awardPoints) {
        this.#awardPoints = awardPoints;
    }

    equals(achievement) {
        return this.#taskType === achievement.getTaskType() && this.#currentLevel === achievement.getCurrentLevel();
    }
}
