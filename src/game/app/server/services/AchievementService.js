const TypeChecker = require('../../client/shared/TypeChecker.js');
const AchievementDefinition = require('../models/AchievementDefinition.js');
const TypeOfTask = require('../utils/TypeOfTask');
const Participant = require('../models/Participant');
const Achievement = require('../models/Achievement');

/**
 * The Achievement Service
 * @module AchievementService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AchievementService {
    #achievementDefinitions;

    /**
     * Creates an AchievementService instance. Singleton, so at most one instance of this class can exist at any given time.
     * @constructor module:AchievementService
     */
    constructor() {
        if (!!AchievementService.instance) {
            return AchievementService.instance;
        }

        this.#achievementDefinitions = {};
        this.#initAllAchievements();
        AchievementService.instance = this;
    }

    /**
     * Gets achievement definition based on task type
     * @method module:AchievementService#getAchievementDefinition
     * 
     * @param {TypeOfTask} achievementTaskType task type
     * 
     * @return {AchievementDefinition} AchievementDefinition instance
     */
    getAchievementDefinition(achievementTaskType) {
        TypeChecker.isEnumOf(achievementTaskType, TypeOfTask);

        return this.#achievementDefinitions[achievementTaskType];
    }

    /**
     * Initializes all achievements
     * @private private method
     * @method module:AchievementService#initAllAchievments
     */
    #initAllAchievements = function () {
        this.#achievementDefinitions[TypeOfTask.ASKQUESTIONINLECTURE] = new AchievementDefinition(1, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "Ask questions in lectures to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 15 },
            { count: 10, color: '#C9B037', points: 15 }
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.BEFRIENDOTHER] = new AchievementDefinition(2, TypeOfTask.BEFRIENDOTHER, "Network Guru", "user-plus", "Befriend others to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 100 },
            { count: 10, color: '#C9B037', points: 100 }
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.FOODCOURTVISIT] = new AchievementDefinition(3, TypeOfTask.FOODCOURTVISIT, "Coffee Time", "coffee", "Visit food court room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.FOYERVISIT] = new AchievementDefinition(4, TypeOfTask.FOYERVISIT, "New World", "globe", "Visit foyer room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.INITPERSONALCHAT] = new AchievementDefinition(5, TypeOfTask.INITPERSONALCHAT, "Walky Talky", "comment", "Start a private conversation with others to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 50 },
            { count: 10, color: '#C9B037', points: 50 }
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.LECTUREVISIT] = new AchievementDefinition(6, TypeOfTask.LECTUREVISIT, "Good Listener", "headphones", "Stay till the end of lectures to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 200 },
            { count: 10, color: '#C9B037', points: 200 }
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.BASICTUTORIALCLICK] = new AchievementDefinition(7, TypeOfTask.BASICTUTORIALCLICK, "First Greeting", "info", "Click on the NPC in the reception room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ], 'F3T1');

        this.#achievementDefinitions[TypeOfTask.RECEPTIONVISIT] = new AchievementDefinition(8, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "Visit reception room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ], undefined);

        this.#achievementDefinitions[TypeOfTask.CHEFCLICK] = new AchievementDefinition(9, TypeOfTask.CHEFCLICK, "Cooking Guru", "utensils", "Click on the NPC in the food court room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ], 'F2T1');

        this.#achievementDefinitions[TypeOfTask.FOYERHELPERCLICK] = new AchievementDefinition(10, TypeOfTask.FOYERHELPERCLICK, "Lecture Guru", "book", "Click on the NPC in the foyer room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ], undefined);

    }

    /**
     * Gets all achievements of a participant
     * @method module:AchievementService#getAllAchievements
     * 
     * @param {Participant} participant participant
     * 
     * @return {Achievement[]} Array of achievements
     */
    getAllAchievements(participant) {
        TypeChecker.isInstanceOf(participant, Participant);

        var taskTypeCountMapping = participant.getTaskTypeMappingCounts();
        var achievements = [];

        Object.keys(taskTypeCountMapping).forEach((taskType) => {
            var achievementDefinition = this.#achievementDefinitions[taskType];

            var count = taskTypeCountMapping[taskType];

            var currentLevel = this.#getLevelFromDefinition(count, achievementDefinition.getLevels())

            // could move the computation logic to achievementDefinition

            achievements.push(achievementDefinition.computeAchievement(currentLevel))
        });

        return achievements;
    }

    /**
     * Computes new possible achievements of a participant. Additionally set achievements in the participant instance if no achievement is found
     * @method module:AchievementService#computeAchievements
     * 
     * @param {Participant} participant participant
     * 
     * @return {Achievement[]} Array of new achievements
     */
    computeAchievements(participant) {
        TypeChecker.isInstanceOf(participant, Participant);

        var achievements = this.getAllAchievements(participant);

        var newAchievements = [];
        for (var i = 0; i < achievements.length; i++) {
            if (!this.#containsAchievement(achievements[i], participant.getAchievements())) {
                newAchievements.push(achievements[i]);
                participant.addAwardPoints(achievements[i].getAwardPoints());
            }
        }

        if (participant.getAchievements().length < 1) {
            participant.setAchievements(achievements);
        } else {
            if (newAchievements.length > 0) {
                newAchievements.forEach(achievement => {
                    let index = participant.getAchievements().findIndex(ach => ach.getId() === achievement.getId());

                    if (index < 0) {
                        throw new Error(achievement.getId() + " is not found in list of achievements!")
                    }

                    participant.getAchievements()[index].setCurrentLevel(achievement.getCurrentLevel());
                    participant.getAchievements()[index].setAwardPoints(achievement.getAwardPoints());
                    participant.getAchievements()[index].setColor(achievement.getColor());
                    participant.getAchievements()[index].setNextCount(achievement.getNextCount());
                })

            }
        }

        return newAchievements;
    }

    /**
     * Gets achievement level based on the count
     * @private private method
     * @method module:AchievementService#getLevelFromDefinition
     * 
     * @param {number} count achievement's count 
     * @param {{count: number, color: String, points: number}} levels achievement's levels
     * 
     * @return {number} level
     */
    #getLevelFromDefinition = function (count, levels) {
        TypeChecker.isInt(count);
        TypeChecker.isInstanceOf(levels, Array);
        levels.forEach(element => {
            TypeChecker.isInstanceOf(element, Object);
            TypeChecker.isInt(element.count);
            TypeChecker.isString(element.color);
            TypeChecker.isInt(element.points);
        });

        var level = 0;
        while (level < levels.length && count >= levels[level].count) {
            level++;
        }
        return level;
    }

    /**
     * Checks if the list of latest achievements contains an achievement
     * @private private method
     * @method module:AchievementService#containsAchievement
     * 
     * @param {Achievement} achievement achievement
     * @param {Achievement[]} oldAchievements old achievements
     * 
     * @return {boolean} true if the latest achievements contains the achievement, otherwise false
     */
    #containsAchievement = function (achievement, oldAchievements) {
        TypeChecker.isInstanceOf(achievement, Achievement);
        TypeChecker.isInstanceOf(oldAchievements, Array);
        oldAchievements.forEach(oldAch => {
            TypeChecker.isInstanceOf(oldAch, Achievement);
        })

        if (achievement.getCurrentLevel() === 0) return true;

        for (var i = 0; i < oldAchievements.length; i++) {
            if (oldAchievements[i].equals(achievement)) {
                return true;
            }
        }
        return false;
    }
} 
