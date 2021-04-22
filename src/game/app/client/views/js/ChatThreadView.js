/**
 * The Chat Thread Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatThreadView extends WindowView {

    chat;
    messages;
    eventManager;
    ownUsername;

    /**
     * Creates an instance of ChatThreadView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!ChatThreadView.instance) {
            return ChatThreadView.instance;
        }

        ChatThreadView.instance = this;

        this.eventManager = eventManager;
    }

    /**
     * called if participant inputs a message
     */
    sendMessage = function () {
        let messageVal = $('#chatMessageInput' + this.chat.chatId).val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (messageVal !== '') {
            this.eventManager.handleChatMessageInput(this.chat.chatId, messageVal);
            $('#chatMessageInput' + this.chat.chatId).val('');
            $('#chatMessageInput' + this.chat.chatId).trigger('focus');
        }
    }

    /**
     * Draws chat thread window
     * 
     * @param {Object} chat chat
     * @param {String} ownUsername current participant's username
     */
    draw(chat, ownUsername) {
        this.chat = chat;
        this.messages = chat.messages;
        this.ownUsername = ownUsername

        this.initButtons();

        $('#chatThreadWait' + this.chat.chatId).hide();
        $("#chatThreadModalTitle" + this.chat.chatId).empty();
        $(`#chatThreadModalList${this.chat.chatId}`).empty();

        $('#chatThreadModalTitle' + this.chat.chatId).text(chat.title);

        this.eventManager.handleRemoveNewChatNotif(this.chat.chatId);

        this.eventManager.handleRemoveNewGroupChatNotif(this.chat.chatId);

        this.messages.forEach((message) => {
            this.appendMessage(message);
        })

        this.updateFriendRequestButton(this.chat.chatId, this.chat.areFriends, this.chat.friendRequestSent);

        if (chat.groupChat) {
            $('#chatParticipantListBtn' + this.chat.chatId).show();
        } else {
            $('#chatParticipantListBtn' + this.chat.chatId).hide();
        }

        if (chat.inviteButton) {
            $('#inviteFriendsBtn' + this.chat.chatId).show();
        } else {
            $('#inviteFriendsBtn' + this.chat.chatId).hide();
        }

        if (chat.leaveButton) {
            $('#chatLeaveButton' + this.chat.chatId).show();
        } else {
            $('#chatLeaveButton' + this.chat.chatId).hide();
        }

        if (chat.meetingButton) {
            $('#chatMeetingButton' + this.chat.chatId).show();
        } else {
            $('#chatMeetingButton' + this.chat.chatId).hide();
        }

        $('#chatThreadModalList' + this.chat.chatId).scrollTop($('#chatThreadModalList' + this.chat.chatId)[0].scrollHeight);
    };

    /**
     * Updates friend request button on chat thread window
     * 
     * @param {String} chatId chat ID
     * @param {boolean} areFriends true if are friends
     * @param {boolean} friendRequestSent true if friend request sent/received
     */
    updateFriendRequestButton(chatId, areFriends, friendRequestSent) {
        if (this.chat.chatId != chatId) {
            return;
        }

        if (areFriends) {
            $('#chatFriendRequestButton' + this.chat.chatId).hide();
        } else if (friendRequestSent) {
            this.disableFriendRequestBtn()
            $('#chatFriendRequestButton' + this.chat.chatId).show();
        } else {
            this.enableFriendRequestBtn()
            $('#chatFriendRequestButton' + this.chat.chatId).show();
        }
    }

    /**
     * Adds new message to chat thread window
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    addNewMessage(chatId, message) {
        if (this.chat.chatId != chatId) {
            return;
        }

        this.messages.push(message);
        this.appendMessage(message);
    };

    /**
     * Closes chat thread window with chatId if it is currently open 
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    close(chatId) {
        if (this.chat.chatId === chatId) {
            $('#chatThreadModal' + this.chat.chatId).modal('hide');
        }
    }

    /**
     * Gets current chat ID
     * 
     * @return {String} chatId
     */
    getChatId() {
        return this.chat.chatId;
    }

    /**
     * appends message to chat thread window
     * 
     * @param {Object} message message
     */
    appendMessage = (message) => {
        this.eventManager.handleRemoveNewMessageNotif(message.senderUsername, this.chat.chatId);

        var timestamp = new DateParser(new Date(message.timestamp)).parse();
        var senderUsername;
        if (message.senderUsername) {
            senderUsername = message.senderUsername + ":"
        } else {
            senderUsername = "";
        }

        let messageDiv = ``

        if (message.senderUsername === this.ownUsername) {
            messageDiv =
                `
                <div class="d-flex flex-column align-items-end mr-2">
                    <small style="opacity: 0.3; float: right; padding: 5px 0px 5px 0px">${timestamp}</small>
                    <div class="messageBubbleMyself">
                        <small class="wrapword" style="text-align: right; float: right;">${message.msgText}</small>
                    </div>
                </div>
            `
        } else {
            messageDiv =
                `
                <div class="d-flex flex-column align-items-start ml-2">
                    <small style="opacity: 0.3; padding: 5px 0px 5px 0px">${timestamp}</small>
                    <div class="messageBubbleOthers">
                        ${this.chat.groupChat && senderUsername? `<small><b>${senderUsername}</b></small><br>` : ``}
                        <small class="wrapword" style="text-align: left;">${message.msgText}</small>
                    </div>
                </div>
            `
        }

        $('#chatThreadModalList' + this.chat.chatId).append(messageDiv);
        $('#chatThreadModalList' + this.chat.chatId).scrollTop($('#chatThreadModalList' + this.chat.chatId)[0].scrollHeight);
    }

    /**
     * disables friend request button
     */
    disableFriendRequestBtn = () => {
        const chatFriendRequestButton = document.getElementById("chatFriendRequestButton" + this.chat.chatId);
        chatFriendRequestButton.disabled = true
        chatFriendRequestButton.style.opacity = "0.5"
        chatFriendRequestButton.style.cursor = "not-allowed"
        chatFriendRequestButton.title = "Friend request sent"
    }

    /**
     * enables friend request button
     */
    enableFriendRequestBtn = () => {
        const chatFriendRequestButton = document.getElementById("chatFriendRequestButton" + this.chat.chatId);
        chatFriendRequestButton.disabled = false
        chatFriendRequestButton.style.opacity = "1"
        chatFriendRequestButton.style.cursor = "pointer"
        chatFriendRequestButton.title = "Send friend request"
    }

    /**
     * Init all buttons
     */
    initButtons = () => {
        $('#chatMessageInput' + this.chat.chatId).trigger('focus');
        
        $('#chatMessageInput' + this.chat.chatId).off();
        $('#chatMessageInputGroup' + this.chat.chatId).off();

        $('#chatMessageInputGroup' + this.chat.chatId).on('keydown', (event) => {
            event.stopPropagation();

            if (event.keyCode === 13) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        $('#chatMessageInputGroup' + this.chat.chatId).on('submit', (event) => {
            event.preventDefault();
            this.sendMessage();
        });

        $('#chatMessageButton' + this.chat.chatId).off();
        $('#chatMessageButton' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();
            this.sendMessage();
        });

        $('#chatLeaveButton' + this.chat.chatId).off();
        $('#chatLeaveButton' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();

            var result = confirm(`Are you sure you want to leave from the chat with ${this.chat.title}?`)

            if (result) {
                $('#chatThreadModal' + this.chat.chatId).modal('hide');
                $('#chatThreadModal' + this.chat.chatId).remove();
                $("#chatParticipantListModal" + this.chat.chatId).remove();
                this.eventManager.handleLeaveChat(this.chat.chatId);
            }

            event.stopImmediatePropagation();
        });

        $('#chatFriendRequestButton' + this.chat.chatId).off();
        $('#chatFriendRequestButton' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();

            if (!this.chat.partnerId) {
                return;
            }

            this.updateFriendRequestButton(this.chat.chatId, false, true)

            this.eventManager.handleSendFriendRequest(this.chat.partnerId, this.chat.chatId);
        });

        $('#chatMeetingButton' + this.chat.chatId).off();
        $('#chatMeetingButton' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();

            $('#meetingWindow').show();
            $('#meetingWindowWait').show();
            this.eventManager.handleChatMeetingButtonClicked(this.chat.chatId);
        });

        $('#chatParticipantListBtn' + this.chat.chatId).off()
        $('#chatParticipantListBtn' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();

            if (this.chat.partnerId) {
                return;
            }

            if (!($('#chatParticipantListModal' + this.chat.chatId).length)) {
                this.addNewChatParticipantListWindow(this.chat.chatId)
            }

            $('#chatParticipantListModal' + this.chat.chatId).modal('show');

            this.eventManager.handleShowChatParticipantList(this.chat.chatId);
        })

        $('#inviteFriendsBtn' + this.chat.chatId).off()
        $('#inviteFriendsBtn' + this.chat.chatId).on('click', (event) => {
            event.preventDefault();

            if (this.chat.partnerId) {
                return;
            }

            $('#inviteFriendsModal .modal-body .list-group').empty();
            $('#nofriendtoinvite').empty();
            $('#noinvitedfriends').hide();
            $('#toomanyinvitedfriends').hide();
            $('#toomanyinvitedfriends').empty();
            $('#createGroupChat').hide();
            $('#inviteFriendsModal').modal('show');
            $('#inviteFriendsWait').show();

            this.eventManager.handleInviteFriendsClicked(this.chat.title, this.chat.chatId);
        });

        new EmojiPicker().draw('top-start', "chatthread-emoji-trigger", `chatMessageInput${this.chat.chatId}`)
    }

    addNewChatParticipantListWindow = () => {
        $("#chatParticipantListModalCollection").append(`
            <div class="modal" id=${"chatParticipantListModal" + this.chat.chatId} tabindex="-1" role="dialog"
                aria-labelledby=${"chatParticipantListModalTitle" + this.chat.chatId} aria-hidden="true" data-focus-on="input:first">
                <div class="modal-dialog modal-dialog-centered mw-50" role="document">
                    <div class="modal-content" style="background-color:rgba(34, 43, 46, 1) !important;">
                        <div class="modal-header">
                            <h5 class="modal-title" id=${"chatParticipantListModalTitle" + this.chat.chatId}>Chat Participant List</h5>
                            <button type="button" class="close btn" data-dismiss="modal" aria-label="Close">
                                <i class="fa fa-close"></i>
                            </button>
                        </div>
                        <div class="modal-body modal-body-large">
                            <div id=${"chatParticipantListWait" + this.chat.chatId} style="text-align: center;">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <ul class="list-group bg-transparent">

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
}