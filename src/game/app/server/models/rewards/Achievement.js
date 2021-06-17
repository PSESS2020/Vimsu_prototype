const TypeChecker = require("../../../client/shared/TypeChecker");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const TypeOfTask = require("../../utils/TypeOfTask");
const Participant = require("../mapobjects/Participant");

/**
 * The Achievement Model
 * @module Achievement
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class Achievement {

    #id; #task; #title; #icon; #description; #levels;
    #amountLevels; #restrictions; #isSilent; #isHidden

    constructor (id, task, title, icon, description, levels, restrictions, isSilent, isHidden) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);
        TypeChecker.isInstanceOf(levels, Array)
        levels.forEach( level => TypeChecker.isInstanceOf(level, Level) )
        // no typechecking for restrictions possible
        TypeChecker.isBoolean(isSilent)
        TypeChecker.isBoolean(isHidden)
        this.#id           = id; 
        this.#title        = title; 
        this.#icon         = icon; 
        this.#description  = description; 
        this.#levels       = levels; 
        this.#amountLevels = levels.length; 
        this.#restrictions = restrictions; 
        this.#isSilent     = isSilent; 
        this.#isHidden     = isHidden;
    }

    isSilent() { return this.#isSilent }

    isHidden() { return this.#isHidden }

    getState() {

    }

    checkEligibleToUnlockLevel (ppant) {

    }

    checkIfFulfillsRestrictions (ppant) {
        TypeChecker.isInstanceOf(ppant, Participant)
        return AlgoLibrary.checkObjectMeetsSpecs(ppant, this.#restrictions)
    }

    getPropertyOfLevel (propName, levelNumber) {
        // TODO
    }

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
    #opensDoorID;

    /**
     * Creates an Achievement instance
     * @constructor module:Achievement
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
     * @param {number} nextCount next participant's target to gain this achievement
     * @param {String} opensDoorID achieving this achievment at max level opens door with this doorID
     */
    constructor(id, title, icon, description, currentLevel, color, awardPoints, maxLevel, taskType, nextCount, opensDoorID) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);
        // fix Type checking
        TypeChecker.isInt(currentLevel);
        TypeChecker.isString(color);
        TypeChecker.isInt(awardPoints);
        TypeChecker.isInt(maxLevel);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        if (nextCount !== undefined)
            TypeChecker.isInt(nextCount);
        if (opensDoorID !== undefined)
            TypeChecker.isString(opensDoorID);

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
        this.#opensDoorID = opensDoorID;
    }

    /**
     * Gets achievement ID
     * @method module:Achievement#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id;
    }

    /**
     * Gets achievement title
     * @method module:Achievement#getTitle
     * 
     * @return {String} title
     */
    getTitle() {
        return this.#title;
    }

    /**
     * Gets achievement icon
     * @method module:Achievement#getIcon
     * 
     * @return {String} icon
     */
    getIcon() {
        return this.#icon;
    }

    /**
     * Gets achievement description
     * @method module:Achievement#getDescription
     * 
     * @return {String} description
     */
    getDescription() {
        return this.#description;
    }

    /**
     * Gets achievement task type
     * @method module:Achievement#getTaskType
     * 
     * @return {TypeOfTask} taskType
     */
    getTaskType() {
        return this.#taskType;
    }

    /**
     * Gets participant's current level of this achievement
     * @method module:Achievement#getCurrentLevel
     * 
     * @return {number} currentLevel
     */
    getCurrentLevel() {
        return this.#currentLevel;
    }

    /**
     * Gets current award points of this achievement
     * @method module:Achievement#getAwardPoints
     * 
     * @return {number} awardPoints
     */
    getAwardPoints() {
        return this.#awardPoints;
    }

    /**
     * Gets current color of this achievement
     * @method module:Achievement#getColor
     * 
     * @return {String} color
     */
    getColor() {
        return this.#color;
    }

    /**
     * Gets max level of this achievement
     * @method module:Achievement#getMaxLevel
     * 
     * @return {number} maxLevel
     */
    getMaxLevel() {
        return this.#maxLevel;
    }

    /**
     * Gets next participant's target to gain this achievement
     * @method module:Achievement#getNextCount
     * 
     * @return {number} nextCount
     */
    getNextCount() {
        return this.#nextCount;
    }

    /**
     * If this achieving this achievement opens a door, returns doorID of this door. Otherwise undefined
     * @method module:Achievment#getOpensDoorID
     * 
     * @return {String} opensDoorID
     */
    getOpensDoorID() {
        return this.#opensDoorID;
    }

    /**
     * Sets current level
     * @method module:Achievement#setCurrentLevel
     * 
     * @param {number} currentLevel currentLevel
     */
    setCurrentLevel(currentLevel) {
        TypeChecker.isInt(currentLevel);
        this.#currentLevel = currentLevel;
    }

    /**
     * Sets achievement color
     * @method module:Achievement#setColor
     * 
     * @param {String} color color
     */
    setColor(color) {
        TypeChecker.isString(color);
        this.#color = color;
    }

    /**
     * Sets current award points
     * @method module:Achievement#setAwardPoints
     * 
     * @param {number} awardPoints award points
     */
    setAwardPoints(awardPoints) {
        TypeChecker.isInt(awardPoints);
        this.#awardPoints = awardPoints;
    }

    /**
     * Sets next target
     * @method module:Achievement#setNextCount
     * 
     * @param {number|undefined} nextCount next target
     */
    setNextCount(nextCount) {
        if (nextCount !== undefined)
            TypeChecker.isInt(nextCount);

        this.#nextCount = nextCount;
    }

    /**
     * Checks if task type and current level matches an achievement
     * @method module:Achievement#equals
     * 
     * @param {Achievement} achievement achievement to compare
     * 
     * @return {boolean} true if matches, otherwise false
     */
    equals(achievement) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        return this.#taskType === achievement.getTaskType() && this.#currentLevel === achievement.getCurrentLevel();
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Achievement;
}
