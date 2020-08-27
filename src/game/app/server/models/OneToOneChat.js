const TypeChecker = require('../../client/shared/TypeChecker.js');
const Chat = require('./Chat.js');
const Message = require('./Message.js');

/**
 * The 1:1 Chat Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class OneToOneChat extends Chat {

    #creatorUsername;
    #chatPartnerUsername;

    /**
     * @constructor Creates an 1:1 Chat instance
     * 
     * @param {String} chatId chat ID
     * @param {String} creatorID chat creator ID
     * @param {String} chatPartnerID chat partner ID
     * @param {Message[]} messageList list of messages
     * @param {number} maxNumMessages max number of messages
     * @param {String} creatorUsername creator username
     * @param {String} chatPartnerUsername chat partner username
     */
    constructor(chatId, creatorID, chatPartnerID, messageList, maxNumMessages, creatorUsername, chatPartnerUsername) {
        super(chatId, [creatorID, chatPartnerID], messageList, maxNumMessages);

        //Needed as a title for the ChatView
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatPartnerUsername);
        this.#creatorUsername = creatorUsername;
        this.#chatPartnerUsername = chatPartnerUsername;

    }

    /**
     * Adds a message to the message list.
     * If message list is full then the half of the message list gets deleted.
     * 
     * @param {Message} msg message
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
     * @param {String} ownUsername own username
     * 
     * @return chat partner username
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
     * @param {String} ownId own ID
     * 
     * @return chat partner ID
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
     * Removes participant from 1:1 chat
     * 
     * @param {String} participantId participant ID
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }
}