module.exports = class Message {
    
    #messageId
    #senderId
    #senderUsername
    #timestamp
    #messageText
    
    constructor(messageId, senderId, senderUsername, timestamp, messageText) {
        this.#messageId = messageId;
        this.#senderId = senderId;
        this.#senderUsername = senderUsername;
        this.#timestamp = timestamp;
        this.#messageText =  messageText;
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
    
    getText() {
        return this.#messageText;
    };
    
}
