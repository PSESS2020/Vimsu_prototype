/* Used to display a chat the user is a member of */

// Needs a button to return to chat overview
// Needs a button to send friend request
// Needs an input field
// We can probably make this look like the lecture chat

class ChatThreadView extends WindowView {
    
    #chat
    #messages

    constructor() {
        super();

        $('#chatMessageButton').off();
        $('#chatMessageButton').on('click', (event) => {
            event.preventDefault();
            this.sendMessage();
        });

        $('#chatMessageInput').off();
        $('#chatMessageInput').on('keydown', (event) => {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        });

        $('#chatLeaveButton').click((event) => {
            event.preventDefault();

            var result = confirm(`Are you sure you want to leave from the chat with ${this.#chat.title}?`)

            if (result) {
                $('#chatThreadModal').modal('hide');
                new EventManager().handleLeaveChat(this.#chat.chatId);
            }
            
            event.stopImmediatePropagation();
        });


        $('#chatFriendRequestButton').click((event) => {
            event.preventDefault();

            if (!this.#chat.partnerId) {
                return;
            }

            $('#chatFriendRequestButton').hide();
            new EventManager().handleSendFriendRequest(this.#chat.partnerId);
        });

    }

    sendMessage() {
        let messageVal = $('#chatMessageInput').val();

        if(messageVal !== '') {
            new EventManager().handleChatMessageInput(this.#chat.chatId, messageVal);
            $('#chatMessageInput').val('');
            $('#chatMessageInput').focus();
        }
    }
    
    draw(chat) { 
        //console.log(JSON.stringify(chat));
        this.#chat = chat;
        this.#messages = chat.messages;
        $('#chatThreadModalTitle').empty();
        $('#chatThreadModalTitle').text(chat.title);

        $('#chatThreadModal .modal-body .list-group').empty()

        this.#messages.forEach((message) => {
            this.#appendMessage(message);
        })

        if (!chat.areFriends) {
            $('#chatFriendRequestButton').show();
        } else {
            $('#chatFriendRequestButton').hide();
        }
    };
    
    addNewMessage(chatId, message) {
        if(this.#chat.chatId != chatId) {
            return;
        }

        this.#messages.push(message);
        this.#appendMessage(message);
    };
    
    #appendMessage = (message) => {        
        var timestamp = new DateParser(new Date(message.timestamp)).parse();

        var messageDiv = `
        <div>
            <small><b>${message.senderUsername}</b> (${timestamp}):</small>
            <small>${message.msgText}</small>
        </div>
        `;
        
        $('#chatThreadModalList').append(messageDiv);

        $('#chatThreadModalList').scrollTop($('#chatThreadModalList')[0].scrollHeight);
    }
    
}
