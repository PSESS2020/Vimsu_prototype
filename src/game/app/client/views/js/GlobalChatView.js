/**
 * The Global Chat Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class GlobalChatView extends WindowView {

    /**
     * Creates an instance of GlobalChatView
     * @constructor GlobalChatView
     */
    constructor() {
        super();

        if (!!GlobalChatView.instance) {
            return GlobalChatView.instance;
        }

        GlobalChatView.instance = this;

        $(document).ready(() => {
            $('#closeGlobalChatButton').off();
            $('#closeGlobalChatButton').click(() => {
                $('#globalChat').hide();
            })
        })
    }

    /**
     * Draws global chat window
     * 
     * @param {String} messageHeader message header
     * @param {String[]} messageText message text
     */
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

    /**
     * @private add message text to the global chat window
     * 
     * @param {String} text message text
     */
    #addMessage = function (text) {
        var $newMessageBody = $("<div style='font-size: medium; overflow-wrap: break-word;'></div><br>");
        $newMessageBody.text(text);
        $('#globalChatMessage').append($newMessageBody);
    };
}
