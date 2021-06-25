// TODO
// turn into abstract class
class Observer {

    #listOfObjToUpdate

    constructor() { this.#listOfObjToUpdate = [] }

    addToUpdateList(obj) { this.#listOfObjToUpdate.push(obj) }

    update() { /* TODO  can't call on abstract parent */ }

}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = Observer;
}