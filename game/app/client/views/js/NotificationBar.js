if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views')
}

class NotificationBar extends Views {
    constructor() {
        super();
    }

    drawNewMessage(senderUsername, chatId) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifMessage' + parsedSenderUsername + chatId).length) {
            $('#notifMessage' + parsedSenderUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <a id="${"notifMessage" + parsedSenderUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                    <div class="notifBarDiv">
                        <small>New message from ${senderUsername}.</small>
                    </div>
                </a>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#notifMessage' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifMessage' + parsedSenderUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewChat(senderUsername, chatId) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifChat' + parsedSenderUsername + chatId).length) {
            $('#notifChat' + parsedSenderUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <a id="${"notifChat" + parsedSenderUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                    <div class="notifBarDiv">
                        <small>${senderUsername} init chat with you.</small>
                    </div>
                </a>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#notifChat' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifChat' + parsedSenderUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewGroupChat(groupName, creatorUsername, chatId) {
        var parsedGroupName = this.#replaceSpaceWithUnderscore(groupName);
        var parsedCreatorUsername = this.#replaceSpaceWithUnderscore(creatorUsername);

        if ($('#notifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).length) {
            $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <a id="${"notifGroupChat" + parsedGroupName + parsedCreatorUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                    <div class="notifBarDiv">
                        <small>${creatorUsername} invited you to the group chat '${groupName}'.</small>
                    </div>
                </a>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).on('click', function (event) {
            $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewFriendRequest(senderUsername) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifFriendRequest' + parsedSenderUsername).length) {
            $('#notifFriendRequest' + parsedSenderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <a id="${"notifFriendRequest" + parsedSenderUsername}" role="button" data-toggle="modal" href="#friendRequestListModal">
                    <div class="notifBarDiv">
                        <small>New friend request from ${senderUsername}.</small>
                    </div>
                </a>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#notifFriendRequest' + parsedSenderUsername).on('click', function (event) {
            $('#notifFriendRequest' + parsedSenderUsername).hide();
            return new EventManager().handleFriendRequestListClicked();
        })
    }

    drawNewFriend(friendUsername) {
        var parsedFriendUsername = this.#replaceSpaceWithUnderscore(friendUsername);

        if ($('#notifFriend' + parsedFriendUsername).length) {
            $('#notifFriend' + parsedFriendUsername).show();
        } else {
            $('#notifBar').prepend(`
                <a id="${"notifFriend" + parsedFriendUsername}" role="button" data-toggle="modal" href="#friendListModal">
                    <div class="notifBarDiv">
                        <small>${friendUsername} accepted your friend request.</small>
                    </div>
                </a>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#notifFriend' + parsedFriendUsername).on('click', function (event) {
            $('#notifFriend' + parsedFriendUsername).hide();
            return new EventManager().handleFriendListClicked();
        })
    }

    #replaceSpaceWithUnderscore = function (string) {
        string = string.replace(/ /g, "_");
        return string;
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NotificationBar;
}