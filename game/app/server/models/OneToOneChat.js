
module.exports = class OneToOneChat {
    
    #chatName;
    #sentStatus;
    #messageList;

    constructor(idChat, ownerId, participantList, messageList, chatName) {
        //super(idChat, ownerId);
        this.#chatName = chatName;
        this.#messageList = messageList;
        this.#sentStatus = false;
    }

    addMessage(msg) {

    }

    isSent() {

    }

    getReceiverName() {

    }

    sendRequest(senderId) {

    }

    setSent(status) {
        TypeChecker.isBoolean(status);
        this.#sentStatus = status;
    }

    setChatName(chatName) {
        this.#chatName = chatName;
    }

}