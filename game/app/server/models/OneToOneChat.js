const TypeChecker = require('../../client/shared/TypeChecker.js');
const Chat = require('./Chat.js');
const Message = require('./Message.js');

module.exports = class OneToOneChat extends Chat {

    #creatorUsername;
    #chatPartnerUsername;

    /**
     * 
     * @param {String} chatId 
     * @param {String} creatorID 
     * @param {String} chatPartnerID 
     * @param {Message[]} messageList 
     * @param {number} maxNumMessages 
     * @param {String} creatorUsername 
     * @param {String} chatPartnerUsername 
     */
    constructor(chatId, creatorID, chatPartnerID, messageList, maxNumMessages, creatorUsername, chatPartnerUsername) {
        super(chatId, [creatorID, chatPartnerID], messageList, maxNumMessages);

        //Needed as a title for the ChatView (P)
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatPartnerUsername);
        this.#creatorUsername = creatorUsername;
        this.#chatPartnerUsername = chatPartnerUsername;

    }

    /**
     * Adds a message to the message list.
     * If message list is full then the half of the message list gets deleted.
     * 
     * @param {Message} msg 
     */
    addMessage(msg) {
        TypeChecker.isInstanceOf(msg, Message);
        let msgList = super.getMessageList();
        if (msgList.length >= super.getMaxNumMessages())
            msgList.splice(0, super.getMaxNumMessages());

        if (!msgList.includes(msg))
            msgList.push(msg);
    }

    /**
     * Get the other username in this 1:1 chat
     * 
     * @param {String} ownUsername 
     */
    getOtherUsername(ownUsername) {
        TypeChecker.isString(ownUsername);

        if (ownUsername !== this.#creatorUsername && ownUsername !== this.#chatPartnerUsername) {
            throw new Error(ownUsername + ' is not in ppantList of this chat!');
        }

        if (ownUsername === this.#creatorUsername) {
            return this.#chatPartnerUsername;
        } else {
            return this.#creatorUsername;
        }
    }

    /**
     * Get the other user id in this 1:1 chat
     * 
     * @param {String} ownId 
     */
    getOtherUserId(ownId) {
        TypeChecker.isString(ownId);

        if (ownId !== super.getParticipantList()[0] && ownId !== super.getParticipantList()[1]) {
            throw new Error(ownId + ' is not in ppantList of this chat!');
        }

        if (ownId === super.getParticipantList()[0]) {
            return super.getParticipantList()[1];
        } else {
            return super.getParticipantList()[0];
        }
    }

    /**
     * 
     * @param {String} participantId 
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }
}