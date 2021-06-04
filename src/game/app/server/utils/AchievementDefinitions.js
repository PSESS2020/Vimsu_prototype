const TypeOfTask = require('./TypeOfTask');

/**
 * @module AchievementDefinitions
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const AchievementDefinitions = Object.freeze({

    ach1: { 
        id: 1, // generate during runtime instead
        TypeOfTask: TypeOfTask.ASKQUESTIONINLECTURE, // Type + additional data
        title: "Inquisitive", 
        icon: "question", // font-awesome
        description: "Ask questions in lectures to gain this achievement.", 
        levelData: [
            { count: 5, color: '#D7D7D7', points: 15 },
            { count: 10, color: '#C9B037', points: 15 }
        ], 
        opensDoor: undefined // will be removed
    },
 
    /*
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
    ], 'F0T1_0');

    this.#achievementDefinitions[TypeOfTask.RECEPTIONVISIT] = new AchievementDefinition(8, TypeOfTask.RECEPTIONVISIT, "Vimsu Associate", "user", "Visit reception room to gain this achievement.", [
        { count: 1, color: '#C9B037', points: 10 },
    ], undefined);

    this.#achievementDefinitions[TypeOfTask.CHEFCLICK] = new AchievementDefinition(9, TypeOfTask.CHEFCLICK, "Cooking Guru", "utensils", "Click on the NPC in the food court room to gain this achievement.", [
        { count: 1, color: '#C9B037', points: 15 },
    ], 'F2T1_0');

    this.#achievementDefinitions[TypeOfTask.FOYERHELPERCLICK] = new AchievementDefinition(10, TypeOfTask.FOYERHELPERCLICK, "Lecture Guru", "book", "Click on the NPC in the foyer room to gain this achievement.", [
        { count: 1, color: '#C9B037', points: 15 },
    ], undefined);
    */
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementDefinitions;
}