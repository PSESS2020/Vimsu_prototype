var TypeChecker = require('../../utils/TypeChecker.js');
var Chat = require('./Chat.js');

module.exports = class GroupChat extends Chat {

    #chatName;
    #participantList;
    #messageList;
    #maxParticipants;

    constructor(chatId, ownerId, chatName, participantList, messageList, maxParticipants) {
        super(chatId, ownerId);

        TypeChecker.isString(chatName);
        TypeChecker.isInstanceOf(participantList, Array);
        TypeChecker.isInstanceOf(messageList, Array);
        TypeChecker.isInt(maxParticipants);

        this.#chatName = chatName;
        this.#participantList = participantList;
        this.#messageList = messageList;
        this.#maxParticipants = maxParticipants;
    }

    inviteFriend(participantId) {
        //TODO
    }

    getChatName() {
        return this.#chatName;
    }

    setName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
    }

    //Adds a message to the message list.
    //If message list is full then the half of the message list gets deleted.
    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);
        if(this.#messageList.length >= maxNumMessages)
            this.#messageList.splice(0, maxNumMessages);

        this.#messageList.push(msg);
    }

    //Addds a participant to the participant list
    //if maximum amount of members is not exceeded.
    addParticipant(participantId) {
        TypeChecker.isString(participantId);

        if(this.#participantList.length >= this.#maxParticipants) {
            return false;
        } else {
            this.participantList.push(participantId);
            return true;
        }
    }

}