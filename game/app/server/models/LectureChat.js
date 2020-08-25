module.exports = class LectureChat {

    #listOfMessages;

    /**
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