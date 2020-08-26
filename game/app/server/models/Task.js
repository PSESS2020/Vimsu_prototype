const TypeChecker = require('../../client/shared/TypeChecker.js');
const TypeOfTask = require('../utils/TypeOfTask')

module.exports = class Task {

    #id;
    #taskType;
    #awardPoints;

    /**
     * @constructor Creates a Task instance
     * 
     * @param {number} id task ID
     * @param {TypeOfTask} taskType task type
     * @param {number} awardPoints task award points
     */
    constructor(id, taskType, awardPoints) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isInt(awardPoints);

        this.#id = id;
        this.#taskType = taskType;
        this.#awardPoints = awardPoints;
    }

    /**
     * Gets task ID
     * 
     * @return id
     */
    getId() {
        return this.#id
    }

    /**
     * Gets task type
     * 
     * @return taskType
     */
    getTaskType() {
        return this.#taskType;
    }

    /**
     * Gets award points
     * 
     * @return awardPoints
     */
    getAwardPoints() {
        return this.#awardPoints;
    }
}