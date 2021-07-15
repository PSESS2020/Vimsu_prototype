/**
 * The Allchat View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AllchatView extends ViewWithLanguageData {

    lastCommands = [];

    /**
     * Creates an instance of Allchat View
     * 
     * @param {EventManager} eventManager event manager instance
     * @param {json} languageData language data for allchat view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!AllchatView.instance) {
            return AllchatView.instance;
        }

        AllchatView.instance = this;

        document.getElementById("allchatEmojiTrigger").title = this.languageData.tooltips.emojis;
        document.getElementById("allchatSendButton").title = this.languageData.tooltips.sendMessage;

        $("#allchatWindow").hide()

        $('#showRoomChatDiv').on('click', (event) => {
            event.preventDefault();
            this.showAllchatBox();
        });
        
        $('#allchatWindowMinimize').on('click', (event) => {
            event.preventDefault();
            this.hideAllchatBox();
        });

        let counter = -1;

        const sendMessage = (event) => {
            event.preventDefault();
            const input = $('#allchatMessageInput');
            //Replace needed to replace html tags.
            const messageVal = input.val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (messageVal !== '') {
                counter = -1;
                eventManager.handleAllchatMessageInput(messageVal);
                input.val('');
                return false;
            }
        }

        const putCommandOnInput = () => {
            const input = $('#allchatMessageInput');
            input.val(this.lastCommands[counter] ? this.lastCommands[counter] : input.val());

            var inputLength = input.val().length;
            setTimeout(() => {
                input[0].focus();
                input[0].setSelectionRange(inputLength, inputLength);
            }, 1);
        }

        new EmojiPicker().draw('allchatEmojiTrigger', 'allchatEmojiPicker', 'allchatMessageInput');

        $('#allchat').on('keydown', (event) => {
            event.stopPropagation();
            
            if (event.key === 'Enter' && !event.shiftKey) {
                sendMessage(event);
            } else if (event.key === 'ArrowUp') {
                if (counter !== this.lastCommands.length - 1) {
                    ++counter;
                }

                putCommandOnInput();
            } else if (event.key === 'ArrowDown') {
                if (counter !== 0) {
                    --counter;
                }

                putCommandOnInput();
            }
        });

        $('#allchat').on('submit', (event) => {
            sendMessage(event);
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
        $('#allchatMessageInput')[0].placeholder = this.languageData.enterMessage.replace('<roomName>', roomName);
        $('#allchatHeaderText').text(roomName + ' ' + this.languageData.chat);
        $("#unreadAllchatMessage").text(0);

        $('#showRoomChat').empty();
        $('#showRoomChat').append(`<small>${this.languageData.showMessages.replace('<roomName>', roomName)}</small>`);

        $('#allchatMessages').empty();
        if (messages.length < 1) {
            $('#noAllchat').text(this.languageData.quietChat.replace('<roomName>', roomName));
            return;
        }

        messages.forEach((message) => {
            this.appendMessage(message, ownUsername);
        });
    }

    showAllchatBox() {
        $("#allchatWindow").show();
        $('#allchatBox').scrollTop($('#allchatMessages')[0].scrollHeight);
        $("#allchatWindow").animate({ "left": "0.9375rem" }, Settings.TOGGLE_SPEED);
        $('#showRoomChatDiv').hide();
        $("#unreadAllchatMessage").text(0);
    }

    hideAllchatBox() {
        $("#allchatWindow").animate({ "left": "-15.625rem" }, Settings.TOGGLE_SPEED);

        setTimeout(() => {
            $("#allchatWindow").hide();
        }, Settings.TOGGLE_SPEED);

        $("#unreadAllchatMessage").text(0);
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

        var timestamp = new DateParser().parseOnlyTime(new Date(message.timestamp));

        const isOwnParticipant = message.username === ownUsername;

        const messageDiv =
            `
                <div class="d-flex flex-column ${isOwnParticipant ? "align-items-end mr-2" : "align-items-start"}">
                    <small style="opacity: 0.3; float: right; padding: 0.3125rem 0rem 0.3125rem 0rem">${timestamp}</small>
                    <div class="${isOwnParticipant ? "allChatMessageBubbleMyself" : "allChatMessageBubbleOthers"}">
                        ${!isOwnParticipant ? `<small><b>${message.username}</b></small><br>` : ``}
                        <small class="wrapword" style="text-align: ${isOwnParticipant ? "right" : "left"};">${message.text}</small>
                    </div>
                </div>
            `;

        $('#allchatMessages').append(messageDiv);
        $('#allchatBox').scrollTop($('#allchatMessages')[0].scrollHeight);

        let currentCounter = $("#unreadAllchatMessage").text();

        if (!isOwnParticipant) {
            $("#unreadAllchatMessage").text(++currentCounter);
        }
    }
}