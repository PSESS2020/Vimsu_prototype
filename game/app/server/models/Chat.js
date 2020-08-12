var TypeChecker = require('../../client/shared/TypeChecker.js');
/* Commented out because classes cannot require each other at the same time.
   This causes at least an error in the test class. (N)*/
//const Participant = require('./Participant.js');
const Message = require('./Message.js');

module.exports = class Chat {
    #chatId;
    //#ownerId;
    //#title
    #participantList;
    #messageList;
    #maxNumMessages;

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

    getId() {
        return this.#chatId;
    }

    getMaxNumMessages() {
        return this.#maxNumMessages;
    }

    getNumParticipants() {
        return this.#participantList.length;
    }

    getMessageList() {
        return this.#messageList;
    }

    getParticipantList() {
        return this.#participantList;
    }

    setMaxNumMessages(maxNumMsg) {
        this.#maxNumMessages = maxNumMsg;
    }

    /*
    *Multiple constructors are not allowed.
    constructor(idChat, idOwner, participantList, messageList) {
        this.#idChat = idChat;
        this.#idOwner = idOwner;
        this.#participantList = participantList;
        this.#messageList = messageList;
    }*/

    addMessage(msg) {
        // Intentionally left blank - to implement in child classes
    }

    addParticipant(ppantId) {
        // Intentionally left blank - to implement in child classes
    }

    generateNewMsgId(senderId) {
        return this.#chatId + "." + senderId + "." + this.#messageList.length;
    }

    removeMessage(msgId) {
        TypeChecker.isString(msgId);

        this.#messageList.forEach(msg => {
            if (msg.getMessageId() === msgId) {
                let index = this.#messageList.indexOf(msg);
                this.#messageList.splice(index, 1);
            }
        });
    }

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
