class GlobalChatView extends WindowView{
    
    constructor() {
        super();
    }
    
    draw(messageHeader, messageText) {
        $('#globalChatWindowHeaderText').empty();
        $('#globalChatMessage').empty();
        //$newMessageHeader.text(messageHeader);
        $('#globalChatWindowHeaderText').text(messageHeader);
        console.log("test start");
        if (messageText instanceof Array) {
            for(var i = 0; i < messageText.length; i++) {
                this.addMessage(messageText[i]);
            }
        } else {
            this.addMessage(messageText);
        }
       
        $('#globalChat').show();
    };
    
    addMessage(text) {
        var $newMessageBody = $( "<div style='font-size: medium; overflow-wrap: break-word;'></div>" );
        $newMessageBody.text(text);
        $('#globalChatMessage').append($newMessageBody);
    };
    
    /*
    onclick() {
        return new EventManager.handleGlobalChatClicked();
    };
    */
    
}
