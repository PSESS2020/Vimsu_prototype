/**
 * The Allchat View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AllchatView extends Views {

    /**
     * Creates an instance of Allchat View
     * 
     * @param {EventManager} eventManager event manager instance
     */
    constructor(eventManager) {
        super();

        if (!!AllchatView.instance) {
            return AllchatView.instance;
        }

        AllchatView.instance = this;

        $('#hideRoomChat').hide();

        const allchatWindow = document.getElementById("allchatWindow")
        allchatWindow.style.visibility = "hidden";

        $('#showRoomChat').on('click', (event) => {
            event.preventDefault();
            showAllchatBox()
        })
        $('#hideRoomChat').on('click', (event) => {
            event.preventDefault();
            allchatWindow.style.visibility = "hidden";
            $('#hideRoomChat').hide();
            $('#showRoomChat').show();
        })

        function showAllchatBox() {
            allchatWindow.style.visibility = "visible";
            $('#showRoomChat').hide();
            $('#hideRoomChat').show();
        }

        const sendMessage = (event) => {
            event.preventDefault();
            //Replace needed to replace html tags.
            let messageVal = $('#allchatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (messageVal !== '') {
                eventManager.handleAllchatMessageInput(messageVal)
                $('#allchatMessageInput').val('');

                if (!messageVal.startsWith("\\")) {
                    showAllchatBox();
                }
                
                return false;
            }
        }

        new EmojiPicker().draw('bottom-start', "allchat-emoji-trigger", "allchatMessageInput")

        $('#allchat').on('keydown', (event) => {
            event.stopPropagation();

            if (event.keyCode === 13) {
                sendMessage(event);
            }
        });

        $('#allchat').on('submit', (event) => {
            sendMessage(event)
        });
    }

    /**
     * Draws all chat window and all chat message input
     * 
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object[]} messages allchat messages
     * @param {String} ownUsername current participant's username
     */
    draw(typeOfRoom, messages, ownUsername) {
        $('#allchatMessageInput')[0].placeholder = 'Enter ' + typeOfRoom.toLowerCase() + ' chat message ...'
        $('#allchatHeader').text(typeOfRoom + ' Chat');

        $('#showRoomChat').empty();
        $('#showRoomChat').append(`
            <small>Show ${typeOfRoom.toLowerCase()} chat messages</small>
        `)
        $('#hideRoomChat').empty();
        $('#hideRoomChat').append(`
            <small>Hide ${typeOfRoom.toLowerCase()} chat messages</small>
        `)

        $('#allchatMessages').empty();
        if (messages.length < 1) {
            $('#noAllchat').text("The " + typeOfRoom.toLowerCase() + " chat is somehow quiet. Send some love here?")
            return;
        }

        messages.forEach((message) => {
            this.appendMessage(message, ownUsername)
        })

        setTimeout(() => {
            $('#allchatBox').scrollTop($('#allchatMessages')[0].scrollHeight);
        }, 500)
        
    }

    /**
     * Appends message to the allchat window
     * 
     * @param {Object} message alchat message
     * @param {String} ownUsername current participant's username
     */
    appendMessage(message, ownUsername) {
        $('#noAllchat').empty();

        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime()

        const isOwnParticipant = message.username === ownUsername

        const messageDiv =
            `
                <div class="d-flex flex-column ${isOwnParticipant ? "align-items-end mr-2" : "align-items-start"}">
                    <small style="opacity: 0.3; float: right; padding: 5px 0px 5px 0px">${timestamp}</small>
                    <div class="${isOwnParticipant ? "allChatMessageBubbleMyself" : "allChatMessageBubbleOthers"}">
                        ${!isOwnParticipant ? `<small><b>${message.username}</b></small><br>` : ``}
                        <small class="wrapword" style="text-align: ${isOwnParticipant ? "right" : "left"};">${message.text}</small>
                    </div>
                </div>
            `

        $('#allchatMessages').append(messageDiv);
        $('#allchatBox').scrollTop($('#allchatMessages')[0].scrollHeight);
    }
}