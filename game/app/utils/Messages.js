module.exports = Object.freeze({
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
    }
    
});
