const Commands = require('../utils/commands/Commands.js');
const DoorCommands = require('../utils/commands/DoorCommands.js');
const GroupCommands = require('../utils/commands/GroupCommands.js');
const MessageCommands = require('../utils/commands/MessageCommands.js');
const PortCommands = require('../utils/commands/PortCommands.js');
const CommandMessages = require('../utils/messages/CommandMessages.js');
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

    #serverController;
    #commandList;
    #doorCommandList;
    #groupCommandList;
    #msgCommandList;
    #portCommandList;

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

        this.#commandList = Object.values(Commands);
        this.#doorCommandList = Object.values(DoorCommands);
        this.#groupCommandList = Object.values(GroupCommands);
        this.#msgCommandList = Object.values(MessageCommands);
        this.#portCommandList = Object.values(PortCommands);
    }

    /**
     * Handles a command, where context is the room or lecture in which it was send 
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

        if (this.#knowsCommand(this.#commandList, commandType)) {
            var commandToExecute = this.#getMethodString(this.#commandList, commandType);
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

    /**
     * Handles a door command, where context is the room in which it was send 
     * @method module:CommandHandler#handleDoorCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handleDoorCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, CommandMessages.DOORCOMMANDS);
        } else {
            let doorCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);

            if (this.#knowsCommand(this.#doorCommandList, doorCommandType)) {
                var commandToExecute = this.#getMethodString(this.#doorCommandList, doorCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORCOMMAND);
            }
        }
    }

    /**
     * Handles a group command, where context is the room in which it was send 
     * @method module:CommandHandler#handleGroupCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handleGroupCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
    
        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, CommandMessages.GROUPCOMMANDS);
        } else {
            let groupCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#groupCommandList, groupCommandType)) {
                var commandToExecute = this.#getMethodString(this.#groupCommandList, groupCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNGROUPCOMMAND);
            }
        }
    }

    /**
     * Handles a message command, where context is the room in which it was send 
     * @method module:CommandHandler#handleMsgCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handleMsgCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
    
        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, CommandMessages.MESSAGECOMMANDS);
        } else {
            let msgCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#msgCommandList, msgCommandType)) {
                var commandToExecute = this.#getMethodString(this.#msgCommandList, msgCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNMSGCOMMAND);
            }
        }
    }

    /**
     * Handles a port command, where context is the room in which it was send 
     * @method module:CommandHandler#handleGroupCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handlePortCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, CommandMessages.PORTCOMMANDS);
        } else {
            let portCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#portCommandList, portCommandType)) {
                var commandToExecute = this.#getMethodString(this.#portCommandList, portCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNPORTCOMMAND);
            }
        }
    }

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
        this.#serverController.sendGlobalAnnouncement("VIMSU", CommandMessages.TESTMESSAGES.body[arg]);
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
        if (commandArgs[0] == MessageCommands.REMOVEMESSAGESBYPLAYER.string) {
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
                CommandMessages.WARNING);
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

        commandArgs.splice(0, 0, MessageCommands.REMOVEMESSAGESBYPLAYER.string);
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
     * Gives all available rooms with ID to Moderator
     * @method module:CommandHandler#logAllRooms
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logAllRooms(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
    
        let rooms = this.#serverController.getRooms();
        let header = "List of all exisiting Rooms";
        let body = [];
        for (let i = 0; i < rooms.length; i++) {
        
            body.splice(0, 0,  rooms[i].getRoomName() + " has ID " +  rooms[i].getRoomId() + ".");
        }
        this.#serverController.sendNotification(socket.id, { header: header, body: body });
    }

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

        let rooms = this.#serverController.getRooms();
        let header = "List of all exisiting Doors";
        let body = [];
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            let doors = room.getListOfDoors();
            for (let j = 0; j < doors.length; j++) {
                let targetRoomId = doors[j].getTargetRoomId();
                let targetRoomName;
                for (let k = 0; k < rooms.length; k++) {
                    if (targetRoomId === rooms[k].getRoomId()) {
                        targetRoomName = rooms[k].getRoomName();
                    }
                }
                body.splice(0, 0,  "Door in " + room.getRoomName() + 
                ((doors[j].isLectureDoor()) ? (" is a LectureDoor and") : (" to " + targetRoomName))
                + " has ID " +  doors[j].getId() + ". Door is currently " + 
                ((doors[j].isOpen()) ? "open" : "closed") + 
                ((doors[j].hasCodeToOpen()) ? (" and has code " + doors[j].getCodeToOpen() + " to open it.") : (" and has no code to open it.")));
            }
        }

        if (body.length < 1) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NODOORS);
        } else {
            this.#serverController.sendNotification(socket.id, { header: header, body: body });
        }
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
            this.#serverController.sendNotification(socket.id, CommandMessages.CLOSEDDOORFORALL(doorID));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORID);
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
            this.#serverController.sendNotification(socket.id, CommandMessages.OPEPNEDDOORFORALL(doorID));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORID);
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
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
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
            this.#serverController.sendNotification(socket.id, CommandMessages.CLOSEDDOOR(doorID));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORID);
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
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
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
            this.#serverController.sendNotification(socket.id, CommandMessages.OPEPNEDDOOR(doorID));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORID);
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
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
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

        this.#serverController.sendNotification(socket.id, CommandMessages.CLOSEDALLDOORS)
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
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
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

        this.#serverController.sendNotification(socket.id, CommandMessages.OPENEDALLDOORS)
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
            if (code !== undefined) {
                door.setCodeToOpen(code);
                this.#serverController.sendNotification(socket.id, CommandMessages.SETCODE(doorID, code));
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDDOORCODE);
            }
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNDOORID);
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
            this.#serverController.sendNotification(socket.id, CommandMessages.TELEPORTFAIL);
            return;
        }

        let moderatorID = socket.ppantID;

        //teleport was successful
        if (this.#serverController.teleportParticipantToPosition(moderatorID, new Position(roomID, cordX, cordY))) {
            this.#serverController.sendNotification(socket.id, CommandMessages.TELEPORTSUCCESS);
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.TELEPORTFAIL);
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

        if (username === undefined) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERNAME);
        } else {
            let moderatorID = socket.ppantID;

            //teleport was successful
            if (this.#serverController.teleportParticipantToParticipant(moderatorID, username)) {
                this.#serverController.sendNotification(socket.id, CommandMessages.TELEPORTSUCCESS);
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.TELEPORTUSERFAIL);
            }  
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

        if (username === undefined) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERNAME)
        } else {
            if (this.#serverController.setModState(username, true)) {
                this.#serverController.sendNotification(socket.id, CommandMessages.SETMOD(username));
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
            }
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

        if (username === undefined) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERNAME)
        } else {
            if (this.#serverController.setModState(username, false)) {
                this.#serverController.sendNotification(socket.id, CommandMessages.SETUNMOD(username));
            } else {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
            }
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

        if (commandArgs.length < 3) {
            this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDPARAMETERS);
            return;
        }

        let groupName = commandArgs[0];
        /* parse first character of color string from lowercase to uppercase (e.g. blue to Blue) */
        let groupColor = commandArgs[1].substring(0, 1).toUpperCase() + commandArgs[1].substring(1);
        let usernames = commandArgs.slice(2);

        try {
            TypeChecker.isEnumOf(groupColor, ShirtColor);
        } catch (e) {
            this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNCOLOR);
            return;
        }

        let memberIDs = [];
        
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
                return; 
            }
            //Eliminates duplicates
            if (!memberIDs.includes(ppantID)) {
                memberIDs.push(ppantID);
            }
        }
        
        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERSFOUND);
            return;
        }

        if (this.#serverController.createGroup(groupName, groupColor, memberIDs)) {
            this.#serverController.sendNotification(socket.id, CommandMessages.CREATEDGROUP(groupName));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDGROUPNAME);
        } 
    }

    /**
     * Deletes an existing group
     * @method module:CommandHandler#deleteGroup
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    deleteGroup(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        if (commandArgs.length < 1) {
            this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDPARAMETERS);
            return;
        }

        let groupName = commandArgs[0];

        if (this.#serverController.deleteGroup(groupName)) {
            this.#serverController.sendNotification(socket.id, CommandMessages.DELETEDGROUP(groupName));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.GROUPNOTEXISTS);
        } 
    }

    /**
     * Deletes all existing groups
     * @method module:CommandHandler#deleteAllGroups
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
     deleteAllGroups(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        this.#serverController.deleteAllGroups();
        this.#serverController.sendNotification(socket.id, CommandMessages.DELETEDALLGROUPS);
    } 
    

    /**
     * Adds all passed users to group with passed groupName
     * @method module:CommandHandler#addGroupMember
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    addGroupMember(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        if (commandArgs.length < 2) {
            this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDPARAMETERS);
            return;
        }

        let groupName = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let memberIDs = [];
        
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
                return; 
            }
            //Eliminates duplicates
            if (!memberIDs.includes(ppantID)) {
                memberIDs.push(ppantID);
            }
        }

        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERSFOUND);
            return;
        }

        if (this.#serverController.addGroupMember(groupName, memberIDs)) {
            this.#serverController.sendNotification(socket.id, CommandMessages.ADDEDUSERSTOGROUP(groupName));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.GROUPNOTEXISTS);
        } 
    }

    /**
     * Removes all passed users from group with passed groupName
     * @method module:CommandHandler#removeGroupMember
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    removeGroupMember(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        if (commandArgs.length < 2) {
            this.#serverController.sendNotification(socket.id, CommandMessages.INVALIDPARAMETERS);
            return;
        }

        let groupName = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let memberIDs = [];
        
        for (let i = 0; i < usernames.length; i++) {
            let ppantID = this.#serverController.getIdOf(usernames[i]);
            if (ppantID === undefined) {
                this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNUSERNAME);
                return; 
            }
            //Eliminates duplicates
            if (!memberIDs.includes(ppantID)) {
                memberIDs.push(ppantID);
            }
        }

        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, CommandMessages.NOUSERSFOUND);
            return;
        }

        if (this.#serverController.removeGroupMember(groupName, memberIDs)) {
            this.#serverController.sendNotification(socket.id, CommandMessages.RMUSERSFROMGROUP(groupName));
        } else {
            this.#serverController.sendNotification(socket.id, CommandMessages.GROUPNOTEXISTS);
        } 
    }

    /**
     * Sends notification on unknown command
     * @method module:CommandHandler#unknownCommand
     * 
     * @param {SocketIO} socket socket instance
     */
    unknownCommand(socket) {
        this.#serverController.sendNotification(socket.id, CommandMessages.UNKNOWNCOMMAND);
    }

    /**
     * @private Checks if command is known in a certain commandList
     * 
     * @method module:CommandHandler#knowsCommand
     * 
     * @param {Object[]} commandList command list
     * @param {String} commandType command type
     * 
     * @return {boolean} true if known, otherwise false
     */
    #knowsCommand = function (commandList, commandType) {

        for (var i = 0; i < commandList.length; i++) {
            if (commandType === commandList[i].string) {
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
     * @private Gets method name based on command type in a certain command list
     * 
     * @method module:CommandHandler#getMethodString
     * 
     * @param {Object[]} commandList command list
     * @param {String} commandType command type
     * 
     * @return {String} method name
     */
    #getMethodString = function (commandList, commandType) {

        for (var i = 0; i < commandList.length; i++) {
            if (commandType === commandList[i].string) {
                return commandList[i].method;
            }
        }
    }


}
