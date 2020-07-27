var TypeChecker = require('../../utils/TypeChecker.js');
var Achievement = require('../models/Achievement.js');
var TypeOfTask = require('../../utils/TypeOfTask')

module.exports = class AchievementService {
    #achievements;

    constructor() {
        if(!!AchievementService.instance){
            return AchievementService.instance;
        }

        this.#achievements = [];
        this.initAllAchievements();
        AchievementService.instance = this;
    }

    getAllAchievements() {
        return this.#achievements;
    }

    getAchievement(achievementId) {
        TypeChecker.isInt(achievementId);

        let index = this.#achievements.findIndex(ach => ach.getId() === achievementId);

        if (index < 0) 
        {
            throw new Error(achievementId + " is not in list of achievements")
        }

        return this.#achievements[index];
    }

    initAllAchievements() {
        var id = 1;
        this.#achievements.push(new Achievement(id++, TypeOfTask.ASKQUESTIONINLECTURE, "Inquisitive", "question", "Ask questions in lectures to gain this achievement", [
            { count: 5, color: '#D7D7D7', points: 15},
            { count: 10, color: '#C9B037', points: 15}
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.BEFRIENDOTHER, "Network Guru", "user-plus", "Befriend other participants to gain this achievement", [
            { count: 5, color: '#D7D7D7', points: 100},
            { count: 10, color: '#C9B037' , points: 100}
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.FOODCOURTVISIT, "Bread & Butter", "cutlery", "Visit food court room to gain this achievement", [
            { count: 1, color: '#C9B037' , points: 10},
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.FOYERVISIT, "New World", "globe", "Visit foyer room to gain this achievement", [
            { count: 1, color: '#C9B037' , points: 10},
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.INITPERSONALCHAT, "Walky Talky", "comment", "Interact with other participants to gain this achievement", [
            { count: 5, color: '#D7D7D7' , points: 50},
            { count: 10, color: '#C9B037', points: 50}
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.LECTUREVISIT, "Good Listener", "headphones", "Stay till the end of lectures to gain this achievement", [
            { count: 5, color: '#D7D7D7' , points: 200},
            { count: 10, color: '#C9B037', points: 200}
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.BASICTUTORIALCLICK, "First Greeting", "info", "Click on the NPC in the reception room to gain this achievement", [
            { count: 1, color: '#C9B037', points: 15},
        ]));
        this.#achievements.push(new Achievement(id++, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "Visit reception room to gain this achievement", [
            { count: 1, color: '#C9B037', points: 10},
        ]));
    }
} 