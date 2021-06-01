const MessageBodyParts = require('./MessageBodyParts.js');

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
    CLOSEDDOOR(doorID, unknownUsernames) {
        return {
            header: "Successfully closed door",
            body: "You successfully closed the door with the ID " + doorID + " for all passed users." + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
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
    CLOSEDALLDOORS(unknownUsernames) {
        return {
            header: "Successfully closed all doors",
            body: "You successfully closed all doors for all passed users." + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
        }
    },
    OPENEDALLDOORS(unknownUsernames) {
        return {
            header: "Successfully opened all doors",
            body: "You successfully opened all doors for all passed users."  + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
        }
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
        body: "Entered color does not exist. Currently available colors are blue, red, green, yellow, tosca, purple, orange, pink, and white."
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
        return {
            header: "Group successfully created",
            body: "Successfully created group " + groupName + "." + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
        }
    },
    DELETEDGROUP(groupName) {
        return {
            header: "Group successfully deleted",
            body: "Successfully deleted group " + groupName + "."
        }
    },
    ADDEDUSERSTOGROUP(groupName, unknownUsernames) {
        return {
            header: "Added users to group",
            body: "Successfully added users to group " + groupName + "." + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
        }
    },
    RMUSERSFROMGROUP(groupName, unknownUsernames) {
        return {
            header: "Removed users from group",
            body: "Successfully removed users from group " + groupName + "." + MessageBodyParts.unknownUsernamesMessage(unknownUsernames)
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
        let msgBody = [];
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