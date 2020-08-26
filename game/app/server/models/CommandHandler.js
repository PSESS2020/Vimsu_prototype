const Commands = require('../utils/Commands.js');
const Messages = require('../utils/Messages.js');
const ServerController = require('../controller/ServerController.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandContext = require('./CommandContext');

// this can probably be chucked out again and all it's functionality be moved into the context classes?
module.exports = class CommandHandler {

    #serverController
    #commandList

    /**
     * 
     * @param {ServerController} serverController 
     */
    constructor(serverController) {

        if (!!CommandHandler.instance) {
            return CommandHandler.instance;
        }

        CommandHandler.instance = this;

        TypeChecker.isInstanceOf(serverController, ServerController);
        this.#serverController = serverController;
        // maybe slightly switch commands to have two fields, 
        // one for the string needing to be entered
        // and one for the 'kind' of command it is?
        this.#commandList = Object.values(Commands);

    }

    /**
     * handles a command, where context is the room or lecture in which it was send 
     * and socket the socket from which it was send
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     * @param {String} username 
     */
    handleCommand(socket, context, commandArgs, username) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);
        TypeChecker.isString(username);

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
     * 
     * @param {?SocketIO} socket 
     * @param {?CommandContext} context 
     * @param {String} commandArgs 
     * @param {String} username 
     */
    globalMsg(socket, context, commandArgs, username) {
        // maybe make sure context is allchat?
        TypeChecker.isString(commandArgs);
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
     * 
     * @param {?SocketIO} socket 
     * @param {?CommandContext} context 
     * @param {String} commandArgs 
     */
    globalNote(socket, context, commandArgs) {
        TypeChecker.isString(commandArgs);

        var arg = Number.parseInt(commandArgs[0], 10);
        this.#serverController.sendGlobalAnnouncement("VIMSU", Messages.TESTMESSAGES.body[arg]);
    };

    /**
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {?String} commandArgs 
     */
    printHelp(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);

        this.#serverController.sendNotification(socket.id, context.getHelpMessage());
    };

    /**
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {?String} commandArgs 
     */
    logMessages(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);

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
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     * @param {?String} username 
     */
    removeUser(socket, context, commandArgs, username) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

        commandArgs.forEach((username) => {
            context.removeUser(username);
        });
    };

    // this may not work this way
    /**
     * 
     * @param {?SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     */
    removeMessage(socket, context, commandArgs) {
        // refactor?
        // can we do something here that we can remove messages both by id and by sender?

        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

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
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     */
    removeAllBy(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

        commandArgs.splice(0, 0, Commands.REMOVEMESSAGESBYPLAYER.string);
        this.removeMessage(socket, context, commandArgs);
    };

    /**
     * 
     * @param {SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     */
    showAllBy(socket, context, commandArgs) {
        // refactor?
        TypeChecker.isInstanceOf(socket, SocketIO);
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

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
     * 
     * @param {?SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     */
    muteUser(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

        commandArgs.forEach((username) => {
            context.muteUser(username);
        });
    };

    /**
     * 
     * @param {?SocketIO} socket 
     * @param {CommandContext} context 
     * @param {String} commandArgs 
     */
    unmuteUser(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isString(commandArgs);

        commandArgs.forEach((username) => {
            context.unmuteUser(username);
        });
    };

    /**
     * 
     * @param {?SocketIO} socket 
     * @param {CommandContext} context 
     * @param {?String} commandArgs 
     */
    close(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        context.close();
    };

    /**
     * 
     * @param {SocketIO} socket 
     */
    unknownCommand(socket) {
        TypeChecker.isInstanceOf(socket, SocketIO);
        this.#serverController.sendNotification(socket.id, Messages.UNKNOWNCOMMAND);
    }

    /**
     * 
     * @param {Commands} commandType 
     */
    #knowsCommand = function (commandType) {
        TypeChecker.isEnumOf(commandType, Commands);

        for (var i = 0; i < this.#commandList.length; i++) {
            if (commandType === this.#commandList[i].string) {
                return true;
            }
        }
        return false
    }

    /**
     * 
     * @param {Commands} commandType 
     */
    #getMethodString = function (commandType) {
        TypeChecker.isEnumOf(commandType, Commands);
        
        for (var i = 0; i < this.#commandList.length; i++) {
            if (commandType === this.#commandList[i].string) {
                return this.#commandList[i].method;
            }
        }
    }


}
