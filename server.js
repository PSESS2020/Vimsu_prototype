// TO-DO: complete re-write - (E)//
// TO-DO: fix naming - (E) //
const express = require('express');

/* This package apparently is meant to make more difficult features of the
 * protocol easier to handle - I am not sure how it would be of use here, but
 * I have included since it was included in the example I am mostly working from,
 * see also below.
 * - (E) */
const http = require('http');

/* This is a package that has a multitude of operations
 * on path-Strings implemented.
 * It is probably not necessary, but it was used in an example that I found,
 * so I am going to use it here as well (for now).
 * - (E) */
const path = require('path');
const socketio = require('socket.io');

/* We require the Position-Class here so that we can create new
 * pseudo-participants at a proper position.
 * - (E) */
const position = require ('./game/app/server/models/Position.js');

/* Set up port s.t. the app should work both on heroku
 * and on localhost. - (E) */
const PORT = process.env.PORT || 5000;

/* Setting up the server by
 *   (i) Setting up an express server
 *   (ii) Passing that as an argument to create a http-Server (for some reason)
 *   (iii) creating a socket-Server on top of that for real-time interaction
 * - (E) */
const app = express();
const server = http.Server(app);
const io = socketio(server);

/* Sets the port-Field of the express-Instance to the proper port.
 * Why?
 * Because that's how they did it in the example.
 * I might later remove this to see if it breaks stuff.
 * - (E) */
app.set('port', PORT);

/* Tbh I don't really know what this does. I copied it from the old server.js.
 * - (E) */
app.use(express.static(path.join(__dirname + '/website')));
app.use('/client', express.static(path.join(__dirname + '/game/app/client')));

/* On receiving a get-Request, the express-Server will deliver the
 * index.html file to the user.
 * I am not a hundred percent sure that this will deliver the right
 * file, but we will see.
 * Add.: It does deliver the right file. yay.
 * - (E) */
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, '/website/index.html'));
});

/* Maybe change this to server.listen() - (E) */
app.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));


/* Now, we're going to implement the socketIO-functionality that makes our server capable
 * of handling several players at once and allows them to see each other.
 * This will (for now) be handled here, until I figured out how to have it properly handled
 * by individual ParticipantController-Instances.
 * - (E) */

/* First, we create an array that holds all participants.
 * This should later be replaced with an array of
 * ParticipantControllers etc.
 * - (E) */
var participants = {};

/* This is the program logic handling new connections.
 * Part of this will later be moved into a separate class.
 * - (E) */
io.on('connection', (socket) => {

    /* When a new player connects, we create a participant instance, initialize it to
     * the right position (whatever that is) and the emit that to all the other players,
     * unless we're just doing regular game-state updates.
     * - (E) */
    socket.on('new participant', () => {
        console.log('Participant ' + socket.id ' has connected to the game . . . ');
        /* As some prerequisites of the participant-Class do not yet exist - i.e. the
         * ParticipantController-Class - we create a Pseudoparticipant instead.
         * - (E) */
	    participants[socket.id] = {
            /* The starting position is a fixed point.
             * We also want to add a name-field here later.
             * The '1' is a placeholder-RoomID.
             * - (E) */
            position: new Position(1, 200, 200);
        };
    });
    
    /* Now we handle receiving a movement-input from a participant.
     * This assumes we've been send a position as the data-part of the message.
     * This does not include error-handling yet (i.e. no proper pseudoparticipant
     * exists and so on).
     * - (E) */
    socket.on('movement', (position) => {
        // Find the proper pseudoParticipant.
        var participant = participants[socket.id];
        /* It might be sensible to take the movement itself as input
         * and to then calculate the new position on the server.
         *
         * Also, I have no idea if this even works the way it is right now.
         * Can I call the functions of the client-side version of the position-
         * class here?
         * - (E) */
        var newPos = new Position(1, position.getCordX(), position.getCordY());
        participant.position = newPos;
    });
});

/* Set to the same time-Interval as the gameplay-loop, this just sends out
 * an updated gameState every something miliseconds.
 * As the gameStates are still quite small, I reckon this should be alright
 * (for now). This will, however, later be fixed when the system is a bit
 * further down development.
 * - (E) */
setInterval( () =>
    io.sockets.emit('gameStateUpdate', participants);
}, 50);












