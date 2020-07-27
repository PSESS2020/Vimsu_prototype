var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfTask = require('../../utils/TypeOfTask')

module.exports = class Task {

    #id;
    #task;
    #pointsAwarded;
    #achievements = [];

    constructor(id, completedTask, pointsAwarded) {
        TypeChecker.isString(id);
        TypeChecker.isEnumOf(completedTask, TypeOfTask);
        TypeChecker.isInt(pointsAwarded);

        this.#id = id;
        this.#task = completedTask;
        this.#pointsAwarded = pointsAwarded;

    }

    getId() {
        return this.#id
    }

    getCompletedTask() {
        return this.#task;
    }

    getPointsAwarded() {
        return this.#pointsAwarded;
    }

    getPossibleAchievements(completedAchievements) {
        //TODO
        switch(this.#completedTask) {
            case TypeOfTask.ASKQUESTIONINLECTURE:

            break;

            case TypeOfTask.BASICTUTORIALCLICK:

            break;

            case TypeOfTask.BEFRIENDOTHER:

            break;

            case TypeOfTask.FOODCOURTVISIT:

            break;

            case TypeOfTask.FOYERVISIT:

            break;

            case TypeOfTask.INITPERSONALCHAT:

            break;

            case TypeOfTask.LECTUREVISIT:

            break;

            case TypeOfTask.RECEPTIONVISIT:

            break;
        }
    }
}