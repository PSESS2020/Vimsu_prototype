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
     * @constructor Creates an Achievement instance
     * 
     * @param {number} id achievement ID
     * @param {String} title achievement title
     * @param {String} icon achievement icon
     * @param {String} description achievement description
     * @param {number} currentLevel participant's current level of this achievement
     * @param {String} color current color of this achievement
     * @param {number} awardPoints current award points of this achievement
     * @param {number} maxLevel max level of this achievement
     * @param {TypeOfTask} taskType task type of achievement
     * @param {?number} nextCount next participant's target to gain this achievement
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

    /**
     * Gets achievement ID
     * 
     * @return id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets achievement title
     * 
     * @return title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets achievement icon
     * 
     * @return icon
     */
    getIcon() {
        return this.#icon;
    }

    /**
     * Gets achievement description
     * 
     * @return description
     */
    getDescription() {
        return this.#description;
    }

    /**
     * Gets achievement task type
     * 
     * @return taskType
     */
    getTaskType() {
        return this.#taskType;
    }

    /**
     * Gets participant's current level of this achievement
     * 
     * @return currentLevel
     */
    getCurrentLevel() {
        return this.#currentLevel;
    }

    /**
     * Gets current award points of this achievement
     * 
     * @return awardPoints
     */
    getAwardPoints() {
        return this.#awardPoints;
    }

    /**
     * Gets current color of this achievement
     * 
     * @return color
     */
    getColor() {
        return this.#color;
    }

    /**
     * Gets max level of this achievement
     * 
     * @return maxLevel
     */
    getMaxLevel() {
        return this.#maxLevel;
    }

    /**
     * Gets next participant's target to gain this achievement
     * 
     * @return nextCount
     */
    getNextCount() {
        return this.#nextCount;
    }

    /**
     * Sets current level
     * 
     * @param {number} currentLevel currentLevel
     */
    setCurrentLevel(currentLevel) {
        TypeChecker.isInt(currentLevel);
        this.#currentLevel = currentLevel;
    }

    /**
     * Sets achievement color
     * 
     * @param {String} color color
     */
    setColor(color) {
        TypeChecker.isString(color);
        this.#color = color;
    }

    /**
     * Sets current award points
     * 
     * @param {number} awardPoints award points
     */
    setAwardPoints(awardPoints) {
        TypeChecker.isInt(awardPoints);
        this.#awardPoints = awardPoints;
    }

    /**
     * Sets next target
     * 
     * @param {?number} nextCount next target
     */
    setNextCount(nextCount) {
        if (nextCount !== undefined)
            TypeChecker.isInt(nextCount);

        this.#nextCount = nextCount;
    }

    /**
     * Checks if task type and current level matches an achievement
     * 
     * @param {Achievement} achievement achievement to compare
     * 
     * @return true if matches, otherwise false
     */
    equals(achievement) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        return this.#taskType === achievement.getTaskType() && this.#currentLevel === achievement.getCurrentLevel();
    }
}
