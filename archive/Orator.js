const TypeChecker = require('../game/app/client/shared/TypeChecker.js');
var Position = require('../game/app/server/models/Position.js');
var Direction = require('../game/app/client/shared/Direction.js');
var Participant = require('../game/app/server/models/Participant.js');

module.exports = class Orator extends Participant {

    #ownLectureList;

    /**
     * @author Philipp
     * 
     * @param {String} id 
     * @param {Position} position 
     * @param {Direction} direction 
     * @param {Array of String} ownLectureList  //IDs von Lectures
     */
    constructor(id, position, direction, ownLectureList) {
        super(id, position, direction);
        TypeChecker.isInstanceOf(ownLectureList, Array);
        ownLectureList.forEach(lectureId => {
            TypeChecker.isString(lectureId);
        });

        this.#ownLectureList = ownLectureList;
    }

    getOwnLectureList() {
        return this.#ownLectureList;
    }
}