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

    getChatName() {
        return this.#chatName;
    }
    
    getOwnerId() {
        return this.#ownerId;
    }

    setChatName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
    }

    //Adds a message to the message list.
    //If message list is full then the half of the message list gets deleted.
    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);
        let msgList = super.getMessageList();
        if(msgList.length >= super.getMaxNumMessages())
            msgList.splice(0, super.getMaxNumMessages());
            
            if (!msgList.includes(msg))
                msgList.push(msg);
    }

    //Addds a participant to the participant list
    //if maximum amount of members is not exceeded.
    addParticipant(participantId) {
        TypeChecker.isString(participantId);

        let ppantList = super.getParticipantList();
        if(ppantList.length >= this.#maxParticipants) {
            return false;
        } else {
            
            if (!ppantList.includes(participantId)) {
            ppantList.push(participantId);
            return true;
            }
            
        }
    }

    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }

}