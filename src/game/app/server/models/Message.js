const TypeChecker = require("../../client/shared/TypeChecker")

/**
 * The Message Model
 * @module Message
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
     * Creates a Message instance
     * @constructor module:Message
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
     * @method module:Message#getMessageId
     * 
     * @return {String} messageId
     */
    getMessageId() {
        return this.#messageId;
    };

    /**
     * Gets sender ID
     * @method module:Message#getSenderId
     * 
     * @return {String} senderId
     */
    getSenderId() {
        return this.#senderId
    };

    /**
     * Gets sender username
     * @method module:Message#getUsername
     * 
     * @return {String} enderUsername
     */
    getUsername() {
        return this.#senderUsername;
    }

    /**
     * Gets message timestamp
     * @method module:Message#getTimestamp
     * 
     * @return {Date} timestamp
     */
    getTimestamp() {
        return this.#timestamp;
    };

    /**
     * Gets message text
     * @method module:Message#getMessageText
     * 
     * @return {String} messageText
     */
    getMessageText() {
        return this.#messageText;
    };

}
