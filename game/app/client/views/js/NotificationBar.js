if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views')
}

class NotificationBar extends Views {
    constructor() {
        super();
    }

    drawNewMessage(senderUsername, chatId) {
        var parsedSenderUsername = new StringParser(senderUsername).replaceSpaceWithUnderscore();

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
        if ($('#notifChatDiv' + chatId).length) {
            $('#notifChatDiv' + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifChatDiv" + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifChat" + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifChat" + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        <div class="notifBarDiv">
                            <small>${senderUsername} init chat with you.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifChat' + chatId).on('click', function (event) {
            $('#notifChatDiv' + chatId).hide();
        })

        $('#notifChat' + chatId).on('click', function (event) {
            $('#notifChatDiv' + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewGroupChat(groupName, creatorUsername, chatId) {
        if ($('#notifGroupChatDiv' + chatId).length) {
            $('#notifGroupChatDiv' + chatId).show()
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifGroupChatDiv" + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifGroupChat" + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifGroupChat" + chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        <div class="notifBarDiv">
                            <small>${creatorUsername} invited you to the group chat '${groupName}'.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifGroupChat' + chatId).on('click', function (event) {
            $('#notifGroupChatDiv' + chatId).hide();
        })

        $('#notifGroupChat' + chatId).on('click', function (event) {
            $('#notifGroupChatDiv' + chatId).hide();
            return new EventManager().handleChatThreadClicked(chatId);
        })
    }

    drawNewFriendRequest(senderUsername) {
        var parsedSenderUsername = new StringParser(senderUsername).replaceSpaceWithUnderscore();

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
        var parsedFriendUsername = new StringParser(friendUsername).replaceSpaceWithUnderscore();

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
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = NotificationBar;
}