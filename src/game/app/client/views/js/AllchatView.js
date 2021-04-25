/**
 * The Allchat View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AllchatView extends Views {

    lastCommands = [];

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

        $('#showRoomChatDiv').on('click', (event) => {
            event.preventDefault();
            this.showAllchatBox()
        })

        $('#allchatWindowMinimize').on('click', (event) => {
            event.preventDefault();
            this.hideAllchatBox()
        })

        let counter = -1;

        const sendMessage = (event) => {
            event.preventDefault();
            //Replace needed to replace html tags.
            const messageVal = $('#allchatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (messageVal !== '') {
                counter = -1;
                eventManager.handleAllchatMessageInput(messageVal)
                $('#allchatMessageInput').val('');
                return false;
            }
        }

        const putCommandOnInput = () => {
            var input = $('#allchatMessageInput')
            input.val(this.lastCommands[counter] ? this.lastCommands[counter] : input.val());

            var inputLength = input.val().length;
            setTimeout(() => {
                input[0].focus()
                input[0].setSelectionRange(inputLength, inputLength);
            }, 1)
        }

        new EmojiPicker().draw('allchatEmojiTrigger', 'allchatEmojiPicker', 'allchatMessageInput')

        $('#allchat').on('keydown', (event) => {
            event.stopPropagation();
            
            if (event.keyCode === 13 && !event.shiftKey) {
                sendMessage(event);
            } else if (event.keyCode === 38) {
                if (counter !== this.lastCommands.length - 1) {
                    ++counter;
                }

                putCommandOnInput();
            } else if (event.keyCode === 40) {
                if (counter !== 0) {
                    --counter;
                }

                putCommandOnInput();
            }
        });

        $('#allchat').on('submit', (event) => {
            sendMessage(event)
        });
    }

    /**
     * Adds command into last commands array
     * @param {String} command last command
     */
    saveCommand(command) {
        this.lastCommands.unshift(command);
    }

    /**
     * Draws all chat window and all chat message input
     * 
     * @param {String} roomName name of room
     * @param {Object[]} messages allchat messages
     * @param {String} ownUsername current participant's username
     */
    draw(roomName, messages, ownUsername) {
        $('#allchatMessageInput')[0].placeholder = 'Enter ' + roomName.toLowerCase() + ' chat message ...'
        $('#allchatHeaderText').text(roomName + ' Chat');

        $("#unreadAllchatMessage").text(0)

        $('#showRoomChat').empty();
        $('#showRoomChat').append(`
            <small>Show ${roomName.toLowerCase()} chat messages</small>
        `)

        $('#allchatMessages').empty();
        if (messages.length < 1) {
            $('#noAllchat').text("The " + roomName.toLowerCase() + " chat is somehow quiet. Send some love here?")
            return;
        }

        messages.forEach((message) => {
            this.appendMessage(message, ownUsername)
        })
    }

    showAllchatBox() {
        $("#allchatWindow").show()
        $('#allchatBox').scrollTop($('#allchatMessages')[0].scrollHeight);
        $("#allchatWindow").animate({ "left": "15px" }, Settings.TOGGLE_SPEED);
        $('#showRoomChatDiv').hide();
        $("#unreadAllchatMessage").text(0)
    }

    hideAllchatBox() {
        $("#allchatWindow").animate({ "left": "-250px" }, Settings.TOGGLE_SPEED);

        setTimeout(() => {
            $("#allchatWindow").hide()
        }, Settings.TOGGLE_SPEED)

        $("#unreadAllchatMessage").text(0)
        $('#showRoomChatDiv').show();
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

        let currentCounter = $("#unreadAllchatMessage").text()

        if (!isOwnParticipant) {
            $("#unreadAllchatMessage").text(++currentCounter)
        }
    }
}