const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfTask = require('../utils/TypeOfTask');
const Achievement = require('./Achievement.js');

/**
 * The Achievement Definition Model
 * @module AchievementDefinition
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AchievementDefinition {

    #id;
    #taskType;
    #title;
    #icon;
    #description;
    #levels;
    #opensDoorID;

    /**
     * Creates an instance of AchievementDefinition
     * @constructor module:AchievementDefinition 
     * 
     * @param {number} id achievement ID
     * @param {TypeOfTask} taskType achievement task type
     * @param {String} title achievement title
     * @param {String} icon achievement icon
     * @param {String} description achievement description
     * @param {{count: number, color: String, points: number}} levels achievement levels
     * @param {String} opensDoorID achieving this achievment opens door with this doorID
     */
    constructor(id, taskType, title, icon, description, levels, opensDoorID) {
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
        if (opensDoorID !== undefined)
            TypeChecker.isString(opensDoorID);

        this.#id = id;
        this.#taskType = taskType;
        this.#title = title;
        this.#icon = icon;
        this.#description = description;
        this.#levels = levels;
        this.#opensDoorID = opensDoorID;
    }

    /**
     * Gets achievement ID
     * @method module:AchievementDefinition#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets achievement task type
     * @method module:AchievementDefinition#getTaskType
     * 
     * @return {TypeOfTask} taskType
     */
    getTaskType() {
        return this.#taskType;
    }

    /**
     * Gets achievement title
     * @method module:AchievementDefinition#getTitle
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets achievement icon
     * @method module:AchievementDefinition#getIcon
     * 
     * @return {String} icon
     */
    getIcon() {
        return this.#icon;
    }

    /**
     * Gets achievement description
     * @method module:AchievementDefinition#getDescription
     * 
     * @return {String} description
     */
    getDescription() {
        return this.#description;
    }

    /**
     * Gets achievement levels
     * @method module:AchievementDefinition#getLevels
     * 
     * @return {Object} levels
     */
    getLevels() {
        return this.#levels;
    }

    /**
     * If this achieving this achievement opens a door, returns doorID of this door. Otherwise undefined
     * @method module:AchievmentDefinition#getOpensDoorID
     * 
     * @return {String} opensDoorID
     */
    getOpensDoorID() {
        return this.#opensDoorID;
    }

    /**
     * Creates an achievement instance based on current level
     * @method module:AchievementDefinition#computeAchievement
     * 
     * @param {number} currentLevel current level
     * 
     * @return {Achievement} Achievement instance
     */
    computeAchievement(currentLevel) {
        TypeChecker.isInt(currentLevel);
        var color = (currentLevel != 0) ? this.#levels[currentLevel - 1].color : 'darkslategray';
        var awardPoints = (currentLevel != 0) ? this.#levels[currentLevel - 1].points : 0;
        var nextCount = (currentLevel != this.#levels.length) ? this.#levels[currentLevel].count : undefined;
        return new Achievement(this.#id, this.#title, this.#icon, this.#description, currentLevel, color, awardPoints, this.#levels.length, this.#taskType, nextCount, this.#opensDoorID);
    }
}