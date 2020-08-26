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
     * @param {(senderID: String, username: String, messageID: number, timestamp: Date)} message 
     */
    appendMessage(message) {
        TypeChecker.isInstanceOf(message, Object);
        TypeChecker.isString(message.senderID);
        TypeChecker.isString(message.username);
        TypeChecker.isInt(message.messageID);
        TypeChecker.isDate(message.timestamp);
        
        this.#listOfMessages.push(message);
    }
}