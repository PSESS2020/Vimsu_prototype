/* ############################################################################### */
/* ####################### LOADING NON-VIMSU REQUIREMENTS ######################## */
/* ############################################################################### */

const express = require('express');

/* This package apparently is meant to make more difficult features of the
 * protocol easier to handle - I am not sure how it would be of use here, but
 * I have included since it was included in the example I am mostly working from,
 * see also below.
 * Add.: Without this, the server won't work.
 * - (E) */
const http = require('http');

/* This is a package that has a multitude of operations
 * on path-Strings implemented.
 * It is probably not necessary, but it was used in an example that I found,
 * so I am going to use it here as well (for now).
 * - (E) */
const path = require('path');
const socketio = require('socket.io');


/* ############################################################################### */
/* ######################## LOADING VIMSU REQUIREMENTS ########################### */
/* ############################################################################### */

const Position = require('./game/app/server/models/Position.js');
const Direction = require('./game/app/server/models/Direction.js');


const Participant = require('./game/app/server/models/Participant.js');
const ParticipantController = require('./game/app/server/controller/ParticipantController.js');

const Room  = require('./game/app/server/models/Room.js');
const RoomController = require('./game/app/server/controller/RoomController.js');
const TypeOfRoom = require('./game/app/server/models/TypeOfRoom.js');

const TypeChecker = require=('./game/app/client/utils/TypeChecker.js');

/* ############################################################################### */
/* ######################### SETTING UP THE SERVER ############################### */
/* ############################################################################### */

/* Set up port s.t. the app should work both on heroku
 * and on localhost. - (E) */
const PORT = process.env.PORT || 5000;

/* Setting up the server by
 *   (i) Setting up an express server
 *   (ii) Passing that as an argument to create a http-Server (for some reason)
 *   (iii) creating a socket-Server on top of that for real-time interaction
 * - (E) */
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

/* This is a placeholder to generate new ppantIDs - (E) */
var counter = 0;

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
 * - (E) */
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, '/website/index.html'));
});


/* The http-Server starts listening on the port.
 * If this does not happen (if the express-instance 'app' listen here),
 * then socket.io will not work, as the GET-request for the client-API
 * will try to fetch the data from the wrong directory, resulting in a
 * 404 NOT FOUND error.
 * I don't know why this is, but thanks StackOverflow!
 * - (E) */
httpServer.listen(PORT, () => console.log(`Vimsu-Server listening on port ${PORT} . . .`));


/* We now initlialise a simple game-state (create a basic room along with it's controller
 * and so on).
 * This is still somewhat of a placeholder handling of this, and needs to be later moved into
 * the ServerController and ConferenceController.
 * (The idea being: server.js calls ServerController to create new conference and the
 * ConferenceController creates the room plus the RoomController as part of creating itself)
 * - (E) */
/*
const gameRoomId = 1000; // placeholder ID
const gameRoom = new Room(gameRoomId, TypeOfRoom.FOYER); // Creates a foyer
const gameRoomController = new RoomController(gameRoom); // Creates a controller for that foyer
*/
// On trying out some stuff, the roomClass is broken, as the objectClass is broken.

/* ########################################################################################## */
/* ################################## REALTIME FUNCTIONALITY ################################ */
/* ########################################################################################## */

/* Now, we're going to implement the socketIO-functionality that makes our server capable
 * of handling several players at once and allows them to see each other.
 * This will (for now) be handled here, until I figured out how to have it properly handled
 * by individual ParticipantController-Instances.
 * - (E) */


/* First, we create a map that will hold all ppantControllers, indexed by their socket.ids 
 * - (E) */
const ppantControllers = new Map();
const ppants = new Map();  // Array to hold all participants

/* This is the program logic handling new connections.
 * This may late be moved into the server or conference-controller?
 * - (E) */
