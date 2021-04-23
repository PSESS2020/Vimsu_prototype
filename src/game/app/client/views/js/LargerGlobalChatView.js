/**
 * The Larger Global Chat Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LargerGlobalChatView extends WindowView {

    /**
     * Creates an instance of a LargerGlobalChatView
     */
    constructor() {
        super();

        if (!!LargerGlobalChatView.instance) {
            return LargerGlobalChatView.instance;
        }

        LargerGlobalChatView.instance = this;

        $('#closeLargerGlobalChatButton').off();
        $('#closeLargerGlobalChatButton').on('click', (event) => {
            $('#largerGlobalChat').hide();
        })

        $(document).on('mouseup', (e) => {
            const globalChat = $('#globalChat');
            const largerGlobalChat = $('#largerGlobalChat');
            const inputField = $('#allchatMessageInput')

            // if the target of the click isn't the container nor a descendant of the container
            if (!largerGlobalChat.is(e.target) && largerGlobalChat.has(e.target).length === 0 && !inputField.is(e.target) && inputField.has(e.target).length === 0 && !globalChat.is(e.target) && globalChat.has(e.target).length === 0) {
                largerGlobalChat.hide();
            }
        });
    }

    /**
     * Draws larger global chat window
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
    draw(messageHeader, messageText) {
        $('#largerGlobalChatWindowHeaderText').empty();
        $('#largerGlobalChatMessage').empty();
        $('#largerGlobalChatWindowHeaderText').text(messageHeader);
        if (messageText instanceof Array) {
            for (var i = 0; i < messageText.length; i++) {
                this.addMessage(messageText[i]);
            }
        } else {
            this.addMessage(messageText);
        }

        $('#largerGlobalChat').show();
    };

    /**
     * add message text to the global chat window
     * 
     * @param {String} text message text
     */
    addMessage = function (text) {
        var $newMessageBody = $("<div style='font-size: medium; overflow-wrap: break-word;'></div><br>");
        $newMessageBody.text(text);
        $('#largerGlobalChatMessage').append($newMessageBody);
    };
}