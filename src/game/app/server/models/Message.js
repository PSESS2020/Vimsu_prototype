const TypeChecker = require("../../client/shared/TypeChecker")

/**
 * The Message Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Message {

    #messageId
    #senderId
    #senderUsername
    #timestamp
    #messageText

    /**
     * @constructor Creates a Message instance
     * 
     * @param {String} messageId message ID
     * @param {String} senderId sender ID
     * @param {String} senderUsername sender username
     * @param {Date} timestamp message timestamp
     * @param {String} messageText message text
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

    /**
     * Gets message ID
     * 
     * @return messageId
     */
    getMessageId() {
        return this.#messageId;
    };

    /**
     * Gets sender ID
     * 
     * @return senderId
     */
    getSenderId() {
        return this.#senderId
    };

    /**
     * Gets sender username
     * 
     * @return senderUsername
     */
    getUsername() {
        return this.#senderUsername;
    }

    /**
     * Gets message timestamp
     * 
     * @return timestamp
     */
    getTimestamp() {
        return this.#timestamp;
    };

    /**
     * Gets message text
     * 
     * @return messageText
     */
    getMessageText() {
        return this.#messageText;
    };

}
