const CommandContext = require('./CommandContext.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandMessages = require('../utils/messages/CommandMessages.js');
const Room = require('./Room.js');

/**
 * The Allchat Context Model
 * @module AllchatContext
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class AllchatContext extends CommandContext {

    #serverController
    #contextObject

    /**
     * Creates a allchat context instance
     * @constructor module:AllchatContext
     * 
     * @param {ServerController} serverController server controller instance
     * @param {Room} room room instance
     */
    constructor(serverController, room) {
        super();

        TypeChecker.isInstanceOf(room, Room);
        // probably should type-check serverController
        // not done yet to not interfere w/ dummy-solution from test-class
        this.#serverController = serverController;
        this.#contextObject = room;
    }

    /**
     * Gets room messages
     * @method module:AllchatContext#getMessages
     * 
     * @return {Object[]} messages
     */
    getMessages() {
        return this.#contextObject.getMessages();
    };

    /**
     * Gets room title
     * @method module:AllchatContext#getTitle
     * 
     * @return {TypeOfRoom} title
     */
    getTitle() {
        return this.#contextObject.getTypeOfRoom();
    };

    /**
     * Gets help messages
     * @method module:AllchatContext#getHelpMessage
     * 
     * @return {Object} help messages
     */
    getHelpMessage() {
        return CommandMessages.HELPALLCHAT;
    };

    /**
     * Updates messages in allchat
     * @method module:AllchatContext#updateMessages
     */
    updateMessages() {
        this.#serverController.emitEventIn(this.#contextObject.getRoomId(), 'initAllchat', this.getMessages());
    };

    /**
     * Removes participant from conference
     * @method module:AllchatContext#removeUser
     * 
     * @param {String} userToRemove username of the user to remove
     */
    removeUser(userToRemove) {
        TypeChecker.isString(userToRemove);

        var ppantID = this.#serverController.getIdOfOnlineParticipant(userToRemove);
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));

            /* First, it gets the socket object corresponding to player that
            * is supposed to be removed from the game. */
            if (socket != undefined) {

                if (socket.currentLecture) {
                    this.#serverController.emitEventTo(socket.id, 'force close lecture');
                }

                /* Tells the clientController to remove itself from the game
                 * (meaning to return to the homepage). Since the handling of
                 * this can be altered client-side, we also need to remove the socket
                 * from all the rooms */
                this.#serverController.emitEventTo(socket.id, 'remove yourself');
                this.#serverController.ban(socket.request.session.accountId);

                /* Get all the socketIO-rooms the socket belonging to the participant that
                 * is to be removed is currently in and remove the socket from all those rooms */
                Object.keys(socket.rooms).forEach((room) => {
                    socket.leave(room);
                    // this needs to remove the ppant from the room-Instance
                    this.#serverController.emitEventIn(room, "remove player", ppantID);
                });
            }
        }
    };

    /**
     * Not closing anything
     * @method module:AllchatContext#close
     */
    close() {
        return;
    };

    /**
     * Mutes participant from allchat
     * @method module:AllchatContext#muteUser
     * 
     * @param {String} userToMute username of the user to mute
     */
    muteUser(userToMute) {
        TypeChecker.isString(userToMute);

        var ppantID = this.#serverController.getIdOfOnlineParticipant(userToMute);
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));
            var accountId = socket.request.session.accountId;
            if (socket != undefined && !this.#serverController.isMuted(accountId)) {
                this.#serverController.mute(accountId);
                this.#serverController.sendNotification(socket.id, CommandMessages.MUTE);
            }
        }
    };

    /**
     * Unmutes participant from allchat
     * @method module:AllchatContext#unmuteUser
     * 
     * @param {String} userToUnmute username of the user to unmute
     */
    unmuteUser(userToUnmute) {
        TypeChecker.isString(userToUnmute);

        var ppantID = this.#serverController.getIdOfOnlineParticipant(userToUnmute);
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));
            var accountId = socket.request.session.accountId;
            if (socket != undefined && this.#serverController.isMuted(accountId)) {
                this.#serverController.unmute(accountId);
                this.#serverController.sendNotification(socket.id, CommandMessages.UNMUTE);
            }
        };
    }

}
