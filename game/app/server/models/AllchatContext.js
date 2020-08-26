const CommandContext = require('./CommandContext.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const Messages = require('../utils/Messages.js');
const Room = require('./Room.js');
const ServerController = require('../controller/ServerController.js');

module.exports = class AllchatContext extends CommandContext {
    
    #serverController
    #contextObject
    
    /**
     * 
     * @param {ServerController} serverController 
     * @param {Room} room 
     */
    constructor(serverController, room) {
        super();

        //TypeChecker.isInstanceOf(serverController, ServerController); Does not work for some reason
        TypeChecker.isInstanceOf(room, Room);
        this.#serverController = serverController;
        this.#contextObject = room;
    }
    
    getMessages() {
        return this.#contextObject.getMessages();
    };
    
    getTitle() {
        return this.#contextObject.getTypeOfRoom();
    };
    
    getHelpMessage() {
        return Messages.HELPALLCHAT;
    };
    
    updateMessages() {
        this.#serverController.emitEventIn(this.#contextObject.getRoomId(), 'initAllchat', this.getMessages());
    };
    
    /**
     * 
     * @param {String} userToRemove username of the user to remove
     */
    removeUser(userToRemove) {
        // removes player(s) from conference

        TypeChecker.isString(userToRemove);
        
        var ppantID = this.#serverController.getIdOf(userToRemove);
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));

            /* First, it gets the socket object corresponding to player that
            * is supposed to be removed from the game. 
            * - (E) */

            if (socket != undefined) {
            
                if(socket.currentLecture) {
                    this.#serverController.emitEventTo(socket.id, 'force close lecture');
                }
            
                /* Tells the clientController to remove itself from the game
                 * (meaning to return to the homepage). Since the handling of
                * this can be altered client-side, we also need to remove the socket
                 * from all the rooms (see below).
                * - (E) */
                this.#serverController.emitEventTo(socket.id, 'remove yourself');
                this.#serverController.ban(socket.request.session.accountId);

                /* Get all the socketIO-rooms the socket belonging to the participant that
                 * is to be removed is currently in and remove the socket from all those rooms
                 * - (E) */
                Object.keys(socket.rooms).forEach( (room) => {
                    socket.leave(room);
                    this.#serverController.emitEventIn(room, "remove player", ppantID);
                });
            }
            
        }

    };
    
    close() {
        return; // does nothing
    };
    
    /**
     * 
     * @param {String} userToMute username of the user to mute
     */
    muteUser(userToMute) {
        TypeChecker.isString(userToMute);

        var ppantID = this.#serverController.getIdOf(userToMute);
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));
            var accountId = socket.request.session.accountId;
            if (socket != undefined && !this.#serverController.isMuted(accountId)) {
                this.#serverController.mute(accountId);
                this.#serverController.sendNotification(socket.id, Messages.MUTE);
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
        if (ppantID !== undefined) {
            var socket = this.#serverController.getSocketObject(this.#serverController.getSocketId(ppantID));
            var accountId = socket.request.session.accountId;
            if (socket != undefined && this.#serverController.isMuted(accountId)) {
                this.#serverController.unmute(accountId);
                this.#serverController.sendNotification(socket.id, Messages.UNMUTE);
            }
        };
    }
    
}
