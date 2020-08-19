if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views')
}

class NotificationBar extends Views {
    constructor() {
        super();
    }

    drawNewMessage(senderUsername, chatId) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifMessageDiv' + parsedSenderUsername + chatId).length) {
            $('#notifMessageDiv' + parsedSenderUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifMessageDiv" + parsedSenderUsername + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifMessage" + parsedSenderUsername + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifMessage" + parsedSenderUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        <div class="notifBarDiv">
                            <small>New message from ${senderUsername}.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifMessage' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifMessageDiv' + parsedSenderUsername + chatId).hide();
        })

        $('#notifMessage' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifMessageDiv' + parsedSenderUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewChat(senderUsername, chatId) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifChatDiv' + parsedSenderUsername + chatId).length) {
            $('#notifChatDiv' + parsedSenderUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifChatDiv" + parsedSenderUsername + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifChat" + parsedSenderUsername + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifChat" + parsedSenderUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        <div class="notifBarDiv">
                            <small>${senderUsername} init chat with you.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifChat' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifChatDiv' + parsedSenderUsername + chatId).hide();
        })

        $('#notifChat' + parsedSenderUsername + chatId).on('click', function (event) {
            $('#notifChatDiv' + parsedSenderUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewGroupChat(groupName, creatorUsername, chatId) {
        var parsedGroupName = this.#replaceSpaceWithUnderscore(groupName);
        var parsedCreatorUsername = this.#replaceSpaceWithUnderscore(creatorUsername);

        if ($('#notifGroupChatDiv' + parsedGroupName + parsedCreatorUsername + chatId).length) {
            $('#notifGroupChatDiv' + parsedGroupName + parsedCreatorUsername + chatId).show()
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifGroupChatDiv" + parsedGroupName + parsedCreatorUsername + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifGroupChat" + parsedGroupName + parsedCreatorUsername + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifGroupChat" + parsedGroupName + parsedCreatorUsername + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        <div class="notifBarDiv">
                            <small>${creatorUsername} invited you to the group chat '${groupName}'.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).on('click', function (event) {
            $('#notifGroupChatDiv' + parsedGroupName + parsedCreatorUsername + chatId).hide();
        })

        $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername + chatId).on('click', function (event) {
            $('#notifGroupChatDiv' + parsedGroupName + parsedCreatorUsername + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewFriendRequest(senderUsername) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifFriendRequestDiv' + parsedSenderUsername).length) {
            $('#notifFriendRequestDiv' + parsedSenderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendRequestDiv" + parsedSenderUsername}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriendRequest" + parsedSenderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifFriendRequest" + parsedSenderUsername}" role="button" data-toggle="modal" href="#friendRequestListModal">
                        <div class="notifBarDiv">
                            <small>New friend request from ${senderUsername}.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifFriendRequest' + parsedSenderUsername).on('click', function (event) {
            $('#notifFriendRequestDiv' + parsedSenderUsername).hide();
        })

        $('#notifFriendRequest' + parsedSenderUsername).on('click', function (event) {
            $('#notifFriendRequestDiv' + parsedSenderUsername).hide();
            return new EventManager().handleFriendRequestListClicked();
        })
    }

    drawNewFriend(friendUsername) {
        var parsedFriendUsername = this.#replaceSpaceWithUnderscore(friendUsername);

        if ($('#notifFriendDiv' + parsedFriendUsername).length) {
            $('#notifFriendDiv' + parsedFriendUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendDiv" + parsedFriendUsername}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriend" + parsedFriendUsername}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifFriend" + parsedFriendUsername}" role="button" data-toggle="modal" href="#friendListModal">
                        <div class="notifBarDiv">
                            <small>${friendUsername} accepted your friend request.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);

        $('#closeNotifFriend' + parsedFriendUsername).on('click', function (event) {
            $('#notifFriendDiv' + parsedFriendUsername).hide();
        })
        $('#notifFriend' + parsedFriendUsername).on('click', function (event) {
            $('#notifFriendDiv' + parsedFriendUsername).hide();
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