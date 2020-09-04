/**
 * The Chat List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatListView extends WindowView {

    #chats;
    #eventManager;

    /**
     * @constructor Creates an instance of ChatListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!ChatListView.instance) {
            return ChatListView.instance;
        }

        ChatListView.instance = this;

        this.#eventManager = eventManager;
    }

    /**
     * Draws chat list window
     * 
     * @param {Object[]} chats chats
     */
    draw(chats) {
        $('#chatListModal .modal-body #nochat').empty();
        $('#chatListModal .modal-body .list-group').empty();

        if (chats.length < 1) {
            $('#chatListModal .modal-body #nochat').text("No chats found. Let's connect with others!")
        }

        chats.forEach(chat => {
            if (chat.timestamp) {
                chat.timestamp = new Date(chat.timestamp);
            }
        });

        this.#chats = chats.sort((chatA, chatB) => chatB.timestamp - chatA.timestamp);

        this.#chats.forEach(chat => {
            var timestamp, previewMessage;

            if (chat.timestamp && chat.timestamp instanceof Date) {
                timestamp = new DateParser(chat.timestamp).parse();
            } else {
                timestamp = 'no messages';
            }

            if (chat.previewUsername) {
                previewMessage = chat.previewUsername + ": " + chat.previewMessage;
            } else {
                previewMessage = chat.previewMessage;
            }

            // Now we want to append each chat as a clickable element
            $('#chatListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread">
                    <a class="" style="color: antiquewhite" title="Open chat" id="${"chat" + chat.chatId}" role="button" data-toggle="modal" href="">
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
            `)

            $('#chat' + chat.chatId).off();
            $('#chat' + chat.chatId).click((event) => {
                this.#eventManager.handleChatThreadClicked(chat.chatId);
            })
        })
        $('#chatListModal').modal('show');
    }

    /**
     * Deletes chat from chat list window
     * 
     * @param {String} chatId chat ID
     */
    deleteChat(chatId) {
        this.#chats.forEach(chat => {

            if (chat.chatId === chatId) {
                let index = this.#chats.indexOf(chat);
                this.#chats.splice(index, 1);
            }
        });

        this.draw(this.#chats);
    };

    /**
     * Add chat to chat list window
     * 
     * @param {Object} chat chat
     */
    addNewChat(chat) {
        this.#chats.push(chat);
        this.draw(this.#chats);
    };

    /**
     * Add new message to chat list window
     * 
     * @param {String} chatID chat ID
     * @param {Object} message chat message
     */
    addNewMessage(chatID, message) {
        this.#chats.forEach(chat => {
            if (chat.chatId === chatID) {
                if (message.msgText.length > 35) {
                    var msgText = message.msgText.slice(0, 35) + "...";
                } else {
                    var msgText = message.msgText;
                }
                chat.timestamp = message.timestamp;
                chat.previewUsername = message.senderUsername;
                chat.previewMessage = msgText;
                this.draw(this.#chats);
            }
        })
    };
}
