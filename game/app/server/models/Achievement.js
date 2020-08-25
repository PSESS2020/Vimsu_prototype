const TypeChecker = require("../../client/shared/TypeChecker");
const TypeOfTask = require("../utils/TypeOfTask");

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
    #nextCount;

    /**
     * 
     * @param {number} id 
     * @param {String} title 
     * @param {String} icon 
     * @param {String} description 
     * @param {number} currentLevel 
     * @param {String} color 
     * @param {number} awardPoints 
     * @param {number} maxLevel 
     * @param {TypeOfTask} taskType 
     * @param {number} nextCount 
     */
    constructor(id, title, icon, description, currentLevel, color, awardPoints, maxLevel, taskType, nextCount) {
        TypeChecker.isInt(id);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);
        TypeChecker.isInt(currentLevel);
        TypeChecker.isString(color);
        TypeChecker.isInt(awardPoints);
        TypeChecker.isInt(maxLevel);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        if(nextCount !== undefined)
            TypeChecker.isInt(nextCount);

        this.#id = id;
        this.#title = title;
        this.#icon = icon;
        this.#description = description;
        this.#currentLevel = currentLevel;
        this.#color = color;
        this.#awardPoints = awardPoints;
        this.#maxLevel = maxLevel;
        this.#taskType = taskType;
        this.#nextCount = nextCount;
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

    getNextCount() {
        return this.#nextCount;
    }

    /**
     * 
     * @param {number} currentLevel 
     */
    setCurrentLevel(currentLevel) {
        TypeChecker.isInt(currentLevel);
        this.#currentLevel = currentLevel;
    }

    /**
     * 
     * @param {String} color 
     */
    setColor(color) {
        TypeChecker.isString(color);
        this.#color = color;
    }

    /**
     * 
     * @param {number} awardPoints 
     */
    setAwardPoints(awardPoints) {
        TypeChecker.isInt(awardPoints);
        this.#awardPoints = awardPoints;
    }

    /**
     * 
     * @param {number} nextCount 
     */
    setNextCount(nextCount) {
        TypeChecker.isInt(nextCount);
        this.#nextCount = nextCount;
    }

    /**
     * 
     * @param {Achievement} achievement 
     */
    equals(achievement) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        return this.#taskType === achievement.getTaskType() && this.#currentLevel === achievement.getCurrentLevel();
    }
}
