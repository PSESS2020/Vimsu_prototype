/* Used to display the list of all chats the user is currently in */

// TODO
// - Add a button to create a new chat

class ChatListView extends WindowView {

    #chats;

    constructor() {
        super()
    }
    
    draw(chats) {

        console.log("hiho " + chats.length)

        if(chats.length < 1) {
            $('#chatListModal .modal-body').text("No chats found. Let's connect with others!")
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
            var timestamp;

            console.log(chat)

            if(chat.timestamp && chat.timestamp instanceof Date) {
                timestamp = "on " + new DateParser(chat.timestamp).parse() + " " + chat.previewUsername + " wrote"
            } else {
                timestamp = 'no messages'
            }

            // Now we want to append each chat as a clickable element
            $('#chatListModal .modal-body .list-group').append(`
            
            <a class="" style="color: antiquewhite" id="${"chat" + chat.chatId}" role="button" data-toggle="modal" href="#chatThreadModal">
                <ul>
                    <li class="list-group-item bg-transparent" >
                        <div class="row w-100">
                            <div class="col-12 col-sm-2 px-0">
                                <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                            </div>
                            <div class="col-12 col-md-10 text-center text-sm-left">
                                <label class="name lead">${chat.title}</label>
                                <br>
                                <span class="small p-0" style="opacity: 0.3">${timestamp}</span>
                                <br>
                                <span class ="small p-0 wrapword" style="opacity: 0.8">${chat.previewMessage}</span>                                
                            </div>  
                        </div>
                    </li>
                </ul>
            </a>
            
            

                <script> 
                    $('#chat' + '${chat.chatId}').on('click', function (event) {
                        new EventManager().handleChatThreadClicked("${chat.chatId}");
                    })
                </script>
            `)
        })
        
        
    }
    
    deleteChat(chatId) {
        $('#chat' + chatId).empty()
    };
    
    addNewChat(chat) {
        this.#chats.push(chat);
        this.draw(this.#chats);
    };
    
    addNewMessage(chatID, message) {
        
        return; // TODO fix;
        // Check if this view is visible and either change the display of that chat
        // or add a "new message" icon
        if($('#chatListModal').hidden) /* No idea if this works */ {
            // TODO
        } else {
            var chat = this.#getChat(chatID);
            if(chat != undefined) {
                chat.timestamp = message.timestamp;
                chat.previewUsername = message.sender; // might be wrong
                chat.previewMessage = message.text; // need to be shortened
                this.draw(this.#chats);
            } else {
                /* If we don't have a chat with the passed ID, we just force an update
                 * of the chatListWindow.
                 * - (E) */
                this.onlick();
            }
        }
        
    };

    onclick() {
        return new EventManager().handleChatListClicked();
    }
    
    #getChat = function(chatID) {
        for(var i = 0; i < this.#chats.length; i++) {
            if(chats[i].chatId == chatID) {
                return chats[i];
            }
        }
    }
}
