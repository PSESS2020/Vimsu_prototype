const TypeChecker = require('../../client/shared/TypeChecker.js');
const Chat = require('./Chat.js');
const Message = require('./Message.js');

/**
 * The Group Chat Model
 * @module GroupChat
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class GroupChat extends Chat {

    #chatName;
    #maxParticipants;
    #ownerId;

    /**
     * Creates group chat instance
     * @constructor module:GroupChat
     * 
     * @param {String} chatId chat ID
     * @param {String} ownerId group chat owner ID
     * @param {String} chatName group chat name
     * @param {?String[]} participantList group chat participant list
     * @param {Message[]} messageList group chat message list
     * @param {number} maxParticipants max participants of group chat
     * @param {number} maxNumMessages max number of messages of group chat
     */
    constructor(chatId, ownerId, chatName, participantList, messageList, maxParticipants, maxNumMessages) {
        super(chatId, participantList, messageList, maxNumMessages);

        TypeChecker.isString(ownerId);
        TypeChecker.isString(chatName);
        TypeChecker.isInt(maxParticipants);

        this.#chatName = chatName;
        this.#ownerId = ownerId;
        this.#maxParticipants = maxParticipants;
    }

    /**
     * Gets group chat name
     * @method module:GroupChat#getChatName
     * 
     * @return {String} chatName
     */
    getChatName() {
        return this.#chatName;
    }

    /**
     * Gets group chat owner ID
     * @method module:GroupChat#getOwnerId
     * 
     * @return {String} ownerId
     */
    getOwnerId() {
        return this.#ownerId;
    }

    /**
     * Sets group chat name
     * @method module:GroupChat#setChatName
     * 
     * @param {String} chatName group chat name
     */
    setChatName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
    }

    /**
     * Adds a message to the message list.
     * If message list is full then the half of the message list gets deleted.
     * @method module:GroupChat#addMessage
     * 
     * @param {Message} msg group chat message
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
     * Adds a participant to the participant list if maximum amount of members is not exceeded.
     * @method module:GroupChat#addParticipant
     * 
     * @param {String} participantId participant ID
     * 
     * @return {boolean} true if successfully added, otherwise false
     */
    addParticipant(participantId) {
        TypeChecker.isString(participantId);

        let ppantList = super.getParticipantList();
        if (ppantList.length >= this.#maxParticipants) {
            return false;
        } else {
            if (!ppantList.includes(participantId)) {
                ppantList.push(participantId);
                return true;
            }

        }
    }

    /**
     * Remove participant from the group chat
     * @method module:GroupChat#removeParticipant
     * 
     * @param {String} participantId participant ID
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }
}