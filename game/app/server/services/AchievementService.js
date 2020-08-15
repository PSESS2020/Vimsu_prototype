const TypeChecker = require('../../client/shared/TypeChecker.js');
const AchievementDefinition = require('../models/AchievementDefinition.js');
const TypeOfTask = require('../../utils/TypeOfTask');

module.exports = class AchievementService {
    #achievementDefinitions;

    constructor() {
        if (!!AchievementService.instance) {
            return AchievementService.instance;
        }

        this.#achievementDefinitions = {};
        this.initAllAchievements();
        AchievementService.instance = this;
    }

    getAllAchievementDefinitions() {
        return this.#achievementDefinitions;
    }

    getAchievementDefinitionByTypeOfTask(achievementTaskType) {
        TypeChecker.isString(achievementTaskType);

        return this.#achievementDefinitions[achievementTaskType];
    }

    initAllAchievements() {
        var id = 0;

        this.#achievementDefinitions[TypeOfTask.ASKQUESTIONINLECTURE] = new AchievementDefinition(1, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "Ask questions in lectures to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 15 },
            { count: 10, color: '#C9B037', points: 15 }
        ]);

        this.#achievementDefinitions[TypeOfTask.BEFRIENDOTHER] = new AchievementDefinition(2, TypeOfTask.BEFRIENDOTHER, "Network Guru", "user-plus", "Befriend other participants to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 100 },
            { count: 10, color: '#C9B037', points: 100 }
        ]);

        this.#achievementDefinitions[TypeOfTask.FOODCOURTVISIT] = new AchievementDefinition(3, TypeOfTask.FOODCOURTVISIT, "Coffee Time", "coffee", "Visit food court room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ]);

        this.#achievementDefinitions[TypeOfTask.FOYERVISIT] = new AchievementDefinition(4, TypeOfTask.FOYERVISIT, "New World", "globe", "Visit foyer room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ]);

        this.#achievementDefinitions[TypeOfTask.INITPERSONALCHAT] = new AchievementDefinition(5, TypeOfTask.INITPERSONALCHAT, "Walky Talky", "comment", "Interact with other participants to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 50 },
            { count: 10, color: '#C9B037', points: 50 }
        ]);

        this.#achievementDefinitions[TypeOfTask.LECTUREVISIT] = new AchievementDefinition(6, TypeOfTask.LECTUREVISIT, "Good Listener", "headphones", "Stay till the end of lectures to gain this achievement.", [
            { count: 5, color: '#D7D7D7', points: 200 },
            { count: 10, color: '#C9B037', points: 200 }
        ]);

        this.#achievementDefinitions[TypeOfTask.BASICTUTORIALCLICK] = new AchievementDefinition(7, TypeOfTask.BASICTUTORIALCLICK, "First Greeting", "info", "Click on the NPC in the reception room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ]);

        this.#achievementDefinitions[TypeOfTask.RECEPTIONVISIT] = new AchievementDefinition(8, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "Visit reception room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 10 },
        ]);

        this.#achievementDefinitions[TypeOfTask.CHEFCLICK] = new AchievementDefinition(9, TypeOfTask.CHEFCLICK, "Cooking Guru", "cutlery", "Click on the NPC in the food court room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ]);

        this.#achievementDefinitions[TypeOfTask.FOYERHELPERCLICK] = new AchievementDefinition(10, TypeOfTask.FOYERHELPERCLICK, "Lecture Guru", "book", "Click on the NPC in the foyer room to gain this achievement.", [
            { count: 1, color: '#C9B037', points: 15 },
        ]);

    }

    getAllAchievements(participant) {
        var taskTypeCountMapping = participant.getTaskTypeMappingCounts();
        var achievements = [];

        Object.keys(taskTypeCountMapping).forEach((taskType) => {
            var achievementDefinition = this.#achievementDefinitions[taskType];
            var count = taskTypeCountMapping[taskType];

            var currentLevel = this.getLevelFromDefinition(count, achievementDefinition.getLevels())

            // could move the computation logic to achievementDefinition

            achievements.push(achievementDefinition.computeAchievement(currentLevel))
        });

        return achievements;
    }

    computeAchievements(participant) {
        var achievements = this.getAllAchievements(participant);

        var newAchievements = [];
        for (var i = 0; i < achievements.length; i++) {
            if (!this.containsAchievement(achievements[i], participant.getAchievements())) {
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
                })

            }
        }

        return newAchievements;
    }

    getLevelFromDefinition(count, levels) {
        var level = 0;
        while (level < levels.length && count >= levels[level].count) {
            level++;
        }
        return level;
    }


    // required to check if list of latest achievements contains any new achievements
    containsAchievement(achievement, oldAchievements) {
        if (achievement.getCurrentLevel() === 0) return true;

        var i;
        for (i = 0; i < oldAchievements.length; i++) {
            if (oldAchievements[i].equals(achievement)) {
                return true;
            }
        }
        return false;
    }
} 