module.exports = class LectureChat {

    #lectureId;
    #listOfMessages;

   
    /**
     * @author Laura
     * 
     * @param {String} lectureId    
     * 
     */
    constructor(lectureId) {
        this.#lectureId = lectureId;
    }

    getMessages() {
        return this.#listOfMessages;
    }

    appendMessage(message) {
        this.#listOfMessages.append(message);
    }

    //for moderators who can delete messages from the lecture chat
    removeMessage(message) {
        //TODO: implement, compare whole messages or give them an id to compare them?
    }

}