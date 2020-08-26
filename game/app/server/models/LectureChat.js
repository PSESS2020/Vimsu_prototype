const TypeChecker = require('../../client/shared/TypeChecker');

module.exports = class LectureChat {

    #listOfMessages;

    /**
     * @constructor Creates Lecture Chat instance
     */
    constructor() {
        this.#listOfMessages = [];
    }

    /**
     * Gets lecture chat messages
     * 
     * @return list of messages
     */
    getMessages() {
        return this.#listOfMessages;
    }

    /**
     * Appends lecture chat message
     * 
     * @param {(senderID: String, username: String, messageID: number, timestamp: Date)} message message
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