var TypeChecker = require('../../utils/TypeChecker.js');
var Chat = require('./Chat.js');

module.exports = class OneToOneChat extends Chat{
    
    #chatName;
    #sentStatus;
    #memberId;
    #messageList;

    constructor(chatId, chatName, sentStatus, ownerId, memberId, messageList) {
        super(chatId, ownerId);

        this.#chatName = chatName;
        this.#sentStatus = sentStatus;
        this.#memberId = memberId;
        this.#messageList = messageList;
    }

    addMessage(msg) {
        //TypeChecker.isInstanceOf(msg, StatusMessage);

        this.#messageList.push(msg);
    }

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

}