/* Used to display the list of all chats the user is currently in */

// TODO
// - Add a button to create a new chat

class ChatListView extends WindowView {

    #chats;

    constructor() {
        super()
    }
    
    draw(chats) {
        /* Clear view to make sure we don't draw anything twice */
        $('#chatListModal .modal-body .list-group').empty()
        
        this.#chats = chats.sort((chatA, chatB) => chatB.timestamp - chatA.timestamp);
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        this.#chats.forEach(chat => {
            if(chat.timestamp && chat.timestamp instanceof Date) {
                chat.timestamp = days[chat.timestamp.getDay()] + ", " +(chat.timestamp.getDate()<10?'0':'') + chat.timestamp.getDate() + "/" 
                                + (chat.timestamp.getMonth()<10?'0':'') + chat.timestamp.getMonth() + "/" + chat.timestamp.getFullYear() 
                                + " " + (chat.timestamp.getHours()<10?'0':'') + chat.timestamp.getHours() + 
                                ":" + (chat.timestamp.getMinutes()<10?'0':'') + chat.timestamp.getMinutes();
            } else {
                chat.timestamp = 'no messages'
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
                            <div class="col-12 col-md-9 text-center text-sm-left">
                                <label class="name lead">${chat.title}</label>
                                <br> 
                                <span >${"[" + chat.timestamp + "]" + chat.previewUsername + ": "}</span>
                                <br>
                                <span class="small">${chat.previewMessage}</span>
                            </div>  
                        </div>
                    </li>
                </ul>
            </a>
            
            

                <script> 
                    $('#chat' + '${chat.chatId}').on('click', function (event) {
                        $('#chatListModal').modal('hide');
                        new EventManager().handleChatThreadClicked("${chat.chatId}");
                    })
                </script>
            `)
        })
        
        
    }
    
    deleteChat(chat) {
        //TODO
    };
    
    addNewChat(chat) {
        this.#chats.push(chat);
        this.draw(this.#chats);
    };
    
    addNewMessage(chatID, message) {
        
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
