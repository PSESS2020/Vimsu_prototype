/* Used to display a chat the user is a member of */

// Needs a button to return to chat overview
// Needs a button to send friend request
// Needs to know the id of the other participant for reusing the friend request method
// Also the friendRequest-button should only be drawn if the members aren't already friends

class ChatThreadView extends WindowView {
    
    #chat
    #messages

    constructor() {
        super();

        $('#chatMessageButton').on('click', (event) => {
            event.preventDefault();
            this.sendMessage();
        });

        $('#chatMessageInput').on('keydown', (event) => {
            if (event.keyCode === 13) {
                this.sendMessage();
            }
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
        /* Get all the messages and draw them */
        this.#chat = chat;
        this.#messages = chat.messages;
        $('#chatThreadModalTitle').empty();
        $('#chatThreadModalTitle').text(chat.title);

        $('#chatThreadModal .modal-body .list-group').empty()
        
        this.#messages.forEach((message) => {
            this.#appendMessage(message);
        })
    };
    
    addNewMessage(chatId, message) {
        if(this.#chat.chatId != chatId) {
            return;
        }
        this.#messages.push(message);
        this.#appendMessage(message);
    };
    
    #appendMessage = (message) => {
        var messageDiv = `
        <div>
            <small><b>${message.username} (${message.timestamp.toString()})</b>:</small>
            <small>${message.text}</small>
        </div>
        `;
        
        $('#chatThreadModal .modal-body .list-group').append(messageDiv);
    }
    
}
