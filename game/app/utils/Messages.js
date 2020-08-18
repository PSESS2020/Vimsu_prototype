module.exports = Object.freeze({
    HELPLECTURECHAT: {
        header: "List of Commands.",
        body: ["\\help  --  This command. Displays a list of all commands and how to use them.",
                    "\\log --  Will show a log of all messages send into the lecture chat" +
                    ", including the messageID and senderID of each message.",
                    "\\rmuser <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and removes all of them from " +
                    "the lecture. They will not be able to reenter the lecture.\n WARNING: It is " +
                    "not yet possible to revert this!",
                    "\\rmmsg <list of msgIDs>  --  Takes a list of messageIDs, each one seperated from the " +
                    "next one by a whitespace character, and removes the corresponding messages - " +
                    "if they exist - from the lecture chat. Will also send a warning to " +
                    "the senders of the messages, reminding them to follow chat etiquette.",
                    "\\rmallby <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and removes all messages posted " +
                    "by them into the lecture chat. Will also send a warning " +
                    "to these participants, reminding them to follow chat-etiquette.",
                    "\\revoke <list of participantIDs> --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and revokes their lecture tokens " +
                    "(if they own one). They will no longer be able to post messages into the lecture chat.",
                    "\\grant <list of participantIDs> --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and grants them lecture tokens " +
                    "(if they are currently listening to the lecture and do not own one). They will " +
                    "be able to post messages into the lecture chat.",
                    "\\close -- Closes the lecture and makes it inaccessible. Every current participant " +
                    "will be forcefully ejected and nobody will be able to rejoin the lecture. " +
                    "WARNING: this command can NOT be reversed."]
    },
    HELPALLCHAT: {
        header: "List of Commands.",
        body: ["\\global <message>  --  Post a message into the global chat. " +
                    "It will display in every participants game-view as a pop-up.",
                    "\\help  --  This command. Displays a list of all commands and how to use them.",
                "\\log --  Will show a log of all messages send into the allchat of the room you're " +
                "currently in, including the messageID and senderID of each message.",
                "\\rmuser <list of participantIDs>  -- Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and removes all of them from " +
                "the conference. They will not be able to reenter the conference.\n WARNING: It is " +
                "not yet possible to unban a banned user!",
                "\\rmmsg <list of msgIDs>  -- Takes a list of messageIDs, each one separated from the next " +
                "one by a whitespace character, and removes the corresponding messages - " +
                "if they exist - from the allchat of the room you're currently in. Will also send a warning to " +
                "the senders of the messages, reminding them to follow chat etiquette.",
                "\\rmallby <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and removes all messages posted " +
                "by them into the allchat of the room you're currently in. Will also send a warning " +
                "to these participants, reminding them to follow chat-etiquette.",
                "\\mute <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and mutes them, meaning they " +
                "will no longer be able to post messages into the allchat.",
                "\\unmute <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and unmutes them, meaning they " +
                "will be able to post messages into the allchat again if they were previously muted."]
    },
    WARNING: {
        header: "Warning",
        body: "One of your messages was removed by a moderator. Please follow the " +
            "general chat etiquette. Additional infractions may result in a permanent " +
            "ban."
    },
    REMOVAL: {
        header: "Removal",
        body: "You have been removed from this lecture by a moderator. Please follow the " +
            "general chat etiquette."
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
    CLOSED: {
        header: "Lecture closed",
        body: "The orator has closed this lecture. It is no longer accessible."
    },
    UNKNOWNCOMMAND: {
        header: "Unrecognized command.",
        body: "You entered an unrecognized command. Enter '\\help' to receive an overview of all commands and how to use them."
    }

});
