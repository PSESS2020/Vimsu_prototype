const CommandContext = require('./CommandContext.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandMessages = require('../utils/messages/CommandMessages.js');
const Lecture = require('./Lecture.js');

/**
 * The Lecture Context Model
 * @module LectureContext
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class LectureContext extends CommandContext {

    #serverController
    #contextObject

    /**
     * Creates a lecture context instance
     * @constructor module:LectureContext
     * 
     * @param {ServerController} serverController server controller instance
     * @param {Lecture} lecture lecture instance
     */
    constructor(serverController, lecture) {
        super();

        TypeChecker.isInstanceOf(lecture, Lecture);
        this.#serverController = serverController;
        this.#contextObject = lecture;
    }

    /**
     * Gets lecture messages
     * @method module:LectureContext#getMessages
     * 
     * @return {Object[]} lecture messages
     */
    getMessages() {
        return this.#contextObject.getLectureChat().getMessages();
    };

    /**
     * Gets lecture title
     * @method module:LectureContext#getTitle
     * 
     * 
     * @return {String} lecture title
     */
    getTitle() {
        return this.#contextObject.getTitle();
    };

    /**
     * Gets help message
     * @method module:LectureContext#getHelpMessage
     * 
     * @return {String} lecture help message
     */
    getHelpMessage() {
        return CommandMessages.HELPLECTURECHAT;
    };

    /**
     * Update messages in lecture chat
     * @method module:LectureContext#updateMessages
     */
    updateMessages() {
        this.#serverController.emitEventIn(this.#contextObject.getId(), 'updateLectureChat', this.getMessages());
    };

    /**
     * Removes participant from lecture
     * @method module:LectureContext#removeUser
     * 
     * @param {String} userToRemove username of the user to remove
     */
    removeUser(userToRemove) {
        TypeChecker.isString(userToRemove);

        var ppantId = this.#serverController.getIdOfOnlineParticipant(userToRemove);
        if (ppantId !== undefined && this.#contextObject.hasPPant(ppantId)) {
            this.#removeByID(ppantId, CommandMessages.REMOVAL);
        }
    };

    /**
     * Closes lecture
     * @method module:LectureContext#close
     */
    close() {
        this.#contextObject.hide();
        var activePPants = this.#contextObject.getActiveParticipants();
        for (var i = 0; i < activePPants.length; i++) {
            this.#removeByID(activePPants[i], CommandMessages.CLOSED);
            i--;
        }
    };

    /**
     * Mutes participant in the lecture
     * @method module:LectureContext#muteUser
     * 
     * @param {String} userToMute username of the user to mute
     */
    muteUser(userToMute) {
        TypeChecker.isString(userToMute);

        //it is not possible to mute the orator
        if (userToMute !== this.#contextObject.getOratorUsername()) {
            var ppantID = this.#serverController.getIdOfOnlineParticipant(userToMute);
            if (ppantID !== undefined) {
                this.#contextObject.revokeToken(ppantID);
                var socketid = this.#serverController.getSocketId(ppantID);
                this.#serverController.sendNotification(socketid, CommandMessages.REVOKE);
                this.#serverController.emitEventTo(socketid, 'update token', false);
            }
        }
    };

    /**
     * Unmutes participant in the lecture
     * @method module:LectureContext#unmuteUser
     * 
     * @param {String} userToUnmute username of the user to unmute
     */
    unmuteUser(userToUnmute) {
        TypeChecker.isString(userToUnmute);

        var ppantID = this.#serverController.getIdOfOnlineParticipant(userToUnmute);
        // If the uses did not previously posess a token, we need to inform him he now does
        if (ppantID !== undefined && this.#contextObject.grantToken(ppantID)) {
            var socketid = this.#serverController.getSocketId(ppantID);
            this.#serverController.sendNotification(socketid, CommandMessages.GRANT);
            this.#serverController.emitEventTo(socketid, 'update token', true);
        };
    };

    /**
     * @private Removes participant from lecture with its ID
     * 
     * @method module:LectureContext#removebyID
     * 
     * @param {String} ppantId participant ID
     * @param {Messages} message notification message
     */
    #removeByID = function (ppantId, message) {
        TypeChecker.isString(ppantId);
        TypeChecker.isEnumOf(message, CommandMessages);

        var socketClient = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantId));
        this.#contextObject.leave(ppantId);
        this.#contextObject.ban(socketClient.request.session.accountId);
        socketClient.leave(socketClient.currentLecture);
        socketClient.currentLecture = undefined;
        socketClient.broadcast.emit('showAvatar', ppantId);
        this.#serverController.emitEventTo(socketClient.id, 'force close lecture');
        this.#serverController.sendNotification(socketClient.id, message);
    }
}
