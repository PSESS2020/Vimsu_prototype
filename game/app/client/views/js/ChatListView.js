/* Used to display the list of all chats the user is currently in */

class ChatListView extends WindowView {

    #chats;

    constructor() {
        super()
    }
    
    draw(chats) {
        /* Clear view to make sure we don't draw anything twice */
        $('#chatListModal .modal-body .list-group').empty()
        
        
        
    }
    
    deleteChat(chat) {
        
    };
    
    addNewChat(chat) {
        this.#chats.push(chat);
        this.draw(this.#chats);
    };

    onclick() {
        return new EventManager().handleChatListClicked();
    }
}
