const TypeChecker = require('../../client/shared/TypeChecker');

/**
 * The Lecture Chat Model
 * @module LectureChat
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class LectureChat {

    #listOfMessages;

    /**
     * Creates Lecture Chat instance
     * @constructor module:LectureChat
     */
    constructor() {
        this.#listOfMessages = [];
    }

    /**
     * Gets lecture chat messages
     * @method module:LectureChat#getMessages
     * 
     * @return {Object[]} list of messages
     */
    getMessages() {
        return this.#listOfMessages;
    }

    /**
     * Appends lecture chat message
     * @method module:LectureChat#appendMessage
     * 
     * @param {{senderID: String, username: String, messageID: number, timestamp: Date}} message message
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