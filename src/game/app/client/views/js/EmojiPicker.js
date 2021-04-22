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
     * @param {String} position position of the window
     * @param {String} emojiTriggerButtonId id of the emoji trigger button
     * @param {String} inputId input field id
     */
    draw(position, emojiTriggerButtonId, inputId) {
        const picker = new EmojiButton({
            theme: 'dark',
            position: position,
            emojiSize: '25px',
            emojisPerRow: 8,
            rows: 4,
            showPreview: false,
            showSearch: false,
            autoHide: false
        });

        const trigger = document.querySelector('#' + emojiTriggerButtonId);

        picker.on('emoji', selectedEmoji => {
            const messageInput = document.getElementById(inputId);
            messageInput.value += selectedEmoji;
        });

        trigger.addEventListener('click', (event) => {
            event.preventDefault()
            picker.togglePicker(trigger);
            $('.wrapper')[0].style.zIndex = 1050;
        })
    }
}