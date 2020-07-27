var TypeChecker = require('../../utils/TypeChecker.js');
var TypeOfTask = require('../../utils/TypeOfTask')

module.exports = class Achievement {

    #id;
    #task;
    #title;
    #icon;
    #description;
    #levels;

    constructor(id, task, title, icon, description, levels) {
        TypeChecker.isString(id);
        TypeChecker.isEnumOf(task, TypeOfTask);
        TypeChecker.isString(title);
        TypeChecker.isString(icon);
        TypeChecker.isString(description);

        this.#id = id;
        this.#task = task;
        this.#title = title;
        this.#icon = icon;
        this.#description = description;
        this.#levels = levels;
    }

    getId() {
        return this.#id;
    }

    getTask() {
        return this.#task;
    }

    getTitle() {
        return this.#title;
    }

    getIcon() {
        return this.#icon;
    }

    getDescription() {
        return this.#description;
    }

    getLevels() {
        return this.#levels;
    }
}