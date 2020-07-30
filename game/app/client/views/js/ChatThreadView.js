/* Used to display a chat the user is a member of */

// Needs a button to return to chat overview
// Needs a button to send friend request
// Needs an input field
// We can probably make this look like the lecture chat

class ChatThreadView extends WindowView {
    
    #chatId
    #messages
    
    constructor() {
        super();
    }
    
    draw(chat) {
        /* Get all the messages and draw them */
        /*
        this.#chatId = chat.chatId;
        this.#messages = chat.messages;
        $('#chatThreadModalTitle').empty();
        $('#chatThreadModalTitle').text(chat.title);
        
        //draw the messages
        this.#update(this.#messages);
        
        var script = `
            <script>
                $('#chatInput').submit( function(event) {
                    event.preventDefault();
                    let messageVal = $('#chatMessageInput').val();
    
                    if(messageVal !== '') {
                        
                        new EventManager.handleChatMessageInput("${chat.chatId}", messageVal);
      
                    $('#chatMessageInput').val('');
                    return false;
                    }
                });
            </script>
        `;
        */
    };
    
    addNewMessage(chatId, message) {
        if(chatId != this.#chatId) {
            return;
        }
        this.#messages.push(message);
        this.#update(this.#messages);
    };
    
    getChatId() {
        return this.#chatId;
    }

    #update = function(messages) {
        if(messages) {
            messages.forEach( (message) => {
                /* Clear view to make sure we don't draw anything twice */
                $('#chatThreadModal .modal-body .list-group').empty()
                
                // TODO
                // Draw the message slightly different if the client did send them
                // Different color, profile picture on the right?
                
                var messageDiv = `
                <ul id="${"chat" + chat.chatId}">
                    <li class="list-group-item bg-transparent" >
                        <div class="row w-100">
                            <div class="col-12 col-sm-2 px-0">
                                <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                            </div>
                            <div class="col-12 col-md-9 text-center text-sm-left">
                                <label class="name lead">${chat.title}</label>
                                <br> 
                                <span >${"[" + message.timestamp + "]" + message.username + ": "}</span>
                                <br>
                                <span class="small">${message.text}</span>
                            </div>  
                        </div>
                    </li>
                </ul>
                `;
                
                $('#chatThreadModal .modal-body .list-group').prepend(messageDiv);
            });
        }
    }
    
}
