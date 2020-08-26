const Message = require('./Message');
const TypeChecker = require('../../client/shared/TypeChecker');

module.exports = class LectureChat {

    #listOfMessages;

    /**
     * 
     */
    constructor() {
        this.#listOfMessages = [];
    }

    getMessages() {
        return this.#listOfMessages;
    }

    /**
     * 
     * @param {Message} message 
     */
    appendMessage(message) {
        TypeChecker.isString(message, Message);
        
        this.#listOfMessages.push(message);
    }
}