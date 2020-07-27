var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfTask = require('../../utils/TypeOfTask');
const Achievement = require('./Achievement.js');

module.exports = class AchievementDefinition {

    #id;
    #taskType;
    #title;
    #icon;
    #description;
    #levels;
    #currentLevel;

    constructor(id, taskType, title, icon, description, levels) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);

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

    computeAchievement(currentLevel) {
        var color = (currentLevel != 0) ? this.#levels[currentLevel - 1].color : 'darkslategray';
        return new Achievement(this.#title, this.#icon, this.#description, currentLevel, color, this.#levels.length, this.#taskType);
    }
}