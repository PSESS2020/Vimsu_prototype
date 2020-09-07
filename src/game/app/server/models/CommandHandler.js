const Commands = require('../utils/Commands.js');
const Messages = require('../utils/Messages.js');
const TypeChecker = require('../../client/shared/TypeChecker.js');
const CommandContext = require('./CommandContext');

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
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {String} username participant username
     */
    handleCommand(socket, context, commandArgs, username) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

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
     * 
     * @param {?SocketIO} socket socket instance
     * @param {?CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {String} username participant username
     */
    globalMsg(socket, context, commandArgs, username) {
        // maybe make sure context is allchat?
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });
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
     * 
     * @param {?SocketIO} socket socket instance
     * @param {?CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    globalNote(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

        var arg = Number.parseInt(commandArgs[0], 10);
        this.#serverController.sendGlobalAnnouncement("VIMSU", Messages.TESTMESSAGES.body[arg]);
    };

    /**
     * Prints help message to the user
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    printHelp(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });
        TypeChecker.isInstanceOf(context, CommandContext);

        this.#serverController.sendNotification(socket.id, context.getHelpMessage());
    };

    /**
     * Prints list of log messages to the user
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    logMessages(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

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
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     * @param {?String} username participant username
     */
    removeUser(socket, context, commandArgs, username) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

        commandArgs.forEach((username) => {
            context.removeUser(username);
        });
    };

    /**
     * Removes message from the context
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    removeMessage(socket, context, commandArgs) {
        // refactor?
        // can we do something here that we can remove messages both by id and by sender?

        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

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
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    removeAllBy(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

        commandArgs.splice(0, 0, Commands.REMOVEMESSAGESBYPLAYER.string);
        this.removeMessage(socket, context, commandArgs);
    };

    /**
     * Show all messages of a participant
     * 
     * @param {SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    showAllBy(socket, context, commandArgs) {
        // refactor?
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

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
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    muteUser(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

        commandArgs.forEach((username) => {
            context.muteUser(username);
        });
    };

    /**
     * Unmutes participant from this context
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    unmuteUser(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });

        commandArgs.forEach((username) => {
            context.unmuteUser(username);
        });
    };

    /**
     * Closes context
     * 
     * @param {?SocketIO} socket socket instance
     * @param {CommandContext} context context instance
     * @param {String[]} commandArgs command arguments
     */
    close(socket, context, commandArgs) {
        TypeChecker.isInstanceOf(context, CommandContext);
        TypeChecker.isInstanceOf(commandArgs, Array);
        commandArgs.forEach(arg => {
            TypeChecker.isString(arg);
        });
        context.close();
    };

    /**
     * Sends notification on unknown command
     * 
     * @param {SocketIO} socket socket instance
     */
    unknownCommand(socket) {
        this.#serverController.sendNotification(socket.id, Messages.UNKNOWNCOMMAND);
    }

    /**
     * Checks if command is known
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
     * Gets method name based on command type
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
