class GlobalChatView extends WindowView {

    constructor() {
        super();

        $(document).ready(() => {
            $('#closeGlobalChatButton').off();
            $('#closeGlobalChatButton').click(() => {
                $('#globalChat').hide();
            })
        })
    }

    draw(messageHeader, messageText) {
        $('#globalChatWindowHeaderText').empty();
        $('#globalChatMessage').empty();
        //$newMessageHeader.text(messageHeader);
        $('#globalChatWindowHeaderText').text(messageHeader);
        if (messageText instanceof Array) {
            for (var i = 0; i < messageText.length; i++) {
                this.#addMessage(messageText[i]);
            }
        } else {
            this.#addMessage(messageText);
        }

        $('#globalChat').show();
    };

    #addMessage = function(text) {
        var $newMessageBody = $("<div style='font-size: medium; overflow-wrap: break-word;'></div><br>");
        $newMessageBody.text(text);
        $('#globalChatMessage').append($newMessageBody);
    };
}
