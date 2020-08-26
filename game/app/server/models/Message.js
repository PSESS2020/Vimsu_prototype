const TypeChecker = require("../../client/shared/TypeChecker")

module.exports = class Message {

    #messageId
    #senderId
    #senderUsername
    #timestamp
    #messageText

    /**
     * 
     * @param {String} messageId 
     * @param {String} senderId 
     * @param {String} senderUsername 
     * @param {Date} timestamp 
     * @param {String} messageText 
     */
    constructor(messageId, senderId, senderUsername, timestamp, messageText) {
        TypeChecker.isString(messageId);
        TypeChecker.isString(senderId);
        TypeChecker.isString(senderUsername);
        TypeChecker.isDate(timestamp);
        TypeChecker.isString(messageText);
        
        this.#messageId = messageId;
        this.#senderId = senderId;
        this.#senderUsername = senderUsername;
        this.#timestamp = timestamp;
        this.#messageText = messageText;
    }

    getMessageId() {
        return this.#messageId;
    };

    getSenderId() {
        return this.#senderId
    };

    getUsername() {
        return this.#senderUsername;
    }

    getTimestamp() {
        return this.#timestamp;
    };

    getMessageText() {
        return this.#messageText;
    };

}
