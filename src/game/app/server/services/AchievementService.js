const TypeChecker = require('../../client/shared/TypeChecker.js');
const AchievementDefinition = require('../models/AchievementDefinition.js');
const TypeOfTask = require('../utils/TypeOfTask');
const Participant = require('../models/mapobjects/Participant');
const Achievement = require('../models/rewards/Achievement');
const AchievementFactory = require('../models/factories/AchievementFactory.js');
const AchievementDefinitions = require('../utils/AchievementDefinitions.js');
const AchievementObserver = require('../models/AchievementObserver.js');

/**
 * The Achievement Service
 * @module AchievementService
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AchievementService {

    #achievementsByTask
    #achievementsById
    #achievementsByName
    #achievementObservers
    #allAchievements
    #achvmtLibrary
    #achievementFactory

    /**
     * Creates an AchievementService instance. Singleton, so at most one instance of this class can exist at any given time.
     * @constructor module:AchievementService
     */
    constructor() {
        if (!!AchievementService.instance) {
            return AchievementService.instance;
        }

        this.#achvmtLibrary = new Library()

        this.#achievementsByTask = this.#initMapTaskToAchievements()
        this.#achievementsById = {}
        this.#achievementsByName = {}
        this.#achievementObservers = new Map()
        this.#allAchievements = []
        this.#achievementFactory = new AchievementFactory()
        this.#initAllAchievements();
        AchievementService.instance = this;
    }

    #initMapTaskToAchievements = function () {
        var mapTypeToAch = new Map()
        Object.values(TypeOfTask).forEach(type => mapTypeToAch.set(type, []))
        return mapTypeToAch
    }

    #initAllAchievements = function () {
        for (const [achvmtName, achvmtData] of Object.entries(AchievementDefinitions)) {
            var achvmt = this.#achievementFactory.createAchievement(achvmtName, achvmtData)
            Object.defineProperty(this.#achievementsById, achvmt.getId(), { value: achvmt })
            this.#allAchievements.push(achvmt)
            Object.defineProperty(this.#achievementsByName, achvmtName, { value: achvmt })
            achvmt.getTaskList().forEach( taskType => this.#achievementsByTask.get(taskType).push(achvmt) )
        }
    }

    // this method feels to inefficient to always use to calculate points
    #calculatePoints = function (ppant) {
        let awardPoints = 0
        for (const [achvmtId, level] of ppant.getAchievements().entries()) {
            // TODO error handling (when trying to get points fo no longer existing achvmt)
            awardPoints += this.#achievementsById[achvmtId].getPointsAtLevel(level)
        }
        for (const [task, counter] of ppant.getTaskCounters().entries()) {
            // for consistency reasons, it might be better to just
            // save the id in the ppant class and load these here from the service?
            awardPoints += (counter * task.getAwardPoints())
        }
        return awardPoints
    }

    getAchievementByTitle(title) {
        for (const achvmt of Object.values(this.#achievementsById)) {
            if (achvmt.getTitle() === title) { return achvmt }
        }
        return undefined      
    }

    /**
     * @method module:AchievementService#checkForAchievementEligibility
     */
    checkForNewLevelUnlock (ppant, performedTasks) {
        let newAchvmts = new Map()
        this.#allAchievements.filter( achvmt => (achvmt.fulfillsRestrictions(ppant) && achvmt.caresAboutAtLeastOneTaskOf(performedTasks)) ).forEach( achvmt => {
            const { unlockFlag, newLevel } = achvmt.getNewLevelUnlocked(ppant)
            if (unlockFlag) {
                ppant.updateLevelOfAchvmt(achvmt.getId(), newLevel)
                achvmt.informDoorsFor(ppant)
                newAchvmts.set(achvmt, newLevel)
            }
        })
        return newAchvmts
    }

    letDoorObserveForUnlock (door, { name, level }) {
        if (this.#achievementObservers.has(name)) {
            /* add door to the list of objects to be
               informed by that observer at unlock
               of that level*/
        } else {
            let observer = new AchievementObserver()
            this.#achievementObservers.set(name, observer)
            observer.addToUpdateList(door)
            
        }
    }

    #knowsObserverForAchvmt = function

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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementService;
}
