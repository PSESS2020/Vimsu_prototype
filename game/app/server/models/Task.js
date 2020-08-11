const TypeChecker = require('../../client/shared/TypeChecker.js');
var TypeOfTask = require('../../utils/TypeOfTask')

module.exports = class Task {

    #id;
    #taskType;
    #awardPoints;

    constructor(id, taskType, awardPoints) {
        TypeChecker.isInt(id);
        TypeChecker.isEnumOf(taskType, TypeOfTask);
        TypeChecker.isInt(awardPoints);

        this.#id = id;
        this.#taskType = taskType;
        this.#awardPoints = awardPoints;
    }

    getId() {
        return this.#id
    }

    getTaskType() {
        return this.#taskType;
    }

    getAwardPoints() {
        return this.#awardPoints;
    }
}