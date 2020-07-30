var TypeChecker = require('../../utils/TypeChecker.js');
var Chat = require('./Chat.js');

module.exports = class OneToOneChat extends Chat{
    
    //#chatName;
    //#sentStatus;
    //#memberIds;
    //#messageList;

    constructor(chatId, creatorID, chatPartnerID, messageList, maxNumMessages) {
        super(chatId, [creatorID, chatPartnerID], messageList, maxNumMessages);
        
    }

    //Adds a message to the message list.
    //If message list is full then the half of the message list gets deleted.
    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);
        if(super.getMessageList().length >= super.getMaxNumMessages())
            super.getMessageList().splice(0, super.getMaxNumMessages());

        super.getMessageList().push(msg);
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