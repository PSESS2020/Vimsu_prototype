/* Used to display the list of all chats the user is currently in */

// TODO
// - Add a button to create a new chat

class ChatListView extends WindowView {

    #chats;

    constructor() {
        super()
    }
    
    draw(chats) {
        $('#chatListModal .modal-body #nochat').empty();

        if(chats.length < 1) {
            $('#chatListModal .modal-body #nochat').text("No chats found. Let's connect with others!")
        }
        
        /* Clear view to make sure we don't draw anything twice */
        $('#chatListModal .modal-body .list-group').empty();

        chats.forEach(chat => {
            if(chat.timestamp) {
                chat.timestamp = new Date(chat.timestamp);
            }
        });

        this.#chats = chats.sort((chatA, chatB) => chatB.timestamp - chatA.timestamp);

        this.#chats.forEach(chat => {
            console.log("chatId client: " + chat.chatId);
            var timestamp, previewMessage;

            console.log(chat)

            if(chat.timestamp && chat.timestamp instanceof Date) {
                timestamp = new DateParser(chat.timestamp).parse();
            } else {
                timestamp = 'no messages';
            }

            if(chat.previewUsername) {
                previewMessage = chat.previewUsername + ": " + chat.previewMessage;
            } else {
                previewMessage = chat.previewMessage;
            }

            // Now we want to append each chat as a clickable element
            $('#chatListModal .modal-body .list-group').append(`
            <li class="list-group-item bg-transparent chatthread">
                <a class="" style="color: antiquewhite" id="${"chat" + chat.chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                        
                            <div class="row w-100">
                                <div class="col-12 col-sm-2 px-0">
                                    <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                                </div>
                                <div class="col-12 col-md-10 text-center text-sm-left">
                                    <label class="name lead">${chat.title}</label>
                                    <br>
                                    <span class="small p-0" style="opacity: 0.3">${timestamp}</span>
                                    <br>
                                    <span class ="small p-0 wrapword" style="opacity: 0.8">${previewMessage}</span>                                
                                </div>  
                            </div>
                        
                </a>
            </li>
            

                <script> 
                    $('#chat' + '${chat.chatId}').on('click', function (event) {
                        new EventManager().handleChatThreadClicked("${chat.chatId}");
                    })
                </script>
            `)
        })
        
        
    }
    
    deleteChat(chatId) {
        this.#chats.forEach(chat => {

            if (chat.chatId === chatId) {
                let index = this.#chats.indexOf(chat);
                this.#chats.splice(index, 1);
            }
        });

        this.draw(this.#chats);
    };
    
    addNewChat(chat) {
        this.#chats.push(chat);
        this.draw(this.#chats);
    };
    
    addNewMessage(chatID, message) {
        this.#chats.forEach(chat => {
            if(chat.chatId === chatID) {
                chat.timestamp = message.timestamp;
                chat.previewUsername = message.senderUsername;
                chat.previewMessage = message.msgText;
                this.draw(this.#chats);
            }
        })
    };

    onclick() {
        return new EventManager().handleChatListClicked();
    }
}
