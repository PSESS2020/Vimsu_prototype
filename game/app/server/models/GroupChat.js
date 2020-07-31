var TypeChecker = require('../../utils/TypeChecker.js');
var Chat = require('./Chat.js');

module.exports = class GroupChat extends Chat {

    #chatName;
    #maxParticipants;
    #ownerId;

    constructor(chatId, ownerId, chatName, participantList, messageList, maxParticipants, maxNumMessages) {
        super(chatId, participantList, messageList, maxNumMessages);

        TypeChecker.isString(chatName);
        TypeChecker.isInstanceOf(participantList, Array);
        TypeChecker.isInstanceOf(messageList, Array);
        TypeChecker.isInt(maxParticipants);

        this.#chatName = chatName;
        this.#ownerId = ownerId;
        this.#maxParticipants = maxParticipants;
    }

    inviteFriend(participantId) {
        //TODO
    }

    getChatName() {
        return this.#chatName;
    }
    
    getOwnerId() {
        return this.#ownerId;
    }

    setName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
    }

    //Adds a message to the message list.
    //If message list is full then the half of the message list gets deleted.
    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);
        if(super.getMessageList().length >= super.getMaxNumMessages())
            super.getMessageList().splice(0, super.getMaxNumMessages());

            super.getMessageList().push(msg);
    }

    //Addds a participant to the participant list
    //if maximum amount of members is not exceeded.
    addParticipant(participantId) {
        TypeChecker.isString(participantId);

        if(super.getParticipantList().length >= this.#maxParticipants) {
            return false;
        } else {
            super.addParticipant(participantId);
            return true;
        }
    }

    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }

}