const AllchatCommands = require('../utils/commands/AllchatCommands.js');
const LectureChatCommands = require('../utils/commands/LectureChatCommands.js');
const DoorCommands = require('../utils/commands/DoorCommands.js');
const GroupCommands = require('../utils/commands/GroupCommands.js');
const MessageCommands = require('../utils/commands/MessageCommands.js');
const PortCommands = require('../utils/commands/PortCommands.js');
const RoomCommands = require('../utils/commands/RoomCommands.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandContext = require('./CommandContext.js');
const Position = require('../models/Position.js');
const ShirtColor = require('../../client/shared/ShirtColor.js');
const AllchatContext = require('./AllchatContext.js');
const LectureContext = require('./LectureContext.js');

/**
 * The Command Handler Model
 * @module CommandHandler
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class CommandHandler {

    #serverController;
    #allchatCommandList;
    #lectureChatCommandList;
    #doorCommandList;
    #groupCommandList;
    #msgCommandList;
    #portCommandList;
    #roomCommandList;

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

        this.#allchatCommandList = Object.values(AllchatCommands);
        this.#lectureChatCommandList = Object.values(LectureChatCommands);
        this.#doorCommandList = Object.values(DoorCommands);
        this.#groupCommandList = Object.values(GroupCommands);
        this.#msgCommandList = Object.values(MessageCommands);
        this.#portCommandList = Object.values(PortCommands);
        this.#roomCommandList = Object.values(RoomCommands);
    }

    /**
     * Handles a command, where context is the room or lecture in which it was send 
     * and socket the socket from which it was send
     * @method module:CommandHandler#handleCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handleCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);

        // commandArgs will be an array containing the command-string in first place
        var commandType = commandArgs[0];
        commandArgs = commandArgs.slice(1);

        if (context instanceof AllchatContext) {
            var commandList = this.#allchatCommandList;
        } else if (context instanceof LectureContext) {
            var commandList = this.#lectureChatCommandList;
        }

        if (this.#knowsCommand(commandList, commandType)) {
            var commandToExecute = this.#getMethodString(commandList, commandType);
            this[commandToExecute](socket, context, commandArgs); // we need to check commandArgs for undefined
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
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, messages.help.listOfDoorCommands);
        } else {
            let doorCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);

            if (this.#knowsCommand(this.#doorCommandList, doorCommandType)) {
                var commandToExecute = this.#getMethodString(this.#doorCommandList, doorCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, messages.door.unknownCommand);
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
        const messages = socket.messages;
    
        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, messages.help.listOfGroupCommands);
        } else {
            let groupCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#groupCommandList, groupCommandType)) {
                var commandToExecute = this.#getMethodString(this.#groupCommandList, groupCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, messages.group.unknownCommand);
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
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, messages.help.listOfMessageCommands);
        } else {
            let msgCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#msgCommandList, msgCommandType)) {
                var commandToExecute = this.#getMethodString(this.#msgCommandList, msgCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, messages.allchat.unknownCommand);
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
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, messages.help.listOfPortCommands);
        } else {
            let portCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#portCommandList, portCommandType)) {
                var commandToExecute = this.#getMethodString(this.#portCommandList, portCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, messages.port.unknownCommand);
            }
        }
    }

    /**
     * Handles a room command, where context is the room in which it was send 
     * @method module:CommandHandler#handleRoomCommand
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    handleRoomCommand(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendLargeNotification(socket.id, messages.help.listOfRoomCommands);
        } else {
            let roomCommandType = commandArgs[0];
            commandArgs = commandArgs.slice(1);
        
            if (this.#knowsCommand(this.#roomCommandList, roomCommandType)) {
                var commandToExecute = this.#getMethodString(this.#roomCommandList, roomCommandType);
                this[commandToExecute](socket, context, commandArgs);
            } else {
                this.#serverController.sendNotification(socket.id, messages.room.unknownCommand);
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
    globalMsg(socket, context, commandArgs) {
        // maybe make sure context is allchat?
        this.#checkParamTypes(context, commandArgs);
        let username = socket.username;

        if (commandArgs.length > 0) {
            var text = commandArgs[0];
            for (var i = 1; i < commandArgs.length; i++) {
                text += " " + commandArgs[i];
            }
            this.#serverController.sendGlobalAnnouncement(username, text);
        }
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

        this.#serverController.sendLargeNotification(socket.id, context.getHelpMessage(socket.messages));
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
     */
    removeUser(socket, context, commandArgs) {
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
            let socketID = this.#serverController.getSocketId(senderID);
            let socketObject = this.#serverController.getSocketObject(socketID);
            let warningMsgInSenderLanguage = socketObject.languageData.messages.general.warning;

            this.#serverController.sendNotification(socketID, warningMsgInSenderLanguage);
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
     * Gives a list of all currently online participants with their username to Moderator
     * @method module:CommandHandler#logAllParticipants
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logAllParticipants(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;
        
        let ppants = this.#serverController.getOnlineParticipants();
        let allUsernames = [];
        for (let i = 0; i < ppants.length; i++) {
            allUsernames.push(ppants[i].getBusinessCard().getUsername());
        } 

        //Should never happen, because at least moderator who executed this command is online
        if (allUsernames.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
        } else {
            this.#serverController.sendNotification(socket.id, {header: messages.msgParts.userLogHeader, body: allUsernames});
        }
    }

    /**
     * Gives a list of all currently online participants that are in room with passed roomID with their username to Moderator
     * @method module:CommandHandler#logAllParticipantsByRoom
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logAllParticipantsByRoom(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;
        
        //no roomID was passed
        if (commandArgs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.room.noRoomIDPassed);
            return;
        }
        
        let roomID = parseInt(commandArgs[0], 10);
        let room = this.#serverController.getRoomById(roomID);

        //roomID was passed, but is not valid
        if (room === undefined) {
            this.#serverController.sendNotification(socket.id, messages.room.roomNotFound);
            return;
        }

        let roomName = room.getRoomName();
        let ppants = room.getListOfPPants();
        let allUsernames = [];
        for (let i = 0; i < ppants.length; i++) {
            allUsernames.push(ppants[i].getBusinessCard().getUsername());
        } 

        if (allUsernames.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
        } else {
            this.#serverController.sendNotification(socket.id, {header: messages.msgParts.room.userLogHeader.replace('roomNamePlaceholder', roomName), body: allUsernames});
        }
    }

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
        const messages = socket.messages;

        let rooms = this.#serverController.getRooms();
        let header = messages.msgParts.room.roomLogHeader;
        let body = [];
        for (let i = 0; i < rooms.length; i++) {
            body.splice(0, 0,  messages.msgParts.room.roomLogBodyPart.replace('roomNamePlaceholder', rooms[i].getRoomName()).replace('roomIDPlaceholder', rooms[i].getRoomId()));
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
        const messages = socket.messages;

        let rooms = this.#serverController.getRooms();
        let header = messages.msgParts.door.doorLogHeader;
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
                if (doors[j].isLectureDoor()) {
                    if (doors[j].hasCodeToOpen()) {
                        var bodyPart = messages.msgParts.door.doorLogBodyPartLectureDoorWithCode.replace('roomNamePlaceholder', room.getRoomName()).replace(
                            'doorIDPlaceholder', doors[j].getId()).replace('openStatusPlaceholder', (doors[j].isOpen() ? messages.msgParts.door.open : messages.msgParts.door.closed)).replace(
                            'codePlaceholder', doors[j].getCodeToOpen());
                    } else {
                        var bodyPart = messages.msgParts.door.doorLogBodyPartLectureDoorNoCode.replace('roomNamePlaceholder', room.getRoomName()).replace(
                            'doorIDPlaceholder', doors[j].getId()).replace('openStatusPlaceholder', (doors[j].isOpen() ? messages.msgParts.door.open : messages.msgParts.door.closed))
                    }
                } else {
                    if (doors[j].hasCodeToOpen()) {
                        var bodyPart = messages.msgParts.door.doorLogBodyPartNormalDoorWithCode.replace('roomName1Placeholder', room.getRoomName()).replace(
                            'doorIDPlaceholder', doors[j].getId()).replace('openStatusPlaceholder', (doors[j].isOpen() ? messages.msgParts.door.open : messages.msgParts.door.closed)).replace(
                            'codePlaceholder', doors[j].getCodeToOpen()).replace('roomName2Placeholder', targetRoomName);
                    } else {
                        var bodyPart = messages.msgParts.door.doorLogBodyPartNormalDoorNoCode.replace('roomName1Placeholder', room.getRoomName()).replace(
                            'doorIDPlaceholder', doors[j].getId()).replace('openStatusPlaceholder', (doors[j].isOpen() ? messages.msgParts.door.open : messages.msgParts.door.closed)).replace(
                            'roomName2Placeholder', targetRoomName);
                    }
                }
                body.splice(0, 0, bodyPart);
            }
        }

        if (body.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.door.noDoors);
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
        const messages = socket.messages;

        let doorID = commandArgs[0];
        let door = this.#serverController.getDoorByID(doorID);
        let closed = false;

        if (door !== undefined) {
            door.closeDoor();
            closed = true;
        }

        if (closed) {
            let msg = JSON.parse(JSON.stringify(messages.door.closedDoorForAll));
            msg.body = msg.body.replace('doorIDPlaceholder', doorID);
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.door.unknownDoorID);
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
        const messages = socket.messages;

        let doorID = commandArgs[0];
        let door = this.#serverController.getDoorByID(doorID);
        let opened = false;

        if (door !== undefined) {
            door.openDoor();
            opened = true;
        }

        if (opened) {
            let msg = JSON.parse(JSON.stringify(messages.door.openedDoorForAll));
            msg.body = msg.body.replace('doorIDPlaceholder', doorID);
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.door.unknownDoorID);
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
        const messages = socket.messages;

        let doorID = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let participantData = this.#findOnlineParticipantIDs(usernames);
        let ppantIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;
       
        let door = this.#serverController.getDoorByID(doorID);
        let closed = false;

        if (door !== undefined) {
            ppantIDs.forEach(ppantID => {
                door.closeDoorFor(ppantID);
            });
            closed = true;
        }

        if (closed) {
            let msg = JSON.parse(JSON.stringify(messages.door.closedDoor));
            msg.body = msg.body.replace('doorIDPlaceholder', doorID) + (unknownUsernames.length > 0 
                ? messages.msgParts.usersThatWereNotFound + unknownUsernames
                : "");
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.door.unknownDoorID);
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
        const messages = socket.messages;

        let doorID = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let participantData = this.#findOnlineParticipantIDs(usernames);
        let ppantIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;

        let door = this.#serverController.getDoorByID(doorID);
        let opened = false;

        if (door !== undefined) {
            ppantIDs.forEach(ppantID => {
                door.openDoorFor(ppantID);
            });
            opened = true;
        }

        if (opened) {
            let msg = JSON.parse(JSON.stringify(messages.door.openedDoor));
            msg.body = msg.body.replace('doorIDPlaceholder', doorID) + (unknownUsernames.length > 0 
                ? messages.msgParts.usersThatWereNotFound + unknownUsernames
                : "");
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.door.unknownDoorID);
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
        const messages = socket.messages;

        let usernames = commandArgs;

        let participantData = this.#findOnlineParticipantIDs(usernames);
        let ppantIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;
       
        let doors = this.#serverController.getAllDoors();
      
        doors.forEach(door => {
            ppantIDs.forEach(ppantID => {
                door.closeDoorFor(ppantID);
            });
        });

        let msg = JSON.parse(JSON.stringify(messages.door.closedAllDoorsFor));
        msg.body = msg.body + (unknownUsernames.length > 0 
            ? messages.msgParts.usersThatWereNotFound + unknownUsernames
            : "");
        this.#serverController.sendNotification(socket.id, msg);
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
        const messages = socket.messages;

        let usernames = commandArgs;
   
        let participantData = this.#findOnlineParticipantIDs(usernames);
        let ppantIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;
       
        let doors = this.#serverController.getAllDoors();
      
        doors.forEach(door => {
            ppantIDs.forEach(ppantID => {
                door.openDoorFor(ppantID);
            });
        });

        let msg = JSON.parse(JSON.stringify(messages.door.openedAllDoorsFor));
        msg.body = msg.body + (unknownUsernames.length > 0 
            ? messages.msgParts.usersThatWereNotFound + unknownUsernames
            : "");
        this.#serverController.sendNotification(socket.id, msg);
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
        const messages = socket.messages;

        let doorID = commandArgs[0];
        let code = commandArgs[1];

        let door = this.#serverController.getDoorByID(doorID);

        if (door !== undefined) {
            if (code !== undefined) {
                door.setCodeToOpen(code);
                let msg = JSON.parse(JSON.stringify(messages.door.setDoorCode));
                msg.body = msg.body.replace('doorIDPlaceholder', doorID).replace('codePlaceholder', code);
                this.#serverController.sendNotification(socket.id, msg);
            } else {
                this.#serverController.sendNotification(socket.id, messages.door.invalidDoorCode);
            }
        } else {
            this.#serverController.sendNotification(socket.id, messages.door.unknownDoorID);
        }
    }

    /**
     * Ports a user to a position or to another user
     * @method module:CommandHandler#portUser
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    portUser(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
            return;
        }

        let username = commandArgs[0];
        let userId = this.#serverController.getIdOfOnlineParticipant(username);

        if (userId === undefined) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
            return;
        }
        
        if (commandArgs[1] === "topos") {
            if (commandArgs.length < 5) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
                return;
            }

            let roomID = parseInt(commandArgs[2], 10);
            let cordX = parseInt(commandArgs[3], 10);
            let cordY = parseInt(commandArgs[4], 10);
            
            if (isNaN(roomID) || isNaN(cordX) || isNaN(cordY)) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
                return;
            }

            //teleport was successful
            if (this.#serverController.teleportParticipantToPosition(userId, new Position(roomID, cordX, cordY))) {
                this.#serverController.sendNotification(socket.id, messages.port.success);
            //teleport fail, could be because of an invalid position or collision
            } else {
                this.#serverController.sendNotification(socket.id, messages.port.userPortFail);
            }
        } else if (commandArgs[1] === "touser") {
            if (commandArgs.length < 3) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
                return;
            }
            
            let targetUsername = commandArgs[2];
            let targetUserId = this.#serverController.getIdOfOnlineParticipant(targetUsername);

            if (targetUserId === undefined) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
                return;
            }

            //teleport was successful
            if (this.#serverController.teleportParticipantToParticipant(userId, targetUserId)) {
                this.#serverController.sendNotification(socket.id, messages.port.success);
            //teleport fail, could be because of one the ppants went offline during execution
            } else {
                this.#serverController.sendNotification(socket.id, messages.port.userPortFail);
            }
        } else {
            this.#serverController.sendNotification(socket.id, messages.port.invalidUserPort);
        }
    }

    /**
     * Ports a group to a position or to another user
     * @method module:CommandHandler#portGroup
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    portGroup(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
            return;
        }

        let groupName = commandArgs[0];
        
        if (commandArgs[1] === "topos") {
            if (commandArgs.length < 5) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
                return;
            }

            let roomID = parseInt(commandArgs[2], 10);
            let cordX = parseInt(commandArgs[3], 10);
            let cordY = parseInt(commandArgs[4], 10);
            
            if (isNaN(roomID) || isNaN(cordX) || isNaN(cordY)) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
                return;
            }

            //teleport was successful
            if (this.#serverController.teleportGroupToPosition(groupName, new Position(roomID, cordX, cordY))) {
                this.#serverController.sendNotification(socket.id, messages.port.success);
            //teleport fail, could be because group does not exist or no group members are online
            } else {
                this.#serverController.sendNotification(socket.id, messages.port.groupPortFail);
            }
        } else if (commandArgs[1] === "touser") {
            if (commandArgs.length < 3) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
                return;
            }
            
            let targetUsername = commandArgs[2];
            let targetUserId = this.#serverController.getIdOfOnlineParticipant(targetUsername);

            if (targetUserId === undefined) {
                this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
                return;
            }

            //teleport was successful
            if (this.#serverController.teleportGroupToParticipant(groupName, targetUserId)) {
                this.#serverController.sendNotification(socket.id, messages.port.success);
            //teleport fail, could be because target ppant went offline during execution or group does not exist or no group members are online
            } else {
                this.#serverController.sendNotification(socket.id, messages.port.groupPortFail);
            }
        } else {
            this.#serverController.sendNotification(socket.id, messages.port.invalidGroupPort);
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
        const messages = socket.messages;

        let username = commandArgs[0];

        if (username === undefined) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsernamePassed)
        } else {
            this.#serverController.setModState(username, true).then(res => {
                if (res) {
                    let msg = JSON.parse(JSON.stringify(messages.mod.modSet));
                    msg.body = msg.body.replace('usernamePlaceholder', username);
                    this.#serverController.sendNotification(socket.id, msg);
                } else {
                    this.#serverController.sendNotification(socket.id, messages.general.unknownUsername);
                }
            });
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
        const messages = socket.messages;

        let username = commandArgs[0];

        if (username === undefined) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsernamePassed)
        } else {
            this.#serverController.setModState(username, false).then(res => {
                if (res) {
                    let msg = JSON.parse(JSON.stringify(messages.mod.unmodSet));
                    msg.body = msg.body.replace('usernamePlaceholder', username);
                    this.#serverController.sendNotification(socket.id, msg);
                } else {
                    this.#serverController.sendNotification(socket.id, messages.general.unknownUsername);
                }
            });
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
    async createGroup(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 3) {
            this.#serverController.sendNotification(socket.id, messages.general.invalidParameters);
            return;
        }

        let groupName = commandArgs[0];
        /* parse first character of color string from lowercase to uppercase (e.g. blue to Blue) */
        let groupColor = commandArgs[1].substring(0, 1).toUpperCase() + commandArgs[1].substring(1);
        let usernames = commandArgs.slice(2);

        try {
            TypeChecker.isEnumOf(groupColor, ShirtColor);
        } catch (e) {
            this.#serverController.sendNotification(socket.id, messages.group.unknownColor);
            return;
        }

        let participantData = await this.#findParticipantIDs(usernames);
        let memberIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;
        
        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
            return;
        }

        if (this.#serverController.createGroup(groupName, groupColor, memberIDs)) {
            let msg = JSON.parse(JSON.stringify(messages.group.created));
            msg.body = msg.body.replace('groupNamePlaceholder', groupName) + (unknownUsernames.length > 0 
                ? messages.msgParts.usersThatWereNotFound + unknownUsernames
                : "");
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.group.invalidName);
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
        const messages = socket.messages;

        if (commandArgs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.invalidParameters);
            return;
        }

        let groupName = commandArgs[0];

        if (this.#serverController.deleteGroup(groupName)) {
            let msg = JSON.parse(JSON.stringify(messages.group.deleted));
            msg.body = msg.body.replace('groupNamePlaceholder', groupName);
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.group.notExists);
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
        const messages = socket.messages;

        this.#serverController.deleteAllGroups();
        this.#serverController.sendNotification(socket.id, messages.group.deletedAll);
    } 
    

    /**
     * Adds all passed users to group with passed groupName
     * @method module:CommandHandler#addGroupMember
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    async addGroupMember(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 2) {
            this.#serverController.sendNotification(socket.id, messages.general.invalidParameters);
            return;
        }

        let groupName = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let participantData = await this.#findParticipantIDs(usernames);
        let memberIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;

        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
            return;
        }

        if (this.#serverController.addGroupMember(groupName, memberIDs)) {
            let msg = JSON.parse(JSON.stringify(messages.group.addedUsers));
            msg.body = msg.body.replace('groupNamePlaceholder', groupName) + (unknownUsernames.length > 0 
                ? messages.msgParts.usersThatWereNotFound + unknownUsernames
                : "");
            this.#serverController.sendNotification(socket.id, msg)
        } else {
            this.#serverController.sendNotification(socket.id, messages.group.notExists);
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
    async removeGroupMember(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        if (commandArgs.length < 2) {
            this.#serverController.sendNotification(socket.id, messages.general.invalidParameters);
            return;
        }

        let groupName = commandArgs[0];
        let usernames = commandArgs.slice(1);

        let participantData = await this.#findParticipantIDs(usernames);
        let memberIDs = participantData.ppantIDs;
        let unknownUsernames = participantData.unknownUsernames;

        if (memberIDs.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.general.noUsersFound);
            return;
        }

        if (this.#serverController.removeGroupMember(groupName, memberIDs)) {
            let msg = JSON.parse(JSON.stringify(messages.group.removedUsers));
            msg.body = msg.body.replace('groupNamePlaceholder', groupName) + (unknownUsernames.length > 0 
                ? messages.msgParts.usersThatWereNotFound + unknownUsernames
                : "");
            this.#serverController.sendNotification(socket.id, msg);
        } else {
            this.#serverController.sendNotification(socket.id, messages.group.notExists);
        } 
    }

    /**
     * Gives all existing groups with group name and color to Moderator
     * @method module:CommandHandler#logAllGroups
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logAllGroups(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        let groups = this.#serverController.getGroups();
        let groupInfo = [];

        groups.forEach(group => {
            groupInfo.push(messages.msgParts.group.groupLogBodyPart.replace('groupNamePlaceholder', group.getName()).replace('colorPlaceholder', group.getShirtColor()));
        })

        if (groupInfo.length < 1) {
            this.#serverController.sendNotification(socket.id, messages.group.noGroupsExist);
        } else {
            this.#serverController.sendNotification(socket.id, {header: messages.msgParts.group.groupLogHeader, body: groupInfo});
        }
    }

    /**
     * Gives a list of member usernames that are part of group with passed groupname to Moderator
     * @method module:CommandHandler#logGroupMembers
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    async logGroupMembers(socket, context, commandArgs) {
        this.#checkParamTypes(context, commandArgs);
        const messages = socket.messages;

        let groupName = commandArgs[0];
        if (groupName === undefined) {
            this.#serverController.sendNotification(socket.id, messages.group.noNamePassed);
            return;
        }
        let group = this.#serverController.getGroup(groupName);

        if (group === undefined) {
            this.#serverController.sendNotification(socket.id, messages.group.notExists);
            return;
        }

        let memberIDs = group.getGroupMemberIDs();
        let allUsernames = [];
        for (let i = 0; i < memberIDs.length; i++) {
            let username = await this.#serverController.getUsernameOfParticipant(memberIDs[i]);
            if (username) {
                allUsernames.push(username);
            }   
        }

        this.#serverController.sendNotification(socket.id, {
            header: messages.msgParts.group.userLogHeader.replace('groupNamePlaceholder', groupName), 
            body: allUsernames
        });
    }

    /**
     * Sends notification on unknown command
     * @method module:CommandHandler#unknownCommand
     * 
     * @param {SocketIO} socket socket instance
     */
    unknownCommand(socket) {
        const messages = socket.messages;
        this.#serverController.sendNotification(socket.id, messages.general.unknownCommand);
    }

    /**
     * @private Tries to find IDs for the passed usernames, doesn't matter if user is online or not
     * 
     * @method module:CommandHandler#findParticipantIDs
     * 
     * @param {String[]} usernames
     * 
     * @return {Object} contains found IDs and also usernames, for which no ID was found. No duplicates included
     */
    #findParticipantIDs = async function (usernames) {
        let usernamesWithoutDuplicates = [];
        for (let i = 0; i < usernames.length; i++) {
            if (!usernamesWithoutDuplicates.includes(usernames[i])) {
                usernamesWithoutDuplicates.push(usernames[i]);
            }
        }

        let ppantIDs = [];
        let unknownUsernames = [];
        
        for (let i = 0; i < usernamesWithoutDuplicates.length; i++) {
            let ppantID = await this.#serverController.getIdOfParticipant(usernamesWithoutDuplicates[i]);
            if (ppantID === undefined) {
                unknownUsernames.push(usernamesWithoutDuplicates[i]);
            } else {
                ppantIDs.push(ppantID);
            }
        }

        return {ppantIDs: ppantIDs, unknownUsernames: unknownUsernames};
    }

    /**
     * @private Tries to find IDs for the passed usernames if they are currently online
     * 
     * @method module:CommandHandler#findOnlineParticipantIDs
     * 
     * @param {String[]} usernames
     * 
     * @return {Object} contains found IDs and also usernames, for which no ID was found. No duplicates included
     */
    #findOnlineParticipantIDs = function (usernames) {
        let usernamesWithoutDuplicates = [];
        for (let i = 0; i < usernames.length; i++) {
            if (!usernamesWithoutDuplicates.includes(usernames[i])) {
                usernamesWithoutDuplicates.push(usernames[i]);
            }
        }
        
        let ppantIDs = [];
        let unknownUsernames = [];

        for (let i = 0; i < usernamesWithoutDuplicates.length; i++) {
            let ppantID = this.#serverController.getIdOfOnlineParticipant(usernamesWithoutDuplicates[i]);
            if (ppantID === undefined) {
                unknownUsernames.push(usernamesWithoutDuplicates[i]);
            } else {
                ppantIDs.push(ppantID);
            }
        }

        return {ppantIDs: ppantIDs, unknownUsernames: unknownUsernames};
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
