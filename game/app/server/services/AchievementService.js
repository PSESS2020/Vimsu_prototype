var TypeChecker = require('../../utils/TypeChecker.js');
var AchievementDefinition = require('../models/AchievementDefinition.js');
var TypeOfTask = require('../../utils/TypeOfTask');
const Achievement = require('../models/Achievement.js');

module.exports = class AchievementService {
    #achievementDefinitions;

    constructor() {
        if(!!AchievementService.instance){
            return AchievementService.instance;
        }

        this.#achievementDefinitions = {};
        this.initAllAchievements();
        AchievementService.instance = this;
    }

    getAllAchievementDefinitions() {
        return this.#achievementDefinitions;
    }

    getAchievementDefinition(achievementDefinitionId) {
        TypeChecker.isInt(achievementDefinitionId);

        let index = this.#achievementDefinitions.findIndex(ach => ach.getId() === achievementDefinitionId);

        if (index < 0) 
        {
            throw new Error(achievementDefinitionId + " is not in list of achievement definitions.")
        }

        return this.#achievementDefinitions[index];
    }

    getAchievementDefinitionByTypeOfTask(achievmentTaskType) {
        TypeChecker.isString(achievmentTaskType);

        // could be done easier now that we use a dict
        let index = this.#achievementDefinitions.findIndex(ach => ach.getTask() === achievmentTaskType);

        if (index < 0) 
        {
            throw new Error(achievmentTaskType + " is not in list of achievement definitions.")
        }

        return this.#achievementDefinitions[index];
    }

    initAllAchievements() {
        var id = 0;

        this.#achievementDefinitions[TypeOfTask.ASKQUESTIONINLECTURE] = new AchievementDefinition(id, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "'Ask questions in lectures to gain this achievement.'", [
            { count: 5, color: '#D7D7D7', points: 15},
            { count: 10, color: '#C9B037', points: 15}
        ]);

        this.#achievementDefinitions[TypeOfTask.BEFRIENDOTHER] = new AchievementDefinition(id++, TypeOfTask.BEFRIENDOTHER, "Network Guru", "user-plus", "'Befriend other participants to gain this achievement.'", [
            { count: 5, color: '#D7D7D7', points: 100},
            { count: 10, color: '#C9B037' , points: 100}
        ]);

        this.#achievementDefinitions[TypeOfTask.FOODCOURTVISIT] = new AchievementDefinition(id++, TypeOfTask.FOODCOURTVISIT, "Bread & Butter", "cutlery", "'Visit food court room to gain this achievement.'", [
            { count: 1, color: '#C9B037' , points: 10},
        ]);

        this.#achievementDefinitions[TypeOfTask.FOYERVISIT] = new AchievementDefinition(id++, TypeOfTask.FOYERVISIT, "New World", "globe", "'Visit foyer room to gain this achievement.'", [
            { count: 1, color: '#C9B037' , points: 10},
        ]);

        this.#achievementDefinitions[TypeOfTask.INITPERSONALCHAT] = new AchievementDefinition(id++, TypeOfTask.INITPERSONALCHAT, "Walky Talky", "comment", "'Interact with other participants to gain this achievement.'", [
            { count: 5, color: '#D7D7D7' , points: 50},
            { count: 10, color: '#C9B037', points: 50}
        ]);

        this.#achievementDefinitions[TypeOfTask.LECTUREVISIT] = new AchievementDefinition(id++, TypeOfTask.LECTUREVISIT, "Good Listener", "headphones", "'Stay till the end of lectures to gain this achievement.'", [
            { count: 5, color: '#D7D7D7' , points: 200},
            { count: 10, color: '#C9B037', points: 200}
        ]);

        this.#achievementDefinitions[TypeOfTask.BASICTUTORIALCLICK] = new AchievementDefinition(id++, TypeOfTask.BASICTUTORIALCLICK, "First Greeting", "info", "'Click on the NPC in the reception room to gain this achievement.'", [
            { count: 1, color: '#C9B037', points: 15},
        ]);

        this.#achievementDefinitions[TypeOfTask.NPCCLICK] = new AchievementDefinition(id++, TypeOfTask.NPCCLICK, "Good Reader", "book", "'Click on the NPC in the other room to gain this achievement.'", [
            { count: 1, color: '#D7D7D7', points: 15},
            { count: 2, color: '#C9B037', points: 15},
        ]);
        
        this.#achievementDefinitions[TypeOfTask.RECEPTIONVISIT] = new AchievementDefinition(id++, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "'Visit reception room to gain this achievement.' Now click on the NPC in this room!", [
            { count: 1, color: '#C9B037', points: 10},
        ]);
    }

    computeAchievements(participant) {
        var taskTypeCountMapping = participant.getTaskTypeMappingCounts();
        var achievements = [];
        

        Object.keys(taskTypeCountMapping).forEach((taskType) => {
            var achievementDefinition = this.#achievementDefinitions[taskType];
            var count = taskTypeCountMapping[taskType];

            var currentLevel = this.getLevelFromDefinition(count, achievementDefinition.getLevels())

            // could move the computation logic to achievementDefinition

            achievements.push(achievementDefinition.computeAchievement(currentLevel))
        });

        var newAchievements = [];
        for (var i = 0; i < achievements.length; i++) {
            if (!this.containsAchievement(achievements[i], participant.getAchievements())) {
                newAchievements.push(achievements[i]);
                participant.addAwardPoints(achievements[i].getAwardPoints());
            }
        }

        console.log("Achivements: " + newAchievements.length);

        participant.setAchievements(achievements);

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