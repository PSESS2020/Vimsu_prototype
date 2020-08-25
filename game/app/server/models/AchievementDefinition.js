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
     * 
     * @param {int} id 
     * @param {TypeOfTask} taskType 
     * @param {String} title 
     * @param {String} icon 
     * @param {String} description 
     * @param {Array of Object (includes count, color, points)} levels 
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

    getId() {
        return this.#id;
    }

    getTaskType() {
        return this.#taskType;
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

    getLevels() {
        return this.#levels;
    }

    /**
     * 
     * @param {int} currentLevel 
     */
    computeAchievement(currentLevel) {
        TypeChecker.isInt(currentLevel);
        var color = (currentLevel != 0) ? this.#levels[currentLevel - 1].color : 'darkslategray';
        var awardPoints = (currentLevel != 0) ? this.#levels[currentLevel - 1].points : 0;
        var nextCount = (currentLevel != this.#levels.length) ? this.#levels[currentLevel].count : undefined;
        return new Achievement(this.#id, this.#title, this.#icon, this.#description, currentLevel, color, awardPoints, this.#levels.length, this.#taskType, nextCount);
    }
}