class AllchatView extends Views {

    constructor() {
        super();
    }

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
            $('#noAllchat').empty();

            messages.forEach((message) => {
                this.appendMessage(message)
            })
        }
    }

    appendMessage(message) {
        $('#noAllchat').empty();

        var timestamp = new DateParser(new Date(message.timestamp)).parseOnlyTime()

        var messageDiv = `
            <div>
                <small style="opacity: 0.3; float: right;">${timestamp}</small><br>
                <small><b>${message.username}</b></small>
                <small class="wrapword">${message.text}</small>
            </div>
        `;

        $('#allchatMessages').prepend(messageDiv);
        $('#allchatMessages').scrollTop(0);
    }
}