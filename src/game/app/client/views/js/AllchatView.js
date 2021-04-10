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

        $("#allchatWindow").hide()

        $('#showRoomChat').on('click', (event) => {
            event.preventDefault();
            this.showAllchatBox()
        })
        
        $('#allchatWindowMinimize').on('click', (event) => {
            event.preventDefault();
            this.hideAllchatBox()
        })

        const sendMessage = (event) => {
            event.preventDefault();
            //Replace needed to replace html tags.
            let messageVal = $('#allchatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (messageVal !== '') {
                eventManager.handleAllchatMessageInput(messageVal)
                $('#allchatMessageInput').val('');
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
        $('#allchatHeaderText').text(typeOfRoom + ' Chat');

        $('#showRoomChat').empty();
        $('#showRoomChat').append(`
            <small>Show ${typeOfRoom.toLowerCase()} chat messages</small>
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

    showAllchatBox() {
        $("#allchatWindow").show()
        $("#allchatWindow").animate({"left":"15px"}, Settings.TOGGLE_SPEED);
        $('#showRoomChat').hide();
    }

    hideAllchatBox() {
        $("#allchatWindow").animate({"left":"-250px"}, Settings.TOGGLE_SPEED);
            
        setTimeout(() => {
            $("#allchatWindow").hide()
        }, Settings.TOGGLE_SPEED)
        
        $('#showRoomChat').show();
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

        this.showAllchatBox();
    }
}