const TypeChecker = require("../../../client/shared/TypeChecker");
const AlgoLibrary = require("../../utils/AlgoLibrary");
const TypeOfTask = require("../../utils/TypeOfTask");
const LevelList = require("../customdatastructures/LevelList");
const TaskList = require("../customdatastructures/TaskList");
const Participant = require("../mapobjects/Participant");

/**
 * The Achievement Model
 * @module Achievement
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class Achievement {

    #id; #tasks; #title; #icon; #description; #levels;
    #amountLevels; #restrictions; #isSilent; #isHidden;
    #observer

    constructor (id, tasks, title, icon, description, levels, restrictions, isSilent, isHidden) {
        TypeChecker.isString(id);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);
        TypeChecker.isInstanceOf(levels, LevelList)
        TypeChecker.isInstanceOf(tasks, TaskList)
        // no typechecking for restrictions possible
        TypeChecker.isBoolean(isSilent)
        TypeChecker.isBoolean(isHidden)
        this.#id           = id; 
        this.#title        = title; 
        this.#icon         = icon; 
        this.#description  = description; 
        this.#tasks        = tasks
        this.#levels       = levels; 
        this.#amountLevels = levels.length; 
        this.#restrictions = restrictions; 
        this.#isSilent     = isSilent; 
        this.#isHidden     = isHidden;
    }

    // TODO
    // maybe add more getters and setters here

    isSilent() { return this.#isSilent }

    isHidden() { return this.#isHidden }

    getStateAtLevel (levelCount) {
        let level = this.#levels[levelCount - 1]
        let descrip = ( !level.hasCustomDescription ? this.getDescription : level.getDescription() )
        return {
            title:        this.getTitle(),
            description:  descrip,
            color:        level.getColor(),
            icon:         this.getIcon(),
            currentLevel: levelCount,
        }
    }

    addObserver (observer) {
        if (this.#observer) { /* throw error */ }
        else { this.#observer = observer }
    }

    caresAboutAtLeastOneTaskOf (taskList) {
        return this.#tasks.intersectsWith(taskList)
    }

    getNewLevelUnlocked (ppant) {
        TypeChecker.isInstanceOf(ppant, Participant)
        let currLevel = ppant.getCurrentLevelOfAchvm(this.#id)
        let maxUnlockLevel = 0
        for (let i = currLevel; i < this.#amountLevels; i++) {
            if (this.levels[i].checkForUnlock(ppant)) { maxUnlockLevel = (i + 1) } 
        }
        // if new level unlocked, inform observer
        return { unlockFlag: (currLevel < maxUnlockLevel), newLevel: Math.max(currLevel, maxUnlockLevel) }
    }

    fulfillsRestrictions (ppant) {
        TypeChecker.isInstanceOf(ppant, Participant)
        return AlgoLibrary.checkObjectMeetsSpecs(ppant, this.#restrictions)
    }

    informDoorsFor(ppant, level) { this.#observer.update(ppant, level) }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Achievement;
}