io.on('connection', (socket) => {
    /* When a new player connects, we create a participant instance, initialize it to
     * the right position (whatever that is) and the emit that to all the other players,
     * unless we're just doing regular game-state updates.
     * - (E) */
    socket.on('new participant', () => {
        
        /* If we already have a ppant connected on this socket, we do nothing
        /* - (E) */
        if ( ppantControllers.has(socket.id) ) {
            return;
        }

        console.log('Participant ' + socket.id + ' has conected to the game . . . ');
        
        /* What happens here:
         *    (i) We generate a new ppantID
         *   (ii) We create a new ppantCont for that ID - inside the constructor of
         *        the ppantCont, it also creates a new ppant with that id
         *        (I think this should be changed - the ppant-Constructor expects
         *         a ppantCont-Instance, but also information the ppantCont does 
         *         not know at this time. Maybe the roomController should create
         *         a new ppantCont when one is added, but that also causes difficulty
         *         with how to make sure the ppantCont knows the socket it should send
         *         on.)
         *  (iii) We add that ppantCont to the list of all ppantConts, indexed by socket
         *        (This list is a bit redundant here - as more functionality is moved into
         *        the ppantCont-Classe, it can probably be removed)
         *   (iv) We also add it to the list of ppantConts in the roomCont
         *    (v) We set up the ppant to have the right id and position and
         *        send this back to the client, so he may draw the initial gameState
         *        properly
         *   (vi) We emit the necessary information to the other clients
         * - (E) */ 

        // (i) to (iii)
        var ppantID = counter++; // let's hope I am a smart boy and this works - (E)
        console.log("test1");
        var x = 0; /* gameRoom.getStartPosition().getCordX(); */
        var y = 0; /* gameRoom.getStartPosition().getCordY(); */
        var d = Direction.DOWNRIGHT; /* gameRoom.getStartDirection(); */
        var ppant = new Participant(ppantID, new Position( 1, x, y ), d); // the '1' should be the roomID
        var ppantCont = new ParticipantController(ppant);
        console.log("test2");
        ppants.set(ppantID, ppant);
        ppantControllers.set(socket.id, ppantCont);
        console.log("test3");

        // (iv)
        // The position of the participant-Instance is also set here
        // gameRoomController.addParticipantController(ppantCont);
        
        
        // (v)
        /* Some notes on the following few lines of code:
         * This is supposed to make sure the client-side game state is initialized properly
         * This should probably later on be moved into the ParticipantController class
         * Not just one message since the first function should only be called once
         * Where as the second one will probably be called more often
         * - (E) */ 
        // Sends the newly generated ppantID back to the client so the game-states are consistent
        io.to(socket.id).emit('currentGameStateYourID', ppantID);
        console.log("test4");
        // Sends the start-position back to the client so the avatar can be displayed in the right cell
        io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: d });
        console.log("test5");
        ppants.forEach( (value, key, map) => {
            if(key != ppantID) {
                var tempPos = value.getPosition();
                var tempX = tempPos.getCordX();
                var tempY = tempPos.getCordY();
                var tempDir = value.getDirection();
                io.to(socket.id).emit('roomEnteredByParticipant', { id: key, cordX: tempX, cordY: tempY, dir: tempDir });
                console.log("Participant " + key + " is being initialized at the view of participant " + ppantID);
            }   
        });
        // (vi)
        /* Emits the ppantID of the new participant to all other participants
         * connected to the server so that they may create a new client-side
         * participant-instance corresponding to it.
         * - (E) */
        // This should send to all other connected sockets but not to the one
        // that just connected
        // It might be nicer to move this into the ppantController-Class
        // later on
        // - (E)
        socket.broadcast.emit('roomEnteredByParticipant', { id: ppantID, cordX: x, cordY: y, dir: d });
        console.log("test6");
    });
    
    /* Now we handle receiving a movement-input from a participant.
     * NOTE:
     * WE'RE GOING TO WRITE THIS IN A WAY THAT MAKES THE SERVER HANDLE
     * EACH MOVEMENT INDIVIDUALLY, MEANING THAT THE SERVER HANDLES AND
     * INFORMS ABOUT EACH MOVEMENT ACTION SEPERATELY, NOT COLLECTING
     * THEM INTO A SINGLE MESSAGE THAT GETS SEND OUT REGULARLY
     * - (E) */
    socket.on('requestMovementStart', (ppantID, direction, newCordX, newCordY) => {
        // TODO
        // Update Position server-side
        var newPos = new Position(1, newCordX, newCordY);
        ppants.get(ppantID).setPosition(newPos);
        ppants.get(ppantID).setDirection(direction);
        socket.broadcast.emit('movementOfAnotherPPantStart', ppantID, direction);
    });

    socket.on('requestMovementStop', ppantID => {
        // TODO
        // handle this properly server-side
        socket.broadcast.emit('movementOfAnotherPPantStop', ppantID);
    });
    
    // This will need a complete rewrite once the server-side models are properly implemented
    // as of now, this is completely broken
    socket.on('disconnect', () => {
        /* This still needs error-Handling for when no such ppantCont exists - (E) */
        var ppantID = 1; //ppantControllers.get(socket.id).getParticipant().getId();
        
        // gameRoomController.removeParticipantController(ppantControllers.get(socket.id);
        // The next line can probably be just handled inside the previous one
        io.sockets.emit('remove player', ppantID);
        console.log('Participant ' + socket.id + ' has disconnected from the game . . .');
        
        ppantControllers.delete(socket.id);
        // Destroy ppant and his controller
    });
});

/* Set to the same time-Interval as the gameplay-loop, this just sends out
 * an updated gameState every something miliseconds.
 * As the gameStates are still quite small, I reckon this should be alright
 * (for now). This will, however, later be fixed when the system is a bit
 * further down development.
 * - (E) */
//setInterval( () => {
//    io.sockets.emit('gameStateUpdate', participants);
//}, 50);












