class NotificationBar extends Views {
    constructor() {
        super();
    }

    drawNewMessage(senderUsername) {
        if ($('#notifMessage' + senderUsername).length) {
            $('#notifMessage' + senderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifMessage" + senderUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifMessage" + senderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>New message from ${senderUsername}.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifMessage' + senderUsername).on('click', function (event) {
            $('#notifMessage' + senderUsername).hide();
        })
    }

    drawNewChat(senderUsername) {
        if ($('#notifChat' + senderUsername).length) {
            $('#notifChat' + senderUsername).show();
        } else {
            $('#notifBar').prepend(`
            <div id="${"notifChat" + senderUsername}" class="notifBarDiv">
                <button class="self-align-end closeBtn" id="${"closeNotifChat" + senderUsername}" type="button"><i class="fa fa-close"></i></button>
                <small>${senderUsername} init chat with you.</small>
            </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifChat' + senderUsername).on('click', function (event) {
            $('#notifChat' + senderUsername).hide();
        })
    }

    drawNewGroupChat(groupName, creatorUsername) {
        if($('#notifGroupChat' + groupName + creatorUsername).length) {
            $('#notifGroupChat' + groupName + creatorUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifGroupChat" + groupName + creatorUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifGroupChat" + groupName + creatorUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>${creatorUsername} made a group chat '${groupName}' with you.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifGroupChat' + groupName + creatorUsername).on('click', function (event) {
            $('#notifGroupChat' + groupName + creatorUsername).hide();
        })
    }

    drawNewFriendRequest(senderUsername) {
        if ($('#notifFriendRequest' + senderUsername).length) {
            $('#notifFriendRequest' + senderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendRequest" + senderUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriendRequest" + senderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>New friend request from ${senderUsername}.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifFriendRequest' + senderUsername).on('click', function (event) {
            $('#notifFriendRequest' + senderUsername).hide();
        })
    }

    drawNewFriend(friendUsername) {
        if ($('#notifFriend' + friendUsername).length) {
            $('#notifFriend' + friendUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriend" + friendUsername}" class="notifBarDiv">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriend" + friendUsername}" type="button"><i class="fa fa-close"></i></button>
                    <small>${friendUsername} accepted your friend request.</small>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);

        $('#closeNotifFriend' + friendUsername).on('click', function (event) {
            $('#notifFriend' + friendUsername).hide();
        })
    }
}