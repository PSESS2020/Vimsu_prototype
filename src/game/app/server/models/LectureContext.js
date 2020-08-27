const CommandContext = require('./CommandContext.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Messages = require('../utils/Messages.js');
const Lecture = require('./Lecture.js');

/**
 * The Lecture Context Model
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class LectureContext extends CommandContext {

    #serverController
    #contextObject

    /**
     * @constructor Creates a lecture context instance
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
     * 
     * @return lecture messages
     */
    getMessages() {
        return this.#contextObject.getLectureChat().getMessages();
    };

    /**
     * Gets lecture title
     * 
     * @return lecture title
     */
    getTitle() {
        return this.#contextObject.getTitle();
    };

    /**
     * Gets help message
     * 
     * @return lecture help message
     */
    getHelpMessage() {
        return Messages.HELPLECTURECHAT;
    };

    /**
     * Update messages in lecture chat
     */
    updateMessages() {
        this.#serverController.emitEventIn(this.#contextObject.getId(), 'updateLectureChat', this.getMessages());
    };

    /**
     * Removes participant from lecture
     * 
     * @param {String} userToRemove username of the user to remove
     */
    removeUser(userToRemove) {
        TypeChecker.isString(userToRemove);

        var ppantId = this.#serverController.getIdOf(userToRemove);
        if (ppantId !== undefined && this.#contextObject.hasPPant(ppantId)) {
            this.#removeByID(ppantId, Messages.REMOVAL);
        }
    };

    /**
     * Closes lecture
     */
    close() {
        this.#contextObject.hide();
        var activePPants = this.#contextObject.getActiveParticipants();
        for (var i = 0; i < activePPants.length; i++) {
            this.#removeByID(activePPants[i], Messages.CLOSED);
            i--;
        }
    };

    /**
     * Mutes participant in the lecture
     * 
     * @param {String} userToMute username of the user to mute
     */
    muteUser(userToMute) {
        TypeChecker.isString(userToMute);

        //it is not possible to mute the orator
        if (userToMute !== this.#contextObject.getOratorUsername()) {
            var ppantID = this.#serverController.getIdOf(userToMute);
            if (ppantID !== undefined) {
                this.#contextObject.revokeToken(ppantID);
                var socketid = this.#serverController.getSocketId(ppantID);
                this.#serverController.sendNotification(socketid, Messages.REVOKE);
                this.#serverController.emitEventTo(socketid, 'update token', false);
            }
        }
    };

    /**
     * Unmutes participant in the lecture
     * 
     * @param {String} userToUnmute username of the user to unmute
     */
    unmuteUser(userToUnmute) {
        TypeChecker.isString(userToUnmute);

        var ppantID = this.#serverController.getIdOf(userToUnmute);
        // If the uses did not previously posess a token, we need to inform him he now does
        if (ppantID !== undefined && this.#contextObject.grantToken(ppantID)) {
            var socketid = this.#serverController.getSocketId(ppantID);
            this.#serverController.sendNotification(socketid, Messages.GRANT);
            this.#serverController.emitEventTo(socketid, 'update token', true);
        };
    };

    /**
     * Removes participant from lecture with its ID
     * 
     * @param {String} ppantId participant ID
     * @param {Messages} message notification message
     */
    #removeByID = function (ppantId, message) {
        TypeChecker.isString(ppantId);
        TypeChecker.isEnumOf(message, Messages);

        var socketClient = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantId));
        this.#contextObject.leave(ppantId);
        this.#contextObject.revokeToken(ppantId);
        this.#contextObject.ban(socketClient.request.session.accountId);
        socketClient.leave(socketClient.currentLecture);
        socketClient.currentLecture = undefined;
        socketClient.broadcast.emit('showAvatar', ppantId);
        this.#serverController.emitEventTo(socketClient.id, 'force close lecture');
        this.#serverController.sendNotification(socketClient.id, message);
    }
}