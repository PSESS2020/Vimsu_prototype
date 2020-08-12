const TypeChecker = require('../../client/shared/TypeChecker.js');
var Chat = require('./Chat.js');

module.exports = class OneToOneChat extends Chat{
    
    #creatorUsername;
    #chatPartnerUsername;

    constructor(chatId, creatorID, chatPartnerID, messageList, maxNumMessages, creatorUsername, chatPartnerUsername) {
        super(chatId, [creatorID, chatPartnerID], messageList, maxNumMessages);

        //Needed as a title for the ChatView (P)
        TypeChecker.isString(creatorUsername);
        TypeChecker.isString(chatPartnerUsername);
        this.#creatorUsername = creatorUsername;
        this.#chatPartnerUsername = chatPartnerUsername;
        
    }

    //Adds a message to the message list.
    //If message list is full then the half of the message list gets deleted.
    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);
        let msgList = super.getMessageList();
        if (msgList.length >= super.getMaxNumMessages())
            msgList.splice(0, super.getMaxNumMessages());

        if (!msgList.includes(msg))
            msgList.push(msg);
    }

    //method to get the other username in this 1:1 chat (P)
    getOtherUsername(ownUsername) {
        if (ownUsername !== this.#creatorUsername && ownUsername !== this.#chatPartnerUsername) {
            throw new Error(ownUsername + ' is not in ppantList of this chat!');
        }

        if (ownUsername === this.#creatorUsername) {
            return this.#chatPartnerUsername;
        } else {
            return this.#creatorUsername;
        }
    }

    //method to get the other user id in this 1:1 chat
    getOtherUserId(ownId) {
        if (ownId !== super.getParticipantList()[0] && ownId !== super.getParticipantList()[1]) {
            throw new Error(ownId + ' is not in ppantList of this chat!');
        }

        if (ownId === super.getParticipantList()[0]) {
            return super.getParticipantList()[1];
        } else {
            return super.getParticipantList()[0];
        }
    }

    removeParticipant(participantId) {
        TypeChecker.isString(participantId);

        super.removeParticipant(participantId);
    }

    /*
    isSent() {
        return this.#sentStatus;
    }
    

    getChatName() {
        return this.#chatName;
    }
    

    getReceiverName() {
        return this.#memberId;
    }
    

    sendRequest(senderId) {
        //TODO
    }

    setSent(status) {
        TypeChecker.isBoolean(status);
        this.#sentStatus = status;
    }

    setChatName(chatName) {
        TypeChecker.isString(chatName);
        this.#chatName = chatName;
    }

    setMember(memberId) {
        TypeChecker.isString(memberId);
        this.#memberId = memberId;
    }
    */

}