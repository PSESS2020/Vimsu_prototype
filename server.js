// TODO: move to server controller

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/game/app/client'));

app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/game/app/client/views/canvas.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});



io.on('connection', (socket) => {

    socket.emit('connected', {})

    socket.on('handleFromViewNewMessage', ({ participantId, message}) => {
        console.log("new message");
        // TODO: process the new message
        io.emit('handleFromServerNewMessage', { name: 'Laura', message: 'test'})
    });
    // TODO: pass sockets to different controllers so they can all emit events to be received by the client controller
});



