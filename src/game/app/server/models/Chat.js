const TypeChecker = require('../../client/shared/TypeChecker.js');
const Message = require('./Message.js');

/**
 * The Chat Model
 * @module Chat
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class Chat {
    #chatId;
    #participantList;
    #messageList;
    #maxNumMessages;

    /**
     * Creates a Chat instance
     * @constructor module:Chat
     * 
     * @param {String} chatId chat ID
     * @param {String[]} participantList list of chat participants
     * @param {Message[]} messageList list of messages
     * @param {number} maxNumMessages max number of messages
     */
    constructor(chatId, participantList, messageList, maxNumMessages) {
        TypeChecker.isString(chatId);
        TypeChecker.isInstanceOf(participantList, Array);
        participantList.forEach(participantID => {
            if (participantID) {
                TypeChecker.isString(participantID);
            }
        });

        TypeChecker.isInstanceOf(messageList, Array);

        messageList.forEach(message => {
            TypeChecker.isInstanceOf(message, Message);
        });

        TypeChecker.isInt(maxNumMessages);

        this.#chatId = chatId;
        this.#participantList = participantList;
        this.#maxNumMessages = maxNumMessages;
        this.#messageList = messageList;
    }

    /**
     * Gets chat ID
     * 
     * @return {String} chatId
     */
    getId() {
        return this.#chatId;
    }

    /**
     * Gets max number of messages
     * 
     * @return {number} maxNumMessages
     */
    getMaxNumMessages() {
        return this.#maxNumMessages;
    }

    /**
     * Gets number of participants
     * 
     * @return {number} number of participants
     */
    getNumParticipants() {
        return this.#participantList.length;
    }

    /**
     * Gets list of messages
     * 
     * @return {Message[]} messageList
     */
    getMessageList() {
        return this.#messageList;
    }

    /**
     * Gets list of chat participants
     * 
     * @return {String[]} participantList
     */
    getParticipantList() {
        return this.#participantList;
    }

    /**
     * Sets max number of messages
     * 
     * @param {number} maxNumMsg max number of messages
     */
    setMaxNumMessages(maxNumMsg) {
        TypeChecker.isInt(maxNumMsg);
        this.#maxNumMessages = maxNumMsg;
    }

    /**
     * Add a message to this chat
     * @abstract @method module:Chat#addMessage
     */
    addMessage() {
        throw new Error('addMessage() has to be implemented!');
    }

    /**
     * Remove a message from this chat
     * 
     * @param {String} msgId message ID
     */
    removeMessage(msgId) {
        TypeChecker.isString(msgId);

        this.#messageList.forEach(msg => {
            if (msg.getMessageId() === msgId) {
                let index = this.#messageList.indexOf(msg);
                this.#messageList.splice(index, 1);
            }
        });
    }

    /**
     * Remove a participant from this chat
     * 
     * @param {String} participantId participant ID
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        this.#participantList.forEach(participant => {

            if (participant === participantId) {
                let index = this.#participantList.indexOf(participant);
                this.#participantList.splice(index, 1);
            }
        });
    }

}
