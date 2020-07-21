var TypeChecker = require('../../utils/TypeChecker.js');

const maxNumMessages = 100;

module.exports = class Chat {
    #chatId;
    #ownerId;
    #participantList;
    #messageList;

    constructor(chatId, ownerId) {
        TypeChecker.isString(chatId);
        TypeChecker.isString(ownerId);

        this.#chatId = chatId;
        this.#ownerId = ownerId;
    }
    /*
    *Multiple constructors are not allowed.
    constructor(idChat, idOwner, participantList, messageList) {
        this.#idChat = idChat;
        this.#idOwner = idOwner;
        this.#participantList = participantList;
        this.#messageList = messageList;
    }*/

    addMessage() {

    }

    addParticipant() {

    }

    getId() {
        return this.#chatId;
    }

    getMessageL() {
        return this.#messageList;
    }

    getParticipantL() {
        return this.#participantList;
    }

    notifyMessageAll(participantId) {
        //TODO
    }

    notifyParticipantAll(participantId) {
        //TODO
    }

    removeMessage(msgId) {
        TypeChecker.isString(msgId);

        this.#messageList.forEach(msg => {
            if (msg.getId() === msgId) {
                let index = this.#messageList.indexOf(msg);
                this.#messageList.splice(index, 1);
            }
        });
    }
    

    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        this.#participantList.forEach(participant => {

            if (participant.getId() === participantId) {
                let index = this.#participantList.indexOf(participant);
                this.#participantList.splice(index, 1);
            }
        });
    }

    getNumParticipants() {
        return this.#participantList.length;
    }

}