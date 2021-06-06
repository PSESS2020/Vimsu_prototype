const Settings = require('../../client/utils/Settings');
const OneToOneChat = require('../models/OneToOneChat');
const TypeOfTask = require('./TypeOfTask');

/**
 * @module AchievementDefinitions
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const AchvmtConstants = Object.freeze({
    silver: '#D7D7D7',
    gold: '#C9B037'
})

const AchievementDefinitions = Object.freeze({
    // Redo the detail for all of these

    ach1: {
        task: { 
            typeOfTask: TypeOfTask.TALK, 
            detail: { class: "LectureChat" }
        }, // Type + additional data
        title: "Inquisitive", 
        icon: "question", // font-awesome
        description: "Ask questions in lectures to gain this achievement.", 
        levels: [
            { count: 5, color: '#D7D7D7', points: 15 },
            { count: 10, color: '#C9B037', points: 15 }
        ], 
        restrictions: ['$room.id==val', '$group.name==val'] //make it so the amout of equals signs only needs be >= 1
    },

    ach2: {
        task: { typeOfTask: TypeOfTask.MAKEFRIEND },
        title: "Network Guru",
        icon: "user-plus",
        description: "Befriend others to gain this achievement.",
        levels: [
            { count: 5, color: AchvmtConstants.silver, points: 100 },
            { count: 10, color: AchvmtConstants.gold, points: 100 }
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false }
    },

    ach3: {
        task: { 
            typeOfTask: TypeOfTask.VISIT, 
            detail: { class: "Room", id: Settings.FOODCOURT_ID }
        },
        title: "Coffee Time!",
        icon: "coffee",
        description: "Visit food court to gain this achievement.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 10 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    ach4: {
        task: { 
            typeOfTask: TypeOfTask.VISIT, 
            detail: { class: "Room", id: Settings.FOYER_ID }
        },
        title: "New World",
        icon: "globe",
        description: "Visit foyer to gain this achievement.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 10 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    ach5: {
        task: { 
            typeOfTask: TypeOfTask.VISIT, 
            detail: { class: "Room", id: Settings.RECEPTION_ID }
        },
        title: "Back to the Start...",
        icon: "user",
        description: "Re-visit the reception room to gain this achievement.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 10 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: true },
    },

    ach6: {
        task: { 
            typeOfTask: TypeOfTask.VISIT, 
            detail: { class: "Lecture" }
        },
        title: "Good Listener",
        icon: "headphones",
        description: "Visit lectures and stay until the end to gain this achievment.",
        levels: [
            { count: 5, color: AchvmtConstants.silver, points: 200 },
            { count: 5, color: AchvmtConstants.gold, points: 200 }
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },
 
    ach7: {
        task: { 
            typeOfTask: TypeOfTask.TALK, 
            detail: { class: "OneToOneChat", amountOfMessages: 0 } 
        },
        title: "Walky Talky",
        icon: "comment",
        description: "Start a private conversation with others to gain this achievement.",
        levels: [
            { count: 5, color: AchvmtConstants.silver, points: 50 },
            { count: 10, color: AchvmtConstants.gold, points: 50 }
        ],
        restrictions: ["$ppant.isModerator=={ isSilent: false, isHidden: false }"],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    ach8: {
        task: { 
            typeOfTask: TypeOfTask.INTERACT, 
            detail: { class: "NPC", name: "BasicTutorial", position: [Settings.RECEPTION_ID, 11, 6] } 
        },
        title: "Welcome!",
        icon: "info",
        description: "Talk to the NPC in the reception room to gain this achievement.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 15 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    ach9: {
        task: { 
            typeOfTask: TypeOfTask.INTERACT, 
            detail: { class: "NPC", name: "Chef", position: [Settings.FOODCOURT_ID, 18, 9] } 
        },
        title: "Let's do Lunch!",
        icon: "utensils",
        description: "Talk to the NPC in the food court to gain this achievment.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 15 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    ach10: {
        task: { 
            typeOfTask: TypeOfTask.INTERACT, 
            detail: { class: "NPC", name: "FoyerHelper", position: [Settings.FOYER_ID, 0, 0] } 
        },
        title: "Learn about Lectures",
        icon: "book",
        description: "Talk to the NPC in the foyer to gain this achievment.",
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 15 },
        ],
        restrictions: [],
        visibilityModifiers: { isSilent: false, isHidden: false },
    },

    testAch01: {
        title: "Around the world, around the world",
        icon: "globe",
        description: "Test Achievment. Tests each level having its own task. Tests no parallel counting.",
        task: [
            { typeOfTask: TypeOfTask.INTERACT,
              detail: { class: "NPC", name: "BasicTutorial", position: [Settings.RECEPTION_ID, 11, 6] } },
            { typeOfTask: TypeOfTask.INTERACT, 
              detail: { class: "NPC", name: "Chef", position: [Settings.FOODCOURT_ID, 18, 9] } },
            { typeOfTask: TypeOfTask.INTERACT, 
              detail: { class: "NPC", name: "FoyerHelper", position: [Settings.FOYER_ID, 0, 0] } },
        ],
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 15 },
            { count: 1, color: AchvmtConstants.gold, points: 15 },
            { count: 1, color: AchvmtConstants.gold, points: 15 },
        ],
        parallelCounting: false,
        // visibilityModifiers: NONE
        // restrictions: NONE
    },

    testAch02: {
        title: "Around the world in any order.",
        icon: "globe",
        description: "Test Achievment. Tests each level having its own task. Tests allowing  parallel counting.",
        task: [
            { typeOfTask: TypeOfTask.INTERACT,
              detail: { class: "NPC", name: "BasicTutorial", position: [Settings.RECEPTION_ID, 11, 6] } },
            { typeOfTask: TypeOfTask.INTERACT, 
              detail: { class: "NPC", name: "Chef", position: [Settings.FOODCOURT_ID, 18, 9] } },
            { typeOfTask: TypeOfTask.INTERACT, 
              detail: { class: "NPC", name: "FoyerHelper", position: [Settings.FOYER_ID, 0, 0] } },
        ],
        levels: [
            { count: 1, color: AchvmtConstants.gold, points: 15 },
            { count: 1, color: AchvmtConstants.gold, points: 15 },
            { count: 1, color: AchvmtConstants.gold, points: 15 },
        ],
        parallelCounting: true,
        // visibilityModifiers: NONE
        // restrictions: NONE
    },

    // One that tests OR of tasks
    testAch03: {
        title: "Around the world, around the world",
        icon: "globe",
        description: "Test Achievment. Tests one level having tree tasks, combined via OR.",
        task: { 
            typeOfTask: [ TypeOfTask.INTERACT, TypeOfTask.INTERACT, TypeOfTask.INTERACT ],
            detail: [
                { class: "NPC", name: "BasicTutorial", position: [Settings.RECEPTION_ID, 11, 6] },
                { class: "NPC", name: "Chef", position: [Settings.FOODCOURT_ID, 18, 9] },
                { class: "NPC", name: "FoyerHelper", position: [Settings.FOYER_ID, 0, 0] } 
            ]
        },
        levels: [
            { count: [ 1, 1, 1 ], color: AchvmtConstants.gold, points: 15 },
        ],
        //  parallelCounting: NOT NECESSARY,
        // visibilityModifiers: NONE
        // restrictions: NONE
    },
    // One that tests AND of tasks
    testAch03: {
        title: "Around the world, around the world",
        icon: "globe",
        description: "Test Achievment. Tests one level having tree tasks, combined via AND.",
        task: { 
            typeOfTask: [ [ TypeOfTask.INTERACT, TypeOfTask.INTERACT, TypeOfTask.INTERACT ] ],
            detail: [ [
                { class: "NPC", name: "BasicTutorial", position: [Settings.RECEPTION_ID, 11, 6] },
                { class: "NPC", name: "Chef", position: [Settings.FOODCOURT_ID, 18, 9] },
                { class: "NPC", name: "FoyerHelper", position: [Settings.FOYER_ID, 0, 0] } 
            ] ]
        },
        levels: [
            { count: [ [ 1, 1, 1 ] ], color: AchvmtConstants.gold, points: 15 },
        ],
        //  parallelCounting: NOT NECESSARY,
        // visibilityModifiers: NONE
        // restrictions: NONE
    },

})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementDefinitions;
}