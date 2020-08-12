if (typeof module === 'object' && typeof exports === 'object') {
    Views = require('./Views')
}

class NotificationBar extends Views {
    constructor() {
        super();
    }

    drawNewMessage(senderUsername) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifMessage' + parsedSenderUsername).length) {
            $('#notifMessage' + parsedSenderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifMessage" + parsedSenderUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifMessage" + parsedSenderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>New message from ${senderUsername}.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifMessage' + parsedSenderUsername).on('click', function (event) {
            $('#notifMessage' + parsedSenderUsername).hide();
        })
    }

    drawNewChat(senderUsername) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifChat' + parsedSenderUsername).length) {
            $('#notifChat' + parsedSenderUsername).show();
        } else {
            $('#notifBar').prepend(`
            <div id="${"notifChat" + parsedSenderUsername}" class="notifBarDiv">
                <button class="self-align-end closeBtn" id="${"closeNotifChat" + parsedSenderUsername}" type="button"><i class="fa fa-close"></i></button>
                <small>${senderUsername} init chat with you.</small>
            </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifChat' + parsedSenderUsername).on('click', function (event) {
            $('#notifChat' + parsedSenderUsername).hide();
        })
    }

    drawNewGroupChat(groupName, creatorUsername) {
        var parsedGroupName = this.#replaceSpaceWithUnderscore(groupName);
        var parsedCreatorUsername = this.#replaceSpaceWithUnderscore(creatorUsername);

        if ($('#notifGroupChat' + parsedGroupName + parsedCreatorUsername).length) {
            $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifGroupChat" + parsedGroupName + parsedCreatorUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifGroupChat" + parsedGroupName + parsedCreatorUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>${creatorUsername} invited you to the group chat '${groupName}'.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifGroupChat' + parsedGroupName + parsedCreatorUsername).on('click', function (event) {
            $('#notifGroupChat' + parsedGroupName + parsedCreatorUsername).hide();
        })
    }

    drawNewFriendRequest(senderUsername) {
        var parsedSenderUsername = this.#replaceSpaceWithUnderscore(senderUsername);

        if ($('#notifFriendRequest' + parsedSenderUsername).length) {
            $('#notifFriendRequest' + parsedSenderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendRequest" + parsedSenderUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriendRequest" + parsedSenderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>New friend request from ${senderUsername}.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifFriendRequest' + parsedSenderUsername).on('click', function (event) {
            $('#notifFriendRequest' + parsedSenderUsername).hide();
        })
    }

    drawNewFriend(friendUsername) {
        var parsedFriendUsername = this.#replaceSpaceWithUnderscore(friendUsername);

        if ($('#notifFriend' + parsedFriendUsername).length) {
            $('#notifFriend' + parsedFriendUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriend" + parsedFriendUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriend" + parsedFriendUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>${friendUsername} accepted your friend request.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);

        $('#closeNotifFriend' + parsedFriendUsername).on('click', function (event) {
            $('#notifFriend' + parsedFriendUsername).hide();
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