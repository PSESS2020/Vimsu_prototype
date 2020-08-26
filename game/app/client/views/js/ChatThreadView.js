class ChatThreadView extends WindowView {

    #chat;
    #messages;
    #eventManager;

    /**
     * @constructor Creates an instance of ChatThreadView
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

        $('#chatMessageInputGroup').submit((event) => {
            event.preventDefault();
            this.#sendMessage();
        });

        $('#chatMessageButton').off();
        $('#chatMessageButton').click((event) => {
            event.preventDefault();
            this.#sendMessage();
        });

        $('#chatLeaveButton').off();
        $('#chatLeaveButton').click((event) => {
            event.preventDefault();

            var result = confirm(`Are you sure you want to leave from the chat with ${this.#chat.title}?`)

            if (result) {
                $('#chatThreadModal').modal('hide');
                this.#eventManager.handleLeaveChat(this.#chat.chatId);
            }

            event.stopImmediatePropagation();
        });

        $('#chatFriendRequestButton').off();
        $('#chatFriendRequestButton').click((event) => {
            event.preventDefault();

            if (!this.#chat.partnerId) {
                return;
            }

            $('#chatFriendRequestButton').hide();
            $('#friendRequestSent').show();
            this.#eventManager.handleSendFriendRequest(this.#chat.partnerId, this.#chat.chatId);
        });

        $('#chatParticipantListBtn').off()
        $('#chatParticipantListBtn').click((event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

            this.#eventManager.handleShowChatParticipantList(this.#chat.chatId);
        })

        $('#inviteFriendsBtn').off()
        $('#inviteFriendsBtn').click((event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

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
            $('#chatMessageInput').focus();
        }
    }

    /**
     * Draws chat thread window
     * 
     * @param {Object} chat chat
     */
    draw(chat) {
        this.#chat = chat;
        this.#messages = chat.messages;
        $('#chatThreadModalTitle').empty();
        $('#chatThreadModal .modal-body .list-group').empty();
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
            $('#inviteFriendsBtn').show();
        } else {
            $('#chatParticipantListBtn').hide();
            $('#inviteFriendsBtn').hide();
        }

        $('#chatThreadModal').modal('show');
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
            $('#friendRequestSent').hide();
        } else if (friendRequestSent) {
            $('#chatFriendRequestButton').hide();
            $('#friendRequestSent').show();
        } else {
            $('#friendRequestSent').hide();
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
     * Gets current chat ID
     * 
     * @return chatId
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
}
