/**
 * The Notification Bar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NotificationBar extends ViewWithLanguageData {

    eventManager;

    /**
     * Creates an instance of NotificationBar
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for NotificationBar
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!NotificationBar.instance) {
            return NotificationBar.instance;
        }

        NotificationBar.instance = this;

        this.eventManager = eventManager;

        $('#unreadNotif').text($("#notifBar > div").length);

        $('#showNotifBar').hide();

        const notifBar = document.getElementById("notifBar");

        $('#showNotifBar').on('click', (event) => {
            event.preventDefault();

            $("#notifBar").animate({ "right": "0.9375rem" }, Settings.TOGGLE_SPEED);
            notifBar.style.display = "block";
            notifBar.style.zIndex = "5";

            $('#showNotifBar').hide();
            $('#hideNotifBar').show();
        });
        $('#hideNotifBar').on('click', (event) => {
            event.preventDefault();
            $("#notifBar").animate({ "right": "-15.625rem" }, Settings.TOGGLE_SPEED);

            setTimeout(() => {
                notifBar.style.display = "none";
                notifBar.style.zIndex = "0";
            }, Settings.TOGGLE_SPEED);

            $('#hideNotifBar').hide();
            $('#showNotifBar').show();
        });
    }

    /**
     * Gets new message notif id
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     * @returns new message notif id
     */
    getNewMessageId(senderUsername, chatId) {
        return 'notifMessage' + senderUsername + chatId;
    }

    /**
     * Draws new message notification
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
    drawNewMessage(senderUsername, chatId) {
        const id = this.getNewMessageId(senderUsername, chatId);
        this.addNewNotificationDiv(id, `${this.languageData.newMessage.replace('usernamePlaceholder', senderUsername)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            return this.eventManager.handleChatThreadClicked(chatId);
        });
    }

    /**
     * Gets new chat notif id
     * 
     * @param {String} chatId chat ID
     * @returns new chat notif id
     */
    getNewChatId(chatId) {
        return 'notifChat' + chatId;
    }

    /**
     * Draws new chat notification
     * 
     * @param {String} senderUsername chat requester username
     * @param {String} chatId chat ID
     */
    drawNewChat(senderUsername, chatId) {
        const id = this.getNewChatId(chatId);
        this.addNewNotificationDiv(id, `${this.languageData.newChat.replace('usernamePlaceholder', senderUsername)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            return this.eventManager.handleChatThreadClicked(chatId);
        });
    }

    /**
     * Gets new group chat notif id
     * 
     * @param {String} chatId chat ID
     * @returns new group chat notif id
     */
    getNewGroupChatId(chatId) {
        return 'notifGroupChat' + chatId;
    }

    /**
     * Draws new group chat notification
     * 
     * @param {String} groupName chat group name
     * @param {String} creatorUsername inviter username
     * @param {String} chatId chat ID
     */
    drawNewGroupChat(groupName, creatorUsername, chatId) {
        const id = this.getNewGroupChatId(chatId);
        this.addNewNotificationDiv(id,  `${this.languageData.newGroupChat.replace('usernamePlaceholder', creatorUsername).replace('groupNamePlaceholder', groupName)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            return this.eventManager.handleChatThreadClicked(chatId);
        });
    }

    /**
     * Gets new meeting notif id
     * 
     * @param {String} meetingID meeting ID
     * @returns new meeting notif id
     */
    getNewMeetingId(meetingID) {
        return 'notifMeeting' + meetingID;
    }

    /**
     * Draws new meeting notification
     * 
     * @param {String} meetingName meeting name
     * @param {String} meetingID meeting ID
     */
    drawNewMeeting(meetingName, meetingID) {
        const id = this.getNewMeetingId(meetingID);
        this.addNewNotificationDiv(id, `${this.languageData.newMeeting.replace('meetingNamePlaceholder', meetingName)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            $('#meetingListModal').modal('show');
            return this.eventManager.handleMeetingListClicked();
        });
    }

    /**
     * Gets new friend request notif id
     * 
     * @param {String} senderUsername requester username
     * @returns new friend request notif id
     */
    getNewFriendRequestId(senderUsername) {
        return 'notifFriendRequest' + senderUsername;
    }

    /**
     * Draws new friend request notification
     * 
     * @param {String} senderUsername requester username
     */
    drawNewFriendRequest(senderUsername) {
        const id = this.getNewFriendRequestId(senderUsername);
        this.addNewNotificationDiv(id, `${this.languageData.newFriendRequest.replace('usernamePlaceholder', senderUsername)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            $('#nofriendrequest').empty();
            $('#friendRequestListModal .modal-body .list-group').empty();
            $('#friendRequestListModal').modal('show');
            $('#friendRequestListWait').show();
            return this.eventManager.handleFriendRequestListClicked();
        });
    }

    /**
     * Gets new friend notif id
     * 
     * @param {String} friendUsername friend username
     * @returns new friend notif id
     */
    getNewFriendId(friendUsername) {
        return 'notifFriend' + friendUsername;
    }

    /**
     * Draws new friend notification
     * 
     * @param {String} friendUsername friend username
     */
    drawNewFriend(friendUsername) {
        const id = this.getNewFriendId(friendUsername);
        this.addNewNotificationDiv(id, `${this.languageData.requestAccepted.replace('usernamePlaceholder', friendUsername)}`, true);

        $('#' + id).on('click', (e) => {
            this.removeNotifDiv(id);
            $('#friendListModal').modal('show');
            return this.eventManager.handleFriendListClicked();
        });
    }

    /**
     * Adds new notification div to the notif bar
     * 
     * @param {String} id notification id
     * @param {String} text notification text
     * @param {Boolean} closeable true if the notification can be closed
     */
    addNewNotificationDiv(id, text, closeable) {
        if ($('#' + id + 'Div').length > 0) return;
        
        $('#notifBar').prepend(`
                <div id="${id + 'Div'}" class="d-flex list-group-item notifBarDiv justify-content-between">
                    <button class="self-align-end closeBtn" id="${"close" + id}" type="button"><i class="fa fa-close"></i></button>
                    <a id="${id}" role="button" data-toggle="modal" href="">
                        <div class="notifBarText wrapword self-align-end">
                            <small>${text}</small>
                        </div>
                    </a>
                </div>
            `);

        $('#unreadNotif').text($("#notifBar > div").length);

        if (closeable) {
            $('#close' + id).on('click', (e) => {
                this.removeNotifDiv(id);
            });
        } else {
            document.getElementById(`close${id}`).disabled = true;
        }

        $('#notifBar').scrollTop(0);
    }

    removeNotifDiv(id) {
        if ($('#' + id + 'Div').length) {
            $('#' + id + 'Div').remove();
            $('#unreadNotif').text($("#notifBar > div").length);
        }
    }
}