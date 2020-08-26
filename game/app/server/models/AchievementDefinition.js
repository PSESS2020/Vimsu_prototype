const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfTask = require('../utils/TypeOfTask');
const Achievement = require('./Achievement.js');

module.exports = class AchievementDefinition {

    #id;
    #taskType;
    #title;
    #icon;
    #description;
    #levels;

    /**
     * @constructor Creates an AchievementDefinition instance
     * 
     * @param {number} id achievement ID
     * @param {TypeOfTask} taskType achievement task type
     * @param {String} title achievement title
     * @param {String} icon achievement icon
     * @param {String} description achievement description
     * @param {{count: number, color: String, points: number}[]} levels achievement levels
     */
    constructor(id, taskType, title, icon, description, levels) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);
        TypeChecker.isInstanceOf(levels, Array);
        levels.forEach(element => {
            TypeChecker.isInstanceOf(element, Object);
            TypeChecker.isInt(element.count);
            TypeChecker.isString(element.color);
            TypeChecker.isInt(element.points);
        });

        this.#id = id;
        this.#taskType = taskType;
        this.#title = title;
        this.#icon = icon;
        this.#description = description;
        this.#levels = levels;
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
     * Gets achievement task type
     * 
     * @return taskType
     */
    getTaskType() {
        return this.#taskType;
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
     * Gets achievement levels
     * 
     * @return levels
     */
    getLevels() {
        return this.#levels;
    }

    /**
     * Creates an achievement instance based on current level
     * 
     * @param {number} currentLevel current level
     * 
     * @return Achievement instance
     */
    computeAchievement(currentLevel) {
        TypeChecker.isInt(currentLevel);
        var color = (currentLevel != 0) ? this.#levels[currentLevel - 1].color : 'darkslategray';
        var awardPoints = (currentLevel != 0) ? this.#levels[currentLevel - 1].points : 0;
        var nextCount = (currentLevel != this.#levels.length) ? this.#levels[currentLevel].count : undefined;
        return new Achievement(this.#id, this.#title, this.#icon, this.#description, currentLevel, color, awardPoints, this.#levels.length, this.#taskType, nextCount);
    }
}