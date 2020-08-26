const CommandContext = require('./CommandContext.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Messages = require('../utils/Messages.js');
const Lecture = require('./Lecture.js');
const ServerController = require('../controller/ServerController');

module.exports = class LectureContext extends CommandContext {
    
    #serverController
    #contextObject
    
    /**
     * 
     * @param {ServerController} serverController 
     * @param {Lecture} lecture 
     */
    constructor(serverController, lecture) {
        super();

        //TypeChecker.isInstanceOf(serverController, ServerController); Does not work for some reason
        TypeChecker.isInstanceOf(lecture, Lecture);
        this.#serverController = serverController;
        this.#contextObject = lecture;
    }
    
    getMessages() {
        return this.#contextObject.getLectureChat().getMessages();
    };
    
    getTitle() {
        return this.#contextObject.getTitle();
    };
    
    getHelpMessage() {
        return Messages.HELPLECTURECHAT;
    };
    
    updateMessages() {
        // will this work?
        this.#serverController.emitEventIn(this.#contextObject.getId(), 'updateLectureChat', this.getMessages());
    };
    
    /**
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
    
    close() {
        this.#contextObject.hide();
        console.log(this.#contextObject.getActiveParticipants());
        var activePPants = this.#contextObject.getActiveParticipants();
        for(var i = 0; i < activePPants.length; i++) {
            this.#removeByID(activePPants[i], Messages.CLOSED);
            i--;
        }
    };
    
    /**
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
     * 
     * @param {String} userToUnmute username of the user to unmute
     */
    unmuteUser(userToUnmute) {
        TypeChecker.isString(userToUnmute);

        var ppantID = this.#serverController.getIdOf(userToUnmute);
        // If the uses did not previously posess a token, we need to inform him he now does
        if(ppantID !== undefined && this.#contextObject.grantToken(ppantID)) {
            var socketid = this.#serverController.getSocketId(ppantID);
            this.#serverController.sendNotification(socketid, Messages.GRANT);
            this.#serverController.emitEventTo(socketid, 'update token', true);
        };
    };
    
    /**
     * 
     * @param {String} ppantId 
     * @param {Messages} message 
     */
    #removeByID = function(ppantId, message) {
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
