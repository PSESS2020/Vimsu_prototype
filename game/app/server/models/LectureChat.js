module.exports = class LectureChat {

    #listOfMessages;

    /**
     * @author Laura 
     * 
     */
    constructor() {
        this.#listOfMessages = [];
    }

    getMessages() {
        return this.#listOfMessages;
    }

    appendMessage(message) {
        this.#listOfMessages.push(message);
    }
}