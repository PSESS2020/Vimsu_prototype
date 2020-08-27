/**
 * The Notification Bar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NotificationBar extends Views {
    
    #eventManager;
    
    /**
     * @constructor Creates an instance of NotificationBar
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!NotificationBar.instance) {
            return NotificationBar.instance;
        }

        NotificationBar.instance = this;

        this.#eventManager = eventManager;
    }

    /**
     * Draws new message notification
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
    drawNewMessage(senderUsername, chatId) {
        if ($('#notifMessageDiv' + senderUsername + chatId).length) {
            $('#notifMessageDiv' + senderUsername + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifMessageDiv" + senderUsername + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifMessage" + senderUsername + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifMessage" + senderUsername + chatId}" role="button" data-toggle="modal" href="">
                        <div class="notifBarDiv">
                            <small>New message from ${senderUsername}.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifMessage' + senderUsername + chatId).on('click', (e) => {
            $('#notifMessageDiv' + senderUsername + chatId).hide();
        })

        $('#notifMessage' + senderUsername + chatId).on('click', (e) => {
            $('#notifMessageDiv' + senderUsername + chatId).hide();
            return this.#eventManager.handleChatThreadClicked(chatId);
        })
    }

    /**
     * Draws new chat notification
     * 
     * @param {String} senderUsername chat requester username
     * @param {String} chatId chat ID
     */
    drawNewChat(senderUsername, chatId) {
        if ($('#notifChatDiv' + chatId).length) {
            $('#notifChatDiv' + chatId).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifChatDiv" + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifChat" + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifChat" + chatId}" role="button" data-toggle="modal" href="">
                        <div class="notifBarDiv">
                            <small>${senderUsername} init chat with you.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifChat' + chatId).on('click', (e) => {
            $('#notifChatDiv' + chatId).hide();
        })

        $('#notifChat' + chatId).on('click', (e) => {
            $('#notifChatDiv' + chatId).hide();
            return this.#eventManager.handleChatThreadClicked(chatId);
        })
    }

    /**
     * Draws new group chat notification
     * 
     * @param {String} groupName chat group name
     * @param {String} creatorUsername inviter username
     * @param {String} chatId chat ID
     */
    drawNewGroupChat(groupName, creatorUsername, chatId) {
        if ($('#notifGroupChatDiv' + chatId).length) {
            $('#notifGroupChatDiv' + chatId).show()
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifGroupChatDiv" + chatId}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifGroupChat" + chatId}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifGroupChat" + chatId}" role="button" data-toggle="modal" href="">
                        <div class="notifBarDiv">
                            <small>${creatorUsername} invited you to the group chat '${groupName}'.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifGroupChat' + chatId).on('click', (e) => {
            $('#notifGroupChatDiv' + chatId).hide();
        })

        $('#notifGroupChat' + chatId).on('click', (e) => {
            $('#notifGroupChatDiv' + chatId).hide();
            return this.#eventManager.handleChatThreadClicked(chatId);
        })
    }

    /**
     * Draws new friend request notification
     * 
     * @param {String} senderUsername requester username
     */
    drawNewFriendRequest(senderUsername) {
        if ($('#notifFriendRequestDiv' + senderUsername).length) {
            $('#notifFriendRequestDiv' + senderUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendRequestDiv" + senderUsername}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriendRequest" + senderUsername}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifFriendRequest" + senderUsername}" role="button" data-toggle="modal" href="">
                        <div class="notifBarDiv">
                            <small>New friend request from ${senderUsername}.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);
        $('#closeNotifFriendRequest' + senderUsername).on('click', (e) => {
            $('#notifFriendRequestDiv' + senderUsername).hide();
        })

        $('#notifFriendRequest' + senderUsername).on('click', (e) => {
            $('#notifFriendRequestDiv' + senderUsername).hide();
            return this.#eventManager.handleFriendRequestListClicked();
        })
    }

    /**
     * Draws new friend notification
     * 
     * @param {String} friendUsername friend username
     */
    drawNewFriend(friendUsername) {
        if ($('#notifFriendDiv' + friendUsername).length) {
            $('#notifFriendDiv' + friendUsername).show();
        } else {
            $('#notifBar').prepend(`
                <div id="${"notifFriendDiv" + friendUsername}" style="display:flex">
                    <button class="self-align-end closeBtn" id="${"closeNotifFriend" + friendUsername}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${"notifFriend" + friendUsername}" role="button" data-toggle="modal" href="">
                        <div class="notifBarDiv">
                            <small>${friendUsername} accepted your friend request.</small>
                        </div>
                    </a>
                </div>
            `)
        }
        $('#notifBar').scrollTop(0);

        $('#closeNotifFriend' + friendUsername).on('click', (e) => {
            $('#notifFriendDiv' + friendUsername).hide();
        })
        $('#notifFriend' + friendUsername).on('click', (e) => {
            $('#notifFriendDiv' + friendUsername).hide();
            return this.#eventManager.handleFriendListClicked();
        })
    }
}