class ChatThreadView extends WindowView {

    #chat
    #messages

    constructor() {
        super();
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
                new EventManager().handleLeaveChat(this.#chat.chatId);
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
            new EventManager().handleSendFriendRequest(this.#chat.partnerId, this.#chat.chatId);
        });

        $('#chatParticipantListBtn').off()
        $('#chatParticipantListBtn').click((event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

            new EventManager().handleShowChatParticipantList(this.#chat.chatId);
        })

        $('#inviteFriendsBtn').off()
        $('#inviteFriendsBtn').click((event) => {
            event.preventDefault();

            if (this.#chat.partnerId) {
                return;
            }

            new EventManager().handleInviteFriendsClicked(this.#chat.title, this.#chat.chatId);
        });
    }

    #sendMessage = function() {
        let messageVal = $('#chatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (messageVal !== '') {
            new EventManager().handleChatMessageInput(this.#chat.chatId, messageVal);
            $('#chatMessageInput').val('');
            $('#chatMessageInput').focus();
        }
    }

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

    addNewMessage(chatId, message) {
        if (this.#chat.chatId != chatId) {
            return;
        }

        this.#messages.push(message);
        this.#appendMessage(message);
    };

    getChatId() {
        return this.#chat.chatId;
    }

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
        <div>
            <small style="opacity: 0.3; float: right;">${timestamp}</small><br>
            <small><b>${senderUsername}</b></small>
            <small class="wrapword">${message.msgText}</small>
        </div>
        `;

        $('#chatThreadModalList').append(messageDiv);
        $('#chatThreadModalList').scrollTop($('#chatThreadModalList')[0].scrollHeight);
    }

}
