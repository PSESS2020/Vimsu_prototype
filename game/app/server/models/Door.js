var TypeChecker = require('../../utils/TypeChecker.js');
var Position = require('./Position.js');

module.exports = class Door {

    #id;
    #targetPosition;

    /**
     * @author Philipp
     * 
     * @param {int} id 
     * @param {Position} targetPosition 
     */
    constructor(id, targetPosition) {
        TypeChecker.isInt(id);
        TypeChecker.isInstanceOf(targetPosition, Position);

        this.#id = id;
        this.#targetPosition = targetPosition;
    }

    getTargetPosition() {
        return this.#targetPosition;
    }
}