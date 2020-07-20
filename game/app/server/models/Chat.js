var TypeChecker = require('../../utils/TypeChecker.js');

module.exports = class Chat {
    #idChat;
    #idOwner;
    #participantList;
    #messageList;
    #maxNumMessages;

    constructor(idChat, idOwner) {
        TypeChecker.isString(idChat);
        TypeChecker.isString(idOwner);

        this.#idChat = idChat;
        this.#idOwner = idOwner;
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

    }

    getMessageL() {

    }

    getParticipantL() {

    }

    notifyMessageAll(idParticipant) {

    }

    notifyParticipantAll(idParticipant) {

    }

    removeMessage(idMsg) {

    }

    removePArticipant(idParticipant) {

    }

    getNumParticipants() {

    }

}