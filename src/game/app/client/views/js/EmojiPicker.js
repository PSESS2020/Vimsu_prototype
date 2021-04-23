/**
 * The Emoji Picker View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class EmojiPicker extends Views {

    /**
     * Creates an instance of emoji picker
     */
    constructor() {
        super();

        if (!!EmojiPicker.instance) {
            return EmojiPicker.instance;
        }

        EmojiPicker.instance = this;
    }

    /**
     * Draws emoji picker window
     * @param {String} emojiTriggerId id of the emoji trigger button
     * @param {String} emojiPickerId id of the emoji picker button
     * @param {String} inputId input field id
     * @param {?String} chatId chat id, if not chatthread then undefined
     */
    draw(emojiTriggerId, emojiPickerId, inputId, chatId) {
        $('#' + emojiTriggerId).off()
        $('#' + emojiTriggerId).on('click', (event) => {
            event.preventDefault();
            
            if ($('#' + emojiPickerId + 'Div').css('display') !== 'none'){
                $('#' + emojiPickerId + 'Div').hide()  
            } else {                
                $('#' + emojiPickerId + 'Div').show()  

                document.getElementById(emojiPickerId).shadowRoot.querySelector('.search-row').setAttribute('style', 'display:none');
                document.getElementById(emojiPickerId).shadowRoot.querySelector('.favorites').setAttribute('style', 'display:none');
            }
        })

        if (chatId) {
            $('#chatThreadModal' + chatId).on('hide.bs.modal', function (e) {
                $('#' + emojiPickerId + 'Div').hide()  
            })
        }

        document.getElementById(emojiPickerId).addEventListener('emoji-click', event => {
            const messageInput = document.getElementById(inputId);
            messageInput.value += event.detail.unicode;
        }, false);
    }
}