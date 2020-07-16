/* ############################################################################### */
/* ########################### LOADING REQUIREMENTS ############################## */
/* ############################################################################### */

const socketio = require('socket.io');

const Position = require('../models/Position.js');
const Direction = require('../models/Direction.js');

const Participant = require('../models/Participant.js');
const ParticipantController = require('./ParticipantController.js');

const Room  = require('../models/Room.js');
const RoomService = require('../services/RoomService.js');
const RoomController = require('./RoomController.js');
const TypeOfRoom = require('../models/TypeOfRoom.js');
const Settings = require('../../utils/Settings.js');
const Door = require('../models/Door.js');
const DoorService = require('../services/DoorService.js');

const TypeChecker = require=('../../utils/TypeChecker.js');


/* This should later on be turned into a singleton */
module.exports = class ServerController {
    
    #io;
    #listOfConfCont;

    //TODO: Muss noch ausgelagert werden in RoomController oder ConferenceController
    #rooms;
    
    constructor(socket) {
        this.#io = socket;        
    }
    
    //There are currently 3 differenct socketIo Channels
    //foyerChannel: Settings.FOYER_ID.toString()
    //foodCourtChannel: Settings.FOODCOURT_ID.toString()
    //receptionChannel: Settings.RECEPTION_ID.toString()


    init() {
        /* First, we create a map that will hold all ppantControllers, indexed by their socket.ids 
         * - (E) */
        var counter = 0;
        const ppantControllers = new Map();
        const ppants = new Map();  // Array to hold all participants

        
        //Init all rooms
        var roomService = new RoomService();
        this.#rooms = roomService.getAllRooms();

        var foyerRoom = this.#rooms[0];
        var foodCourtRoom = this.#rooms[1];
        var receptionRoom = this.#rooms[2];

        //RoomController not needed at this point (P)
        //const gameRoomController = new RoomController(foyerRoom);

        /* This is the program logic handling new connections.
         * This may late be moved into the server or conference-controller?
         * - (E) */
        this.#io.on('connection', (socket) => {
            /* When a new player connects, we create a participant instance, initialize it to
             * the right position (whatever that is) and the emit that to all the other players,
             * unless we're just doing regular game-state updates.
             * - (E) */
            socket.on('new participant', () => {

                //First Channel (P)
                socket.join(Settings.FOYER_ID.toString());
                
                /* If we already have a ppant connected on this socket, we do nothing
                /* - (E) */
                if (ppantControllers.has(socket.id)) {
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
                var ppantID = (counter++).toString(); // let's hope I am a smart boy and this works - (E)
                console.log("test1");
                
                //TODO: Needs to be adjusted when multiple rooms exist (P)
                //currently every participant spawns in foyer at the start position
                //Future Goal: Spawn returning participants at position, where he disconnected
                //Spawn new participants at reception start position

                var startPosition = foyerRoom.getStartPosition();
                var x = startPosition.getCordX();
                var y = startPosition.getCordY();
                var d = foyerRoom.getStartDirection();

                let accountId = request.session.accountId;
                
                var ppant = new Participant(ppantID, accountId, startPosition, d); 

                //At this point kind of useless, maybe usefull when multiple rooms exist (P)
                foyerRoom.enterParticipant(ppant);
        
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
                this.#io.to(socket.id).emit('currentGameStateYourID', ppantID);
                console.log("test4");
                //Send room information of start room (P)
                //TODO: When multiple rooms exist, get right room (P)

                let gameObjects = foyerRoom.getListOfGameObjects();
                let gameObjectData = [];

                //needed to send all gameObjects of starting room to client
                //would be nicer and easier if they both share GameObject.js
                gameObjects.forEach(gameObject => {
                    gameObjectData.push({ id: gameObject.getId(),
                      name: gameObject.getName(),
                      width: gameObject.getWidth(),
                      length: gameObject.getLength(),
                      cordX: gameObject.getPosition().getCordX(),
                      cordY: gameObject.getPosition().getCordY(),
                      isSolid: gameObject.getSolid()
                    });
                })

                //Server sends Room ID, typeOfRoom and listOfGameObjects to Client
                this.#io.to(socket.id).emit('currentGameStateYourRoom', foyerRoom.getRoomId(), foyerRoom.getTypeOfRoom(), 
                                            gameObjectData);
                // Sends the start-position back to the client so the avatar can be displayed in the right cell
                this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, 
                                                                        cordY: y, 
                                                                        dir: d});
                console.log("test5");
                
                ppants.forEach( (value, key, map) => {
                    
                    if(key != ppantID && value.getPosition().getRoomId() === Settings.FOYER_ID) {
                        
                        var tempPos = value.getPosition();
                        var tempX = tempPos.getCordX();
                        var tempY = tempPos.getCordY();
                        var tempDir = value.getDirection();
                        var tempName = AccountService.getAccountUsername(value.getAccountId());

                        this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: key, cordX: tempX, cordY: tempY, dir: tempDir , username: tempName});
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
                var username = AccountService.getAccountUsername(value.getAccountId());
                this.#io.sockets.in(Settings.FOYER_ID.toString()).emit('roomEnteredByParticipant', { id: ppantID, cordX: x, cordY: y, dir: d, username: username });
                console.log("test6");
            });
            
            /* Now we handle receiving a movement-input from a participant.
             * NOTE:
             * WE'RE GOING TO WRITE THIS IN A WAY THAT MAKES THE SERVER HANDLE
             * EACH MOVEMENT INDIVIDUALLY, MEANING THAT THE SERVER HANDLES AND
             * INFORMS ABOUT EACH MOVEMENT ACTION SEPERATELY, NOT COLLECTING
             * THEM INTO A SINGLE MESSAGE THAT GETS SEND OUT REGULARLY
             * - (E) */
            socket.on('requestMovementStart', (ppantID, direction, currRoomId, newCordX, newCordY) => {
                
                let newPos = new Position(currRoomId, newCordX, newCordY);
                let room = this.#rooms[currRoomId - 1];

                //No Collision, so every other participant gets the new position (P)
                if (!room.checkForCollision(newPos)) {
                    ppants.get(ppantID).setPosition(newPos);
                    ppants.get(ppantID).setDirection(direction);
                    this.#io.sockets.in(currRoomId.toString()).emit('movementOfAnotherPPantStart', ppantID, direction, newCordX, newCordY);
                } else {
                    //Server resets client position to old Position (P)
                    var oldPos = ppants.get(ppantID).getPosition();
                    var oldDir = ppants.get(ppantID).getDirection();
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir});
                    }
                });
                
            socket.on('requestMovementStop', (ppantID, currRoomId) => {
                
                this.#io.sockets.in(currRoomId.toString()).emit('movementOfAnotherPPantStop', ppantID);
            });

             //Event to handle click on food court door tile
             socket.on('enterFoodCourt', (ppantID, currentRoomId) => {
                   
                let gameObjects = foodCourtRoom.getListOfGameObjects();
                let gameObjectData = [];
                let targetId = foodCourtRoom.getRoomId();
                let typeOfRoom = foodCourtRoom.getTypeOfRoom();
                foodCourtRoom.enterParticipant(ppants.get(ppantID));
                socket.join(Settings.FOODCOURT_ID.toString());
            
                //needed to send all gameObjects of starting room to client
                //would be nicer and easier if they both share GameObject.js
                gameObjects.forEach(gameObject => {
                    gameObjectData.push({ id: gameObject.getId(),
                    name: gameObject.getName(),
                    width: gameObject.getWidth(),
                    length: gameObject.getLength(),
                    cordX: gameObject.getPosition().getCordX(),
                    cordY: gameObject.getPosition().getCordY(),
                    isSolid: gameObject.getSolid()
                    });
                });
                    
                this.#io.to(socket.id).emit('currentGameStateYourRoom', targetId, typeOfRoom, gameObjectData);

                //Singleton
                let doorService = new DoorService();

                let door = doorService.getDoorByRoom(currentRoomId, targetId);
                    
                let x = door.getTargetPosition().getCordX();
                let y = door.getTargetPosition().getCordY();
                let d = Settings.STARTDIRECTION;
                this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: d});

                this.#io.sockets.in(currentRoomId.toString()).emit('remove player', ppantID);
            });
            

            // This will need a complete rewrite once the server-side models are properly implemented
            // as of now, this is completely broken
            socket.on('disconnect', () => {
                //Prevents server crash because client sends sometimes disconnect" event on connection to server.
                if(!ppantControllers.has(socket.id)) {
                    console.log("disconnect");
                    return;
                }

                /* This still needs error-Handling for when no such ppantCont exists - (E) */
                var ppantID = ppantControllers.get(socket.id).getParticipant().getId();
                
                // gameRoomController.removeParticipantController(ppantControllers.get(socket.id);
                // The next line can probably be just handled inside the previous one
                //io.sockets.emit('remove player', ppantID);
                socket.broadcast.emit('remove player', ppantID);
                console.log('Participant with Participant_ID: ' + ppantID + ' has disconnected from the game . . .');
                
                ppantControllers.delete(socket.id);
                ppants.delete(ppantID);
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
    
    }
    
}
