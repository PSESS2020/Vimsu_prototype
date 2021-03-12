/**
 * The Chat Thread Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatThreadView extends WindowView {

    #chat;
    #messages;
    #eventManager;

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

        this.#eventManager = eventManager;

        $('#chatMessageInput').off();
        $('#chatMessageInputGroup').off();

        $('#chatMessageInputGroup').on('keydown', (event) => {
            event.stopPropagation();
        });

        $('#chatMessageInputGroup').on('submit', (event) => {
            event.preventDefault();
            this.#sendMessage();
        });

        $('#chatMessageButton').off();
        $('#chatMessageButton').on('click', (event) => {
            event.preventDefault();
            this.#sendMessage();
        });

        $('#chatLeaveButton').off();
        $('#chatLeaveButton').on('click', (event) => {
            event.preventDefault();

            var result = confirm(`Are you sure you want to leave from the chat with ${this.#chat.title}?`)

            if (result) {
                $('#chatThreadModal').modal('hide');
                this.#eventManager.handleLeaveChat(this.#chat.chatId);
            }

            event.stopImmediatePropagation();
        });

        $('#chatFriendRequestButton').off();
        $('#chatFriendRequestButton').on('click', (event) => {
            event.preventDefault();

            if (!this.#chat.partnerId) {
                return;
            }

            this.updateFriendRequestButton(this.#chat.chatId, false, true)

            this.#eventManager.handleSendFriendRequest(this.#chat.partnerId, this.#chat.chatId);
        });

        $('#chatParticipantListBtn').off()
        $('#chatParticipantListBtn').on('click', (event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

            $('#chatParticipantListModal .modal-body .list-group').empty()
            $('#chatParticipantListModal').modal('show');
            $('#chatParticipantListWait').show();

            this.#eventManager.handleShowChatParticipantList(this.#chat.chatId);
        })

        $('#inviteFriendsBtn').off()
        $('#inviteFriendsBtn').on('click', (event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

            $('#inviteFriendsModal .modal-body .list-group').empty();
            $('#inviteFriendsModal .modal-body #nofriendtoinvite').empty();
            $('#noinvitedfriends').hide();
            $('#toomanyinvitedfriends').hide();
            $('#toomanyinvitedfriends').empty();
            $('#createGroupChat').hide();
            $('#inviteFriendsModal').modal('show');
            $('#inviteFriendsWait').show();

            this.#eventManager.handleInviteFriendsClicked(this.#chat.title, this.#chat.chatId);
        });
    }

    /**
     * @private called if participant inputs a message
     */
    #sendMessage = function () {
        let messageVal = $('#chatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (messageVal !== '') {
            this.#eventManager.handleChatMessageInput(this.#chat.chatId, messageVal);
            $('#chatMessageInput').val('');
            $('#chatMessageInput').trigger('focus');
        }
    }

    /**
     * Draws chat thread window
     * 
     * @param {Object} chat chat
     */
    draw(chat) {
        $('#chatThreadWait').hide();

        this.#chat = chat;
        this.#messages = chat.messages;
        
        $('#chatThreadModalTitle').text(chat.title);

        if ($('#notifChatDiv' + this.#chat.chatId).length)
            $('#notifChatDiv' + this.#chat.chatId).hide();

        if ($('#notifGroupChatDiv' + this.#chat.chatId).length)
            $('#notifGroupChatDiv' + this.#chat.chatId).hide();

        this.#messages.forEach((message) => {
            this.#appendMessage(message);
        })

        this.updateFriendRequestButton(chat.chatId, chat.areFriends, chat.friendRequestSent);

        if (chat.groupChat) {
            $('#chatParticipantListBtn').show();
        } else {
            $('#chatParticipantListBtn').hide();
        }

        if (chat.inviteButton) {
            $('#inviteFriendsBtn').show();
        } else {
            $('#inviteFriendsBtn').hide();
        }

        if (chat.leaveButton) {
            $('#chatLeaveButton').show();
        } else {
            $('#chatLeaveButton').hide();
        }

        $('#chatThreadModalList').scrollTop($('#chatThreadModalList')[0].scrollHeight);
    };

    /**
     * Updates friend request button on chat thread window
     * 
     * @param {String} chatId chat ID
     * @param {boolean} areFriends true if are friends
     * @param {boolean} friendRequestSent true if friend request sent/received
     */
    updateFriendRequestButton(chatId, areFriends, friendRequestSent) {
        if (this.#chat.chatId != chatId) {
            return;
        }

        if (areFriends) {
            $('#chatFriendRequestButton').hide();
        } else if (friendRequestSent) {
            this.#disableFriendRequestBtn()
            $('#chatFriendRequestButton').show();
        } else {
            this.#enableFriendRequestBtn()
            $('#chatFriendRequestButton').show();
        }
    }

    /**
     * Adds new message to chat thread window
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    addNewMessage(chatId, message) {
        if (this.#chat.chatId != chatId) {
            return;
        }

        this.#messages.push(message);
        this.#appendMessage(message);
    };

    /**
     * Closes chat thread window with chatId if it is currently open 
     * 
     * @param {String} chatId chat ID
     * @param {Object} message chat message
     */
    close(chatId) {
        if (this.#chat.chatId === chatId) {
            $('#chatThreadModal').modal('hide');
        }
    }

    /**
     * Gets current chat ID
     * 
     * @return {String} chatId
     */
    getChatId() {
        return this.#chat.chatId;
    }

    /**
     * @private appends message to chat thread window
     * 
     * @param {Object} message message
     */
    #appendMessage = (message) => {
        if ($('#notifMessageDiv' + message.senderUsername + this.#chat.chatId).length) {
            $('#notifMessageDiv' + message.senderUsername + this.#chat.chatId).hide();
        }

        var timestamp = new DateParser(new Date(message.timestamp)).parse();
        var senderUsername;
        if (message.senderUsername) {
            senderUsername = message.senderUsername + ":"
        } else {
            senderUsername = "";
        }

        var messageDiv = `
        <div style="padding-bottom: 10px">
            <small style="opacity: 0.3; float: right;">${timestamp}</small><br>
            <small><b>${senderUsername}</b></small>
            <small class="wrapword">${message.msgText}</small>
        </div>
        `;

        $('#chatThreadModalList').append(messageDiv);
        $('#chatThreadModalList').scrollTop($('#chatThreadModalList')[0].scrollHeight);
    }

    /**
     * @private disables friend request button
     */
    #disableFriendRequestBtn = () => {
        const chatFriendRequestButton = document.getElementById("chatFriendRequestButton");
        chatFriendRequestButton.disabled = true
        chatFriendRequestButton.style.opacity = "0.5"
        chatFriendRequestButton.style.cursor = "not-allowed"
        chatFriendRequestButton.title = "Friend request sent"
    }

    /**
     * @private enables friend request button
     */
    #enableFriendRequestBtn = () => {
        const chatFriendRequestButton = document.getElementById("chatFriendRequestButton");
        chatFriendRequestButton.disabled = false
        chatFriendRequestButton.style.opacity = "1"
        chatFriendRequestButton.style.cursor = "pointer"
        chatFriendRequestButton.title = "Send friend request"
    }
}
