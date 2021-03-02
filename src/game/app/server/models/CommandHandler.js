const Commands = require('../utils/Commands.js');
const Messages = require('../utils/Messages.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandContext = require('./CommandContext.js');
const Position = require('../models/Position.js');
const ShirtColor = require('../../client/shared/ShirtColor.js');

/**
 * The Command Handler Model
 * @module CommandHandler
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class CommandHandler {

    #serverController
    #commandList

    /**
     * Creates a command handler instance
     * @constructor module:CommandHandler
     * 
     * @param {ServerController} serverController server controller instance
     */
    constructor(serverController) {

        if (!!CommandHandler.instance) {
            return CommandHandler.instance;
        }

        CommandHandler.instance = this;

        this.#serverController = serverController;

        // maybe slightly switch commands to have two fields, 
        // one for the string needing to be entered
        // and one for the 'kind' of command it is?
        this.#commandList = Object.values(Commands);

    }

    /**
     * handles a command, where context is the room or lecture in which it was send 
     * and socket the socket from which it was send
     * @method module:CommandHandler#handleCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {String} username participant username
     */
    handleCommand(socket, context, commandArgs, username) {
        this.#checkParamTypes(context, commandArgs);

        //only defined by allchat commands
        if (username !== undefined) {
            TypeChecker.isString(username);
        }

        // commandArgs will be an array containing the command-string in first place
        var commandType = commandArgs[0];
        commandArgs = commandArgs.slice(1);

        if (this.#knowsCommand(commandType)) {
            var commandToExecute = this.#getMethodString(commandType);
            if (commandToExecute === Commands.GLOBAL.method) {
                this.globalMsg(socket, context, commandArgs, username); //moderatorUsername is only needed for global Msg
            }
            else {
                this[commandToExecute](socket, context, commandArgs); // we need to check commandArgs for undefined
            }
        } else {
            this['unknownCommand'](socket);
        }
    };

    // set all of these to private?
    // also all of these need to be renamed

    /**
     * Sends a global message to all connected participants.
     * Ignores context in which it was send.
     * @method module:CommandHandler#globalMsg
     * 
     * @param {?SocketIO} socket socket instance
     * @param {?CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {String} username participant username
     */
    globalMsg(socket, context, commandArgs, username) {
        // maybe make sure context is allchat?
        this.#checkParamTypes(context, commandArgs);
        TypeChecker.isString(username);

        if (commandArgs.length > 0) {
            var text = commandArgs[0];
            for (var i = 1; i < commandArgs.length; i++) {
                text += " " + commandArgs[i];
            }
            this.#serverController.sendGlobalAnnouncement(username, text);
        }
    };

    /**
     * Sends a global note from VIMSU to all connected participants.
     * Ignores context in which it was send.
     * @method module:CommandHandler#globalNote
     * 
     * @param {?SocketIO} socket socket instance
     * @param {?CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    globalNote(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        var arg = Number.parseInt(commandArgs[0], 10);
        this.#serverController.sendGlobalAnnouncement("VIMSU", Messages.TESTMESSAGES.body[arg]);
    };

    /**
     * Prints help message to the user
     * @method module:CommandHandler#printHelp
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    printHelp(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        this.#serverController.sendLargeNotification(socket.id, context.getHelpMessage());
    };

    /**
     * Prints list of log messages to the user
     * @method module:CommandHandler#logMessages
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logMessages(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        // refactor?
        // commandArgs will be empty
        var msg = context.getMessages();
        var messageHeader = "List of messages posted in " + context.getTitle();
        var messageBody = [];
        for (var i = 0; i < msg.length; i++) {
            messageBody.splice(0, 0, "[" + msg[i].timestamp + "] SenderUsername: " + msg[i].username + " (senderId: " + msg[i].senderID +
                ") has text: " + msg[i].text + " (messageID: " + msg[i].messageID + ")");
        }
        this.#serverController.sendNotification(socket.id, { header: messageHeader, body: messageBody });
    };

    /**
     * Removes user from the context
     * @method module:CommandHandler#removeUser
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {?String} username participant username
     */
    removeUser(socket, context, commandArgs, username) {
        this.#checkParamTypes(context, commandArgs);

        commandArgs.forEach((username) => {
            context.removeUser(username);
        });
    };

    /**
     * Removes message from the context
     * @method module:CommandHandler#removeMessage
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    removeMessage(socket, context, commandArgs) {
        // refactor?
        // can we do something here that we can remove messages both by id and by sender?

        this.#checkParamTypes(context, commandArgs);

        var criterion;
        if (commandArgs[0] == Commands.REMOVEMESSAGESBYPLAYER.string) {
            criterion = "username";
            commandArgs.slice(1);
        } else {
            criterion = "messageID";
        }
        var msg = context.getMessages();
        var toWarn = [];
        for (var i = 0; i < msg.length; i++) {
            var message = msg[i]
            if (commandArgs.includes(message[criterion].toString())) {
                toWarn.push(msg[i].senderID);
                msg.splice(i, 1);
                i--; // This is important, as without it, we could not remove
                // two subsequent messages
            }
        }
        toWarn.forEach((senderID) => {
            this.#serverController.sendNotification(this.#serverController.getSocketId(senderID),
                Messages.WARNING);
        });
        context.updateMessages();
    };

    /**
     * Removes all messages of a participant
     * @method module:CommandHandler#removeAllBy
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    removeAllBy(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        commandArgs.splice(0, 0, Commands.REMOVEMESSAGESBYPLAYER.string);
        this.removeMessage(socket, context, commandArgs);
    };

    /**
     * Show all messages of a participant
     * @method module:CommandHandler#showAllBy
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    showAllBy(socket, context, commandArgs) {
        // refactor?
        this.#checkParamTypes(context, commandArgs);

        var msg = context.getMessages();
        var messageHeader = "List of messages posted in " + context.getTitle();
        var messageBody = [];
        for (var i = 0; i < msg.length; i++) {
            if (commandArgs.includes(msg[i].username.toString())) {
                messageBody.splice(0, 0, "[" + msg[i].timestamp + "] SenderUsername: " + msg[i].username + " (senderId: " + msg[i].senderID +
                    ") has text: " + msg[i].text + " (messageID: " + msg[i].messageID + ")");
            }
        }
        this.#serverController.sendNotification(socket.id, { header: messageHeader, body: messageBody });
    };

    /**
     * Mutes participant from this context
     * @method module:CommandHandler#muteUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    muteUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        commandArgs.forEach((username) => {
            context.muteUser(username);
        });
    };

    /**
     * Unmutes participant from this context
     * @method module:CommandHandler#unmuteUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    unmuteUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        commandArgs.forEach((username) => {
            context.unmuteUser(username);
        });
    };

    /**
     * Closes context
     * @method module:CommandHandler#close
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    close(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        context.close();
    };

    /**
     * Gives all available doors with ID to Moderator
     * @method module:CommandHandler#logAllDoors
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logAllDoors(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let roomDecorators = this.#serverController.getRoomDecorators();
        let header = "List of all exisiting Doors";
        let body = [];
        for (let i = 0; i < roomDecorators.length; i++) {
            let room = roomDecorators[i].getRoom();
            let doors = room.getListOfDoors();
            for (let j = 0; j < doors.length; j++) {
                body.splice(0, 0,  doors[j].getName() + " in " + room.getTypeOfRoom() + " has ID " +  doors[j].getId() + ". Door is currently " + 
                ((doors[j].isOpen()) ? "open" : "closed") + 
                ((doors[j].hasCodeToOpen()) ? (" and has code " + doors[j].getCodeToOpen() + " to open it.") : (" and has no code to open it.")));
            }
        }
        this.#serverController.sendNotification(socket.id, { header: header, body: body });
    }

    /**
     * Closes the door with the passed ID
     * @method module:CommandHandler#closeDoor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    closeDoor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let doorID = commandArgs[0];
        let door = this.#serverController.getDoorByID(doorID);
        let closed = false;

        if (door !== undefined) {
            door.closeDoor();
            closed = true;
        }

        if (closed) {
            let header = "Successfully closed door";
            let body = "You successfully closed the door with the ID " + doorID + " for all users.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNDOORID);
        }
    }

    /**
     * Opens the door with the passed ID
     * @method module:CommandHandler#openDoor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    openDoor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let doorID = commandArgs[0];
        let door = this.#serverController.getDoorByID(doorID);
        let opened = false;

        if (door !== undefined) {
            door.openDoor();
            opened = true;
        }


        if (opened) {
            let header = "Successfully opened door";
            let body = "You successfully opened the door with the ID " + doorID + " for all users.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNDOORID);
        }
    }

    /**
     * Closes the door with the passed ID for all passed users
     * @method module:CommandHandler#closeDoorFor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    closeDoorFor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let doorID = commandArgs[0];
        let usernames = commandArgs.slice(1);
        let ppantIDs = [];
   
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
                return; 
            }
            ppantIDs.push(ppantID);
        }
       
        let door = this.#serverController.getDoorByID(doorID);
        let closed = false;

        if (door !== undefined) {
            ppantIDs.forEach(ppantID => {
                door.closeDoorFor(ppantID);
            });
            closed = true;
        }

        if (closed) {
            let header = "Successfully closed door";
            let body = "You successfully closed the door with the ID " + doorID + " for all passed users.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNDOORID);
        }
    }

    /**
     * Opens the door with the passed ID for all passed users
     * @method module:CommandHandler#openDoorFor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    openDoorFor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let doorID = commandArgs[0];
        let usernames = commandArgs.slice(1);
        let ppantIDs = [];
        
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
                return; 
            }
            ppantIDs.push(ppantID);
        }

        let door = this.#serverController.getDoorByID(doorID);
        let opened = false;

        if (door !== undefined) {
            ppantIDs.forEach(ppantID => {
                door.openDoorFor(ppantID);
            });
            opened = true;
        }

        if (opened) {
            let header = "Successfully opened door";
            let body = "You successfully opened the door with the ID " + doorID + " for all passed users.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNDOORID);
        }
    }

    /**
     * Closes all existing doors for all passed users
     * @method module:CommandHandler#closeAllDoorsFor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    closeAllDoorsFor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let usernames = commandArgs;
        let ppantIDs = [];
   
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
                return; 
            }
            ppantIDs.push(ppantID);
        }
       
        let doors = this.#serverController.getAllDoors();
      
        doors.forEach(door => {
            ppantIDs.forEach(ppantID => {
                door.closeDoorFor(ppantID);
            });
        });

        this.#serverController.sendNotification(socket.id, Messages.CLOSEDALLDOORS)
    }

    /**
     * Opens all existing doors for all passed users
     * @method module:CommandHandler#openAllDoorsFor
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    openAllDoorsFor(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let usernames = commandArgs;
        let ppantIDs = [];
   
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
                return; 
            }
            ppantIDs.push(ppantID);
        }
       
        let doors = this.#serverController.getAllDoors();
      
        doors.forEach(door => {
            ppantIDs.forEach(ppantID => {
                door.openDoorFor(ppantID);
            });
        });

        this.#serverController.sendNotification(socket.id, Messages.OPENEDALLDOORS)
    }

    /**
     * Sets the door code of the door with the passed ID to the passed String
     * @method module:CommandHandler#setDoorCode
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    setDoorCode(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let doorID = commandArgs[0];
        let code = commandArgs[1];

        let door = this.#serverController.getDoorByID(doorID);

        if (door !== undefined) {
            door.setCodeToOpen(code);
            let header = "Code set successfully";
            let body = "You successfully set the door code of the door with the ID " + doorID + " to " + code + ".";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNDOORID);
        }
    }

    /**
     * Ports moderator who executed this command to passed position
     * @method module:CommandHandler#portTo
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    portTo(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let roomID = parseInt(commandArgs[0], 10);
        let cordX = parseInt(commandArgs[1], 10);
        let cordY = parseInt(commandArgs[2], 10);

        //moderator sent invalid position data
        if (isNaN(roomID) || isNaN(cordX) || isNaN(cordY)) {
            this.#serverController.sendNotification(socket.id, Messages.TELEPORTFAIL);
            return;
        }

        let moderatorID = socket.ppantID;

        //teleport was successful
        if (this.#serverController.teleportParticipantToPosition(moderatorID, new Position(roomID, cordX, cordY))) {
            this.#serverController.sendNotification(socket.id, Messages.TELEPORTSUCCESS);
        } else {
            this.#serverController.sendNotification(socket.id, Messages.TELEPORTFAIL);
        }
    }

    /**
     * Ports moderator who executed this command to user with passed username
     * @method module:CommandHandler#portToUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    portToUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let username = commandArgs[0];
        let moderatorID = socket.ppantID;

        //teleport was successful
        if (this.#serverController.teleportParticipantToParticipant(moderatorID, username)) {
            this.#serverController.sendNotification(socket.id, Messages.TELEPORTSUCCESS);
        } else {
            this.#serverController.sendNotification(socket.id, Messages.TELEPORTUSERFAIL);
        }    
    }

    /**
     * Mods user with passed username
     * @method module:CommandHandler#modUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    modUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let username = commandArgs[0];

        if (this.#serverController.setModState(username, true)) {
            let header = "Mod status set successfully";
            let body = username + " is now a moderator.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
        }
    }

    /**
     * Unmods user with passed username
     * @method module:CommandHandler#unmodUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    unmodUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let username = commandArgs[0];

        if (this.#serverController.setModState(username, false)) {
            let header = "Mod status set successfully";
            let body = username + " is no longer a moderator.";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
        }
    }

    /**
     * Creates a new group
     * @method module:CommandHandler#createGroup
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    createGroup(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        let groupName = commandArgs[0];

        /* parse first character of color string from lowercase to uppercase (e.g. blue to Blue) */
        let groupColor = commandArgs[1].substring(0, 1).toUpperCase() + commandArgs[1].substring(1);
        let usernames = commandArgs.slice(2);

        try {
            TypeChecker.isEnumOf(groupColor, ShirtColor);
        } catch (e) {
            this.#serverController.sendNotification(socket.id, Messages.UNKNOWNCOLOR);
            return;
        }

        let memberIDs = [];
        
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, Messages.UNKNOWNUSERNAME);
                return; 
            }
            memberIDs.push(ppantID);
        }

        if (this.#serverController.createGroup(groupName, groupColor, memberIDs)) {
            let header = "Group successfully created";
            let body = "Successfully created group " + groupName + ".";
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        } else {
            this.#serverController.sendNotification(socket.id, Messages.INVALIDGROUPNAME);
        } 
    }

    /**
     * Sends notification on unknown command
     * @method module:CommandHandler#unknownCommand
     * 
     * @param {SocketIO} socket socket instance
     */
    unknownCommand(socket) {
        this.#serverController.sendNotification(socket.id, Messages.UNKNOWNCOMMAND);
    }

    /**
     * @private Checks if command is known
     * 
     * @method module:CommandHandler#knowsCommand
     * 
     * @param {Commands.string} commandType command type
     * 
     * @return {boolean} true if known, otherwise false
     */
    #knowsCommand = function (commandType) {

        for (var i = 0; i < this.#commandList.length; i++) {
            if (commandType === this.#commandList[i].string) {
                return true;
            }
        }
        return false
    }

    /**
     * @private Checks parameters' data type
     * @method module:CommandHandler#checkParamTypes
     * 
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    #checkParamTypes = function (context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });
    }

    /**
     * @private Gets method name based on command type
     * 
     * @method module:CommandHandler#getMethodString
     * 
     * @param {Commands.string} commandType command type
     * 
     * @return {String} method name
     */
    #getMethodString = function (commandType) {

        for (var i = 0; i < this.#commandList.length; i++) {
            if (commandType === this.#commandList[i].string) {
                return this.#commandList[i].method;
            }
        }
    }


}
