class AchievementObserver extends Observer{
    // TODO this needs to know on which level to unlock the doors

    constructor() {
        super()
    }

    addToUpdateList(door, level) {
        if (level === undefined) { /* TODO error handling */ }
        this.#listOfObjToUpdate.push({ door, level })
    }

    update(ppant, lvl) {
        this.#listOfObjToUpdate.filter( elem => elem.level === lvl ).forEach( elem =>  {
            const { door } = elem
            let ppantId = ppant.getId()
            if (!door.isOpenFor(ppantId)) { door.openDoorFor(ppantId) }
        })
    }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AchievementObserver;
}