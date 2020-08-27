/**
 * The Allchat View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AllchatView extends Views {

    /**
     * @constructor Creates an instance of Allchat View
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
        $('#allchatWindow')[0].style.visibility = "hidden";

        $('#showRoomChat').on('click', (event) => {
            event.preventDefault();
            $('#allchatWindow')[0].style.visibility = "visible";
            $('#showRoomChat').hide();
            $('#hideRoomChat').show();
        })
        $('#hideRoomChat').on('click', (event) => {
            event.preventDefault();
            $('#allchatWindow')[0].style.visibility = "hidden";
            $('#hideRoomChat').hide();
            $('#showRoomChat').show();
        })

        $('#allchat').on('keydown', (event) => {
            event.stopPropagation();
        });

        $('#allchat').submit(function (event) {

            event.preventDefault();
            //Replace needed to replace html tags.
            let messageVal = $('#allchatMessageInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");

            if (messageVal !== '') {
                eventManager.handleAllchatMessageInput(messageVal)
                $('#allchatMessageInput').val('');
                return false;
            }

        });
    }

    /**
     * Draws all chat window and all chat message input
     * 
     * @param {TypeOfRoom} typeOfRoom type of room
     * @param {Object[]} messages allchat messages
     */
    draw(typeOfRoom, messages) {
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
        } else {
            messages.forEach((message) => {
                this.appendMessage(message)
            })
        }
    }

    /**
     * Appends message to the allchat window
     * 
     * @param {Object} message alchat message
     */
    appendMessage(message) {
        $('#noAllchat').empty();

        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime()

        var messageDiv = `
            <div style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px">
                <small style="opacity: 0.3; float: right;">${timestamp}</small><br>
                <small><b>${message.username}</b></small>
                <small class="wrapword">${message.text}</small>
            </div>
        `;

        $('#allchatMessages').prepend(messageDiv);
        $('#allchatMessages').scrollTop(0);
    }
}