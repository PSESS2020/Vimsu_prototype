class ChatListView extends WindowView {

    #chats;

    constructor() {
        super()
    }
    
    draw() {

    }

    onclick() {
        return new EventManager().handleChatListClicked();
    }
}