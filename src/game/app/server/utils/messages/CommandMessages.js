/**
 * Messages that will be emitted from a command input by a moderator/orator
 * @module CommandMessages
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({

    /**************************************************************************/
    /************************** GENERAL MESSAGES ******************************/
    /**************************************************************************/

    WARNING: {
        header: "Warning",
        body: "One of your messages was removed by a moderator. Please follow the " +
              "general chat etiquette. Additional infractions may result in a permanent " +
              "ban."
    },
    UNKNOWNCOMMAND: {
        header: "Unrecognized command",
        body: "You entered an unrecognized command. Enter '\\help' to receive an overview of all commands and how to use them."
    },
    INVALIDPARAMETERS: {
        header: "Invalid parameters",
        body: "Invalid command parameters. Please try again and check all commands with '\\help'."
    },
    UNKNOWNUSERNAME: {
        header: "Unknown username",
        body: "Entered username does not exist or user with that username is currently not online."
    },
    NOUSERSFOUND: {
        header: "No users found",
        body: "No users were found with this search criterion. Please try again."
    }, 
    NOUSERNAME: {
        header: "No username passed",
        body: "Don't forget to pass a username!"
    },

    /**************************************************************************/
    /************************ LECTURECHAT MESSAGES ****************************/
    /**************************************************************************/

    HELPLECTURECHAT: {
        header: "List of Commands",
        body: [  "\\ban <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and removes all of them from " +
                    "the lecture. They will not be able to reenter the lecture.\nWARNING: It is " +
                    "not yet possible to revert this!",
                "\\close\nCloses the lecture and makes it inaccessible. Every current participant " +
                    "will be forcefully ejected and nobody will be able to rejoin the lecture. " +
                    "WARNING: this command can NOT be reversed.",
                "\\grant <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and grants them lecture tokens " +
                    "(if they are currently listening to the lecture and do not own one). They will " +
                    "be able to post messages into the lecture chat.",
                "\\help\nThis command. Displays a list of all commands and how to use them.",
                "\\msg log\nWill show a log of all messages send into the lecture chat" +
                    ", including the messageID and senderID of each message.",
                "\\msg rm <list of msgIDs>\nTakes a list of messageIDs, each one separated from the " +
                    "next one by a whitespace character, and removes the corresponding messages - " +
                    "if they exist - from the lecture chat. Will also send a warning to " +
                    "the senders of the messages, reminding them to follow chat etiquette.",
                "\\msg rmallby <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and removes all messages posted " +
                    "by them into the lecture chat. Will also send a warning " +
                    "to these participants, reminding them to follow chat-etiquette.",
                "\\msg showallby <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and displays all messages " +
                    "send into the chat by these users.", 
                "\\revoke <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and revokes their lecture tokens " +
                    "(if they own one). They will no longer be able to post messages into the lecture chat."]
    },
    REVOKE: {
        header: "Token revoked",
        body: "Your token has been revoked for not following chat etiquette. You will no longer " +
              "be able to post messages into the lecture chat."
    },
    GRANT: {
        header: "Token granted",
        body: "You have been granted a token. You will now be able to post messages into the lecture " +
              "chat. Please remember to follow the chat etiquette."
    },
    REMOVAL: {
        header: "Removal",
        body: "You have been removed from this lecture by a moderator. Please follow the " +
              "general chat etiquette."
    },
    CLOSED: {
        header: "Lecture closed",
        body: "The orator has closed this lecture. It is no longer accessible."
    },

    /**************************************************************************/
    /************************ ALLCHAT HELP MESSAGES ***************************/
    /**************************************************************************/

    HELPALLCHAT: {
        header: "List of Commands",
        body: [ "\\ban <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and removes all of them from " +
                    "the conference. They will not be able to reenter the conference.\nWARNING: It is " +
                    "not yet possible to unban a banned user!",
                "\\door\nDisplays a list of all door commands and how to use them.",
                "\\door <command>\nExecutes door command <command>. Available commands: " +
                    "close, closeallfor, closefor, log, open, openallfor, openfor, setcode.",
                "\\global <message>\nPost a message into the global chat. " +
                    "It will display in every participants game-view as a pop-up.",
                "\\group\nDisplays a list of all group commands and how to use them.",
                "\\group <command>\nExecutes group command <command>. Available commands: " +
                    "add, create, delete, deleteall, log, rm.",
                "\\help\nThis command. Displays a list of all commands and how to use them.",
                "\\mod <username>\nSets a normal user with <username> to a moderator.",
                "\\unmod <username>\nSets a moderator with <username> to a normal user.",
                "\\msg\nDisplays a list of all allchat message commands and how to use them.",
                "\\msg <command>\nExecutes Allchat message command <command>. Available commands: " +
                    "log, rm, rmallby, showallby.",
                "\\mute <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and mutes them, meaning they " +
                    "will no longer be able to post messages into the allchat.",
                "\\unmute <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and unmutes them, meaning they " +
                    "will be able to post messages into the allchat again if they were previously muted.",
                "\\port\nDisplays a list of all port commands and how to use them.",
                "\\port <command>\nExecutes port command <command>. Available commands: " +
                    "group, user.",
                "\\room\nDisplays a list of all room commands and how to use them.",
                "\\room <command>\nExecutes room command <command>. Available commands: " +
                    "log, userlog.",
                "\\userlog\nDisplays a list of all participants that are currently online with their username."]
    },
    DOORCOMMANDS: {
        header: "List of Door Commands",
        body: [ "\\door close <doorID>\nCloses the door with ID <doorID> for everyone.",
                "\\door closeallfor <list of usernames>\nCloses all existing doors for all passed usernames in <list of usernames>" + 
                    ", each one separated from the next one by a whitespace character.",
                "\\door closefor <doorID> <list of usernames>\nCloses the door with ID <doorID> for all passed usernames in <list of usernames>" + 
                    ", each one separated from the next one by a whitespace character.",
                "\\door log\nWill show a log of all available doors with ID and status information.", 
                "\\door log <list of roomIDs>\nWill show a log of all available doors with ID and status information in rooms whose ID is in <list of roomIDs>," + 
                    ' each roomID separated from the next one by a whitespace character.',
                "\\door open <doorID>\nOpens the door with ID <doorID> for everyone.", 
                "\\door openallfor <list of usernames>\nOpens all existing doors for all passed usernames in <list of usernames>" + 
                    ", each one separated from the next one by a whitespace character.",
                "\\door openfor <doorID> <list of usernames>\nOpens the door with ID <doorID> for all passed usernames in <list of usernames>" + 
                    ", each one separated from the next one by a whitespace character.",
                "\\door setcode <doorID> <doorCode>\nAdds <doorCode> to door with ID <doorID>."]
    },
    GROUPCOMMANDS: {
        header: "List of Group Commands",
        body: [ "\\group add <groupName> <list of usernames>\nAdds all users with username in <list of usernames> to group with name <groupName>" + 
                    ", each username separated from the next one by a whitespace character.",
                "\\group create <groupName> <groupColor> <list of usernames>\nCreates a group with the unique name <groupName>. All group members will wear " +
                    " a shirt with the color <groupColor>. Adds all users with username in <list of usernames> to group, each username separated from the next one by a whitespace character.",
                "\\group delete <groupName>\nDeletes group with the unique name <groupName>.",
                "\\group deleteall\nDeletes all exisiting groups.",
                "\\group log\nWill show a log of all existing groups with their group name and group color.",
                "\\group rm <groupName> <list of usernames>\nRemoves all users with username in <list of usernames> from group with name <groupName>" + 
                    ", each username separated from the next one by a whitespace character."]
    },
    MESSAGECOMMANDS: {
        header: "List of Message Commands",
        body: [ "\\msg log\nWill show a log of all messages send into the allchat of the room you're " +
                    "currently in, including the messageID and senderID of each message.",
                "\\msg rm <list of msgIDs>\nTakes a list of messageIDs, each one separated from the next " +
                    "one by a whitespace character, and removes the corresponding messages - " +
                    "if they exist - from the allchat of the room you're currently in. Will also send a warning to " +
                    "the senders of the messages, reminding them to follow chat etiquette.",
                "\\msg rmallby <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and removes all messages posted " +
                    "by them into the allchat of the room you're currently in. Will also send a warning " +
                    "to these participants, reminding them to follow chat-etiquette.",
                "\\msg showallby <list of usernames>\nTakes a list of usernames, each one " +
                    "separated from the next by a whitespace-character, and displays all messages " +
                    "send into the chat by these users."]
    },
    PORTCOMMANDS: {
        header: "List of Port Commands",
        body: [  "\\port group <groupname> topos <roomID> <cordX> <cordY>\nTeleports all group members of group with groupname <groupname> " + 
                    "to position (<cordX>, <cordY>) in room with roomID <roomID>.",
                "\\port group <groupname> touser <username>\nTeleports all group members of group with groupname <groupname> " + 
                    "to user with username <username>.",
                "\\port user <username> topos <roomID> <cordX> <cordY>\nTeleports user with username <username> to position " +
                    "(<cordX>, <cordY>) in room with roomID <roomID>.",
                "\\port user <username1> touser <username2>\nTeleports user with username <username1> to user with username <username2>."]
    },
    ROOMCOMMANDS: {
        header: "List of Room Commands",
        body: [ "\\room log\nDisplays a list of all existing rooms with their ID.",
                "\\room userlog <roomID>\nDisplays a list of all participants that are currently online and in room with ID <roomID> with their username."]
    },


    /**************************************************************************/
    /************************ GENERAL ALLCHAT MESSAGES ************************/
    /**************************************************************************/

    MUTE: {
        header: "Muted",
        body: "You have been muted for not following proper chat etiquette. You will no longer " +
              "be able to post messages into the allchat."
    },
    UNMUTE: {
        header: "Unmuted",
        body: "You are no longer muted and able to post messages into the allchat again. " +
              "Please remember to follow the chat etiquette."
    },
    UNKNOWNMSGCOMMAND: {
        header: "Unrecognized message command",
        body: "You entered an unrecognized command. Enter '\\msg' to receive an overview of all allchat message commands and how to use them."
    },
    PARTICIPANTLOG(usernames) {
        return {
            header: "List of all participants",
            body: usernames
        }
    },

    /**************************************************************************/
    /************************** MOD ALLCHAT MESSAGES **************************/
    /**************************************************************************/

    SETMOD(username) {
        return {
            header: "Mod status set successfully",
            body: username + " is now a moderator.",
        }
    },
    SETUNMOD(username) {
        return {
            header: "Mod status set successfully",
            body: username + " is no longer a moderator.",
        }
    },
    YOUARENOWMOD: {
        header: "Your mod state changed",
        body: "You are now a moderator. Type in \\help to see all commands.",
    },
    YOUARENOLONGERMOD: {
        header: "Your mod state changed",
        body: "You are no longer a moderator."  
    },

    /**************************************************************************/
    /************************* DOOR ALLCHAT MESSAGES **************************/
    /**************************************************************************/

    UNKNOWNDOORCOMMAND: {
        header: "Unrecognized door command",
        body: "You entered an unrecognized command. Enter '\\door' to receive an overview of all door commands and how to use them."
    },
    UNKNOWNDOORID: {
        header: "Unknown Door ID",
        body: "You entered a wrong DoorID. Please check it again with '\\door log'."
    },
    INVALIDDOORCODE: {
        header: "Invalid Door Code", 
        body: "Don't forget to pass a valid door code!"
    },
    OPEPNEDDOOR(doorID) {
        return {
            header: "Successfully opened door",
            body: "You successfully opened the door with the ID " + doorID + " for all passed users."
        }
    },
    CLOSEDDOOR(doorID) {
        return {
            header: "Successfully closed door",
            body: "You successfully closed the door with the ID " + doorID + " for all passed users."
        }
    },
    OPEPNEDDOORFORALL(doorID) {
        return {
            header: "Successfully opened door",
            body: "You successfully opened the door with the ID " + doorID + " for all users."
        }
    },
    CLOSEDDOORFORALL(doorID) {
        return {
            header: "Successfully closed door",
            body: "You successfully closed the door with the ID " + doorID + " for all users."
        }
    },
    CLOSEDALLDOORS: {
        header: "Successfully closed all doors",
        body: "You successfully closed all doors for all passed users."
    },
    OPENEDALLDOORS: {
        header: "Successfully opened all doors",
        body: "You successfully opened all doors for all passed users."
    },
    NODOORS: {
        header: "No doors available",
        body: "There is either no room with this ID or there are no doors."
    },
    SETCODE(doorID, code) {
        return {
            header: "Code set successfully",
            body: "You successfully set the door code of the door with the ID " + doorID + " to " + code + "."
        }
    },
    CORRECTCODE: {
        header: "Code was correct!",
        body: "The code you entered was correct! The door is now open for you."
    },
    WRONGCODE: {
        header: "Code was wrong!",
        body: "The code you entered was wrong! Try again."
    },

    /**************************************************************************/
    /************************* GROUP ALLCHAT MESSAGES *************************/
    /**************************************************************************/

    UNKNOWNGROUPCOMMAND: {
        header: "Unrecognized group command",
        body: "You entered an unrecognized command. Enter '\\group' to receive an overview of all group commands and how to use them."
    },
    UNKNOWNCOLOR: {
        header: "Unknown color",
        body: "Entered color does not exist. Currently available colors are blue, red, green, yellow and white."
    },
    INVALIDGROUPNAME: {
        header: "Invalid group name",
        body: "The entered group name is already used by another group. Please try again."
    },
    GROUPNOTEXISTS: {
        header: "Group does not exist",
        body: "A group with this name does not exist. Please try again."
    },
    DELETEDALLGROUPS: {
        header: "Successfully deleted all groups",
        body: "All exisiting groups were sucessfully deleted."
    },
    CREATEDGROUP(groupName, unknownUsernames) {
        let usersNotFoundMsg = "";
        if (unknownUsernames.length > 0) {
            usersNotFoundMsg = " Users that were not found: ";
            for (let i = 0; i < unknownUsernames.length; i++) {
                if (i === (unknownUsernames.length - 1)) {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + '.';
                } else {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + ', ';
                }
            }
        }

        return {
            header: "Group successfully created",
            body: "Successfully created group " + groupName + "." + usersNotFoundMsg
        }
    },
    DELETEDGROUP(groupName) {
        return {
            header: "Group successfully deleted",
            body: "Successfully deleted group " + groupName + "."
        }
    },
    ADDEDUSERSTOGROUP(groupName, unknownUsernames) {
        let usersNotFoundMsg = "";
        if (unknownUsernames.length > 0) {
            usersNotFoundMsg = " Users that were not found: ";
            for (let i = 0; i < unknownUsernames.length; i++) {
                if (i === (unknownUsernames.length - 1)) {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + '.';
                } else {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + ', ';
                }
            }
        }

        return {
            header: "Added users to group",
            body: "Successfully added users to group " + groupName + "." + usersNotFoundMsg
        }
    },
    RMUSERSFROMGROUP(groupName, unknownUsernames) {
        let usersNotFoundMsg = "";
        if (unknownUsernames.length > 0) {
            usersNotFoundMsg = " Users that were not found: ";
            for (let i = 0; i < unknownUsernames.length; i++) {
                if (i === (unknownUsernames.length - 1)) {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + '.';
                } else {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + ', ';
                }
            }
        }

        return {
            header: "Removed users from group",
            body: "Successfully removed users from group " + groupName + "." + usersNotFoundMsg
        }
    }, 
    YOUJOINEDGROUP(groupName) {
        return {
            header: "Group joined",
            body: "You joined group " + groupName + "."
        }
    },
    YOULEFTGROUP(groupName) {
        return {
            header: "Group left",
            body: "You left group " + groupName +  "."
        }
    },
    GROUPLOG(groupInfo) {
        msgBody = [];
        for (let i = 0; i < groupInfo.length; i++) {
            msgBody.push('Group ' + groupInfo[i].name + ' has group color ' + groupInfo[i].color.toLowerCase() + '.');
        }

        return {
            header: "List of all existing groups",
            body: msgBody
        }
    },
    NOGROUPSEXISTING: {
        header: "No groups",
        body: ["There are no existing groups at the moment.",
               "Enter '\\group' to receive an overview of all group commands and how to create them."]
    },

    /**************************************************************************/
    /************************* PORT ALLCHAT MESSAGES **************************/
    /**************************************************************************/

    UNKNOWNPORTCOMMAND: {
        header: "Unrecognized port command",
        body: "You entered an unrecognized command. Enter '\\port' to receive an overview of all port commands and how to use them."
    },
    TELEPORTSUCCESS: {
        header: "Teleport was successful",
        body: "Teleport was successful."
    },
    USERTELEPORTFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed parameters again. There could be a collision at your passed position.",
               "Enter '\\port' to receive an overview of all port commands and how to use them."]
    },
    GROUPTELEPORTFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed parameters again. There could be a collision at your passed position, " + 
                "the passed groupname could be wrong or no group members are currently online."  ,
               "Enter '\\port' to receive an overview of all port commands and how to use them."]
    },
    TELEPORTTOUSERFAIL: {
        header: "Teleport failed",
        body: ["Teleport failed. Please check the passed usernames again.",
               "Enter '\\port' to receive an overview of all port commands and how to use them."]       
    },
    INVALIDUSERPORT: {
        header: "Invalid user port command",
        body: [ "Invalid user port command. Valid commands:",
                "\\port user <username> topos <roomID> <cordX> <cordY>",
                "\\port user <username1> touser <username2>"]
    },
    INVALIDGROUPPORT: {
        header: "Invalid group port command",
        body: [ "Invalid group port command. Valid commands:",
                "\\port group <groupname> topos <roomID> <cordX> <cordY>",
                "\\port group <groupname> touser <username>",]
    },

    /**************************************************************************/
    /************************* ROOM ALLCHAT MESSAGES **************************/
    /**************************************************************************/

    UNKNOWNROOMCOMMAND: {
        header: "Unrecognized room command",
        body: "You entered an unrecognized command. Enter '\\room' to receive an overview of all room commands and how to use them."
    },
    ROOMNOTFOUND: {
        header: "Room not found",
        body: "There is no room with the passed ID. Please try again."
    },
    NOROOMIDPASSED: {
        header: "No room ID passed",
        body: "Don't forget to pass a valid room ID. See all rooms and their ID with '\\room log'."
    },
    PARTICIPANTLOGBYROOM(roomName, usernames) {
        return {
            header: "List of all participants in room " + roomName,
            body: usernames
        }
    },
});