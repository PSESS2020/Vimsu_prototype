class AchievementObserver extends Observer{
    // TODO this needs to know on which level to unlock the doors

    #doorList

    constructor() {
        this.#doorList = []
    }

    addToUpdateList(obj) {
        this.#doorList.push(obj)
    }

    update(ppant, level) {

    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementObserver;
}