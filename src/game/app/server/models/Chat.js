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
     * @method module:Chat#getId
     * 
     * @return {String} chatId
     */
    getId() {
        return this.#chatId;
    }

    /**
     * Gets max number of messages
     * @method module:Chat#getMaxNumMessages
     * 
     * @return {number} maxNumMessages
     */
    getMaxNumMessages() {
        return this.#maxNumMessages;
    }

    /**
     * Gets number of participants
     * @method module:Chat#getNumParticipants
     * 
     * @return {number} number of participants
     */
    getNumParticipants() {
        return this.#participantList.length;
    }

    /**
     * Gets list of messages
     * @method module:Chat#getMessageList
     * 
     * @return {Message[]} messageList
     */
    getMessageList() {
        return this.#messageList;
    }

    /**
     * Gets list of chat participants
     * @method module:Chat#getParticipantList
     * 
     * @return {String[]} participantList
     */
    getParticipantList() {
        return this.#participantList;
    }

    /**
     * Sets max number of messages
     * @method module:Chat#setMaxNumMessages
     * 
     * @param {number} maxNumMsg max number of messages
     */
    setMaxNumMessages(maxNumMsg) {
        TypeChecker.isInt(maxNumMsg);
        this.#maxNumMessages = maxNumMsg;
    }

    /**
     * @method module:Chat#addMessage
     * 
     * @abstract Add a message to this chat
     */
    addMessage() {
        throw new Error('addMessage() has to be implemented!');
    }

    /**
     * Remove a message from this chat
     * @method module:Chat#removeMessage
     * 
     * @param {String} msgId message ID
     */
    removeMessage(msgId) {
        TypeChecker.isString(msgId);

        for (let index = 0; index < this.#messageList.length; index++) {
            const msg = this.#messageList[index]
            if (msg.getMessageId() === msgId) {
                this.#messageList.splice(index, 1);
                return;
            }
        }
    }

    /**
     * Remove a participant from this chat
     * @method module:Chat#removeParticipant
     * 
     * @param {String} participantId participant ID
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        for (let index = 0; index < this.#participantList.length; index++) {
            const participant = this.#participantList[index]
            if (participant === participantId) {
                this.#participantList.splice(index, 1);
                return;
            }
        }
    }

    /**
     * Checks if ppant with ppantID is currently in this chat
     * @method module:Chat#includesChatMember
     * 
     * @param {String} ppantID participant ID
     * @return {boolean} true if ppant is chat member, false otherwise
     */
    includesChatMember(ppantID) {
        TypeChecker.isString(ppantID);

        return this.#participantList.includes(ppantID);
    }
}