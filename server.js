const feathers = require('@feathersjs/feathers');
const express = require('express');
const socketio = require('socket.io');

const port = process.env.PORT || 5000;
const app = express(feathers());


//Lädt alle statischen Dateien aus dem "website" Ordner
app.use(express.static(__dirname + '/website'));

//Temporärer "asset Service" der es erlaubt alle statischen
//assets zu hosten. Clienten können auf die assets zugreifen.
app.use(express.static(__dirname + '/game'));

//Parse JSON
app.use(express.json());

//Enable REST services
//TODO

//Init Services
//TODO

//Starts listening on the used port to all sockets.
const server = app.listen(port).on('listening', () => console.log(`Vimsu server is running on port ${port}`));

const io = socketio(server);


io.sockets.on('connection', socketio => {

        console.log(`New connection: ` + socketio.id);
    
        socketio.on('mouse', data => socketio.broadcast.emit('mouse', data));
        }
);
