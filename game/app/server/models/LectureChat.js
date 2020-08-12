module.exports = class LectureChat {

    #lectureId;
    #listOfMessages;
    #locked;


    /**
     * @author Laura
     * 
     * @param {String} lectureId    
     * 
     */
    constructor(lectureId) {
        this.#lectureId = lectureId;
        this.#listOfMessages = [];
        this.#locked = false;
    }

    getMessages() {
        return this.#listOfMessages;
    }

    appendMessage(message) {
        this.#listOfMessages.push(message);
    }

    //for moderators who can delete messages from the lecture chat
    removeMessage(message) {
        //TODO
    }

}