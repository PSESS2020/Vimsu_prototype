const TypeChecker = require('../../../client/shared/TypeChecker.js');
const AlgoLibrary = require('../../utils/AlgoLibrary.js');
const TypeOfTask = require('../../utils/TypeOfTask')

/**
 * The Task Model
 * @module Task
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Task {

    #id;
    #taskType;
    #awardPoints;
    #detail;

    /**
     * Creates a Task instance
     * @constructor module:Task
     * 
     * @param {number} id task ID
     * @param {TypeOfTask} taskType task type
     * @param {number} awardPoints task award points
     */
    constructor(id, taskType, detail, points) {
        TypeChecker.isString(id);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isInt(awardPoints);

        this.#id = id;
        this.#taskType = taskType;
        this.#detail = detail;
        this.#awardPoints = points;
    }

    /**
     * Gets task ID
     * @method module:Task#getId
     * 
     * @return {number} id
     */
    getId() {
        return this.#id
    }

    /**
     * Gets task type
     * @method module:Task#getTaskType
     * 
     * @return {String} taskType
     */
    getTaskType() {
        return this.#taskType;
    }

    /**
     * Gets award points
     * @method module:Task#getAwardPoints
     * 
     * @return {number} awardPoints
     */
    getAwardPoints() {
        return this.#awardPoints;
    }

    checkIfWasPerformed(typeOfTask, contextObj) {
        if (this.#taskType !== typeOfTask) { return false }
        else { return AlgoLibrary.checkObjectMeetsSpecs(contextObj, this.#detail) }
    }

}
