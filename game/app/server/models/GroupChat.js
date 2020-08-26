const TypeChecker = require('../../client/shared/TypeChecker.js');
const Chat = require('./Chat.js');
const Message = require('./Message.js');

module.exports = class GroupChat extends Chat {

    #chatName;
    #maxParticipants;
    #ownerId;

    /**
     * 
     * @param {String} chatId 
     * @param {String} ownerId 
     * @param {String} chatName 
     * @param {?String[]} participantList 
     * @param {Message[]} messageList 
     * @param {number} maxParticipants 
     * @param {number} maxNumMessages 
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

    getChatName() {
        return this.#chatName;
    }

    getOwnerId() {
        return this.#ownerId;
    }

    /**
     * 
     * @param {String} chatName 
     */
    setChatName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
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
     * Addds a participant to the participant list if maximum amount of members is not exceeded.
     * @param {String} participantId 
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
     * 
     * @param {String} participantId 
     */
    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }

}