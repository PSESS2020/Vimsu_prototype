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
const AccountService = require('../../../../website/services/AccountService');
const BusinessCard = require('../models/BusinessCard.js');
const LectureService = require('../services/LectureService');

const TypeChecker = require('../../utils/TypeChecker.js');




/* This should later on be turned into a singleton */
module.exports = class ServerController {
    
    #io;
    #listOfConfCont;
    #DEBUGMODE;

    //TODO: Muss noch ausgelagert werden in RoomController oder ConferenceController
    #rooms;
    
    constructor(socket) {
        this.#io = socket;
        this.#DEBUGMODE = true;
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

        /*
        FOYER: this.#rooms[Settings.FOYER_ID - 1];
        FOODCOURT: this.#rooms[Settings.FOODCOURT_ID - 1];
        RECEPTION: this.#rooms[Settings.RECEPTION_ID - 1];
        /*

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
                if (ppantControllers.has(socket.id) || !socket.request.session.loggedin) {
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

                var startPosition = this.#rooms[Settings.FOYER_ID - 1].getStartPosition();
                var x = startPosition.getCordX();
                var y = startPosition.getCordY();
                var d = this.#rooms[Settings.FOYER_ID - 1].getStartDirection();
                console.log("accId: " + socket.request.session.accountId);

                //variables for creating BusinessCard and Paricipant instance
                let accountId = socket.request.session.accountId;
                let username = socket.request.session.username;
                let title = socket.request.session.title;
                let surname = socket.request.session.surname;
                let forename = socket.request.session.forename;
                let job = socket.request.session.job;
                let company = socket.request.session.company;
                let email = socket.request.session.email;

                var businessCard = new BusinessCard(ppantID, username, title, surname, forename, job, company, email);

                //Needed for emiting this business card to other participants in room
                var businessCardObject = { 
                            id: ppantID, 
                            username: username, 
                            title: title, 
                            surname: surname, 
                            forename: forename, 
                            job: job, 
                            company: company, 
                            email: email 
                        };
                
                var ppant = new Participant(ppantID, accountId, businessCard, startPosition, d); 

                //At this point kind of useless, maybe usefull when multiple rooms exist (P)
                this.#rooms[Settings.FOYER_ID - 1].enterParticipant(ppant);
        
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
                //this.#io.to(socket.id).emit('currentGameStateYourID', ppantID);
                console.log("test4");
                //Send room information of start room (P)
                //TODO: When multiple rooms exist, get right room (P)

                let gameObjects = this.#rooms[Settings.FOYER_ID - 1].getListOfGameObjects();
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
                this.#io.to(socket.id).emit('currentGameStateYourRoom', Settings.FOYER_ID, TypeOfRoom.FOYER, 
                                            gameObjectData);

                // Sends the start-position, participant Id and business card back to the client so the avatar can be initialized and displayed in the right cell
                this.#io.to(socket.id).emit('initOwnParticipantState', { id: ppantID, businessCard: businessCardObject, cordX: x, cordY: y, dir: d});
                
                // Sends the start-position back to the client so the avatar can be displayed in the right cell
                this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, 
                                                                        cordY: y, 
                                                                        dir: d});
                // Initialize Allchat
                this.#io.to(socket.id).emit('initAllchat', this.#rooms[Settings.FOYER_ID - 1].getMessages());
                console.log("test5");
                
                ppants.forEach((ppant, id, map) => {
                    
                    if(id != ppantID && ppant.getPosition().getRoomId() === Settings.FOYER_ID) {

                        var businessCard = ppant.getBusinessCard();

                        var tempBusinessCard = {};
                        tempBusinessCard.id = businessCard.getParticipantId();

                        tempBusinessCard.username = businessCard.getUsername();
                    
                        tempBusinessCard.title = businessCard.getTitle();
                    
                        tempBusinessCard.surname = businessCard.getSurname();
                    
                        tempBusinessCard.forename = businessCard.getForename();
                    
                        tempBusinessCard.job = businessCard.getJob();
                    
                        tempBusinessCard.company = businessCard.getCompany();
                    
                        tempBusinessCard.email = businessCard.getEmail();

                        var tempPos = ppant.getPosition();
                        var tempX = tempPos.getCordX();
                        var tempY = tempPos.getCordY();
                        var tempDir = ppant.getDirection();

                        this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, businessCard: tempBusinessCard, cordX: tempX, cordY: tempY, dir: tempDir });
                        console.log("Participant " + id + " is being initialized at the view of participant " + ppantID);
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
                    socket.to(Settings.FOYER_ID.toString()).emit('roomEnteredByParticipant', { id: ppantID, businessCard: businessCardObject, cordX: x, cordY: y, dir: d });
                    console.log("test6");                
               
            });

            socket.on('sendMessage', (ppantID, text) => {
                
                var participant = ppants.get(ppantID);
                var roomID = participant.getPosition().getRoomId();
                var username = participant.getBusinessCard().getUsername();

                // timestamping the message - (E)
                var currentDate = new Date();
                var currentTime = (currentDate.getHours()<10?'0':'') +currentDate.getHours().toString() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes().toString();
                console.log("<" + currentTime + "> " + ppantID + " says " + text);
                this.#rooms[roomID - 1].addMessage(ppantID, username, currentTime, text);
                
                // Getting the roomID from the ppant seems to not work?
                this.#io.in(roomID.toString()).emit('newAllchatMessage', { senderID: ppantID, username: username, timestamp: currentTime, text: text });
                
                //this.#io.sockets.in(roomID.toString()).emit('newAllchatMessage', ppantID, currentTime, text);
            });
            
            /* Now we handle receiving a movement-input from a participant.
             * NOTE:
             * WE'RE GOING TO WRITE THIS IN A WAY THAT MAKES THE SERVER HANDLE
             * EACH MOVEMENT INDIVIDUALLY, MEANING THAT THE SERVER HANDLES AND
             * INFORMS ABOUT EACH MOVEMENT ACTION SEPERATELY, NOT COLLECTING
             * THEM INTO A SINGLE MESSAGE THAT GETS SEND OUT REGULARLY
             * - (E) */
            socket.on('requestMovementStart', (ppantID, direction, newCordX, newCordY) => {
                
                let roomId = ppants.get(ppantID).getPosition().getRoomId();
                
                let oldDir = ppants.get(ppantID).getDirection();
                let oldPos = ppants.get(ppantID).getPosition();
                let newPos = new Position(roomId, newCordX, newCordY);

                //check if new position is legit. Prevents manipulation from Client
                if (oldPos.getCordX() - newPos.getCordX() >= 2 || newPos.getCordX() - oldPos.getCordX() >= 2) {
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir});
                    return;
                }

                if (oldPos.getCordY() - newPos.getCordY() >= 2 || newPos.getCordY() - oldPos.getCordY() >= 2) {
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir});
                    return;
                }

                //CollisionCheck
                //No Collision, so every other participant gets the new position (P)
                if (!this.#rooms[roomId - 1].checkForCollision(newPos)) {
                    ppants.get(ppantID).setPosition(newPos);
                    ppants.get(ppantID).setDirection(direction);
                    socket.to(roomId.toString()).emit('movementOfAnotherPPantStart', ppantID, direction, newCordX, newCordY);
                } else {
                    //Server resets client position to old Position (P)
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir});
                }
            });
            
            //Handle movement stop
            socket.on('requestMovementStop', (ppantID) => {
                var roomId = ppants.get(ppantID).getPosition().getRoomId();

                socket.to(roomId.toString()).emit('movementOfAnotherPPantStop', ppantID);
            });

            //Event to handle click on food court door tile
            socket.on('enterRoom', (ppantID, targetRoomType) => {
                   
                //get right target room id
                var targetRoomId;
                if (targetRoomType === TypeOfRoom.FOYER) {
                    targetRoomId = Settings.FOYER_ID;
                } else if (targetRoomType === TypeOfRoom.FOODCOURT) {
                    targetRoomId = Settings.FOODCOURT_ID;
                } else if (targetRoomType === TypeOfRoom.RECEPTION) {
                    targetRoomId = Settings.RECEPTION_ID;
                }

                var currentRoomId = ppants.get(ppantID).getPosition().getRoomId();

                //Singleton
                let doorService = new DoorService();

                //get door from current room to target room
                let door = doorService.getDoorByRoom(currentRoomId, targetRoomId);

                //check if participant is in right position to enter room
                //ppants.get(ppantID).getPosition() !== door.getStartPosition() did not work for some reason
                if (ppants.get(ppantID).getPosition().getRoomId() !== door.getStartPosition().getRoomId() ||
                    ppants.get(ppantID).getPosition().getCordX() !== door.getStartPosition().getCordX() ||
                    ppants.get(ppantID).getPosition().getCordY() !== door.getStartPosition().getCordY()) {
                    console.log('wrong position');
                    return;
                }
                    
                let newPos = door.getTargetPosition();
                let x = newPos.getCordX();
                let y = newPos.getCordY();
                let d = door.getDirection();



                /*
                /Foyer has ID 1 and is this.#rooms[0]
                /FoodCourt has ID 2 and is this.#rooms[1]
                /Reception has ID 3 and is this.#rooms[2]
                */

                this.#rooms[targetRoomId - 1].enterParticipant(ppants.get(ppantID));
                this.#rooms[currentRoomId - 1].exitParticipant(ppantID);

                //get all GameObjects from target room
                let gameObjects = this.#rooms[targetRoomId - 1].getListOfGameObjects();
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
                });
                    
                //emit new room data to client
                this.#io.to(socket.id).emit('currentGameStateYourRoom', targetRoomId, targetRoomType, gameObjectData);

                //set new position in server model
                ppants.get(ppantID).setPosition(newPos);
                ppants.get(ppantID).setDirection(d);

                //Setting up the business card object
                let businessCard = ppants.get(ppantID).getBusinessCard();
                let businessCardObject = {
                        id: businessCard.getParticipantId(),

                        username: businessCard.getUsername(),
                    
                        title: businessCard.getTitle(),
                    
                        surname: businessCard.getSurname(),
                    
                        forename: businessCard.getForename(),
                    
                        job: businessCard.getJob(),
                    
                        company: businessCard.getCompany(),
                    
                        email: businessCard.getEmail(),
                }
                
                //Emit new position to participant
                this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: d});

                //Emit to all participants in old room, that participant is leaving
                socket.to(currentRoomId.toString()).emit('remove player', ppantID);

                //Emit to all participants in new room, that participant is joining
                socket.to(targetRoomId.toString()).emit('roomEnteredByParticipant', { id: ppantID, businessCard: businessCardObject, cordX: x, cordY: y, dir: d });

                //Emit to participant all participant positions, that were in new room before him
                ppants.forEach((ppant, id, map) => {
                    if(id != ppantID && ppant.getPosition().getRoomId() === targetRoomId) {
                        var businessCard = ppant.getBusinessCard();

                        var tempBusinessCard = {};
                        tempBusinessCard.id = businessCard.getParticipantId();

                        tempBusinessCard.username = businessCard.getUsername();
                    
                        tempBusinessCard.title = businessCard.getTitle();
                    
                        tempBusinessCard.surname = businessCard.getSurname();
                    
                        tempBusinessCard.forename = businessCard.getForename();
                    
                        tempBusinessCard.job = businessCard.getJob();
                    
                        tempBusinessCard.company = businessCard.getCompany();
                    
                        tempBusinessCard.email = businessCard.getEmail();

                        var tempPos = ppant.getPosition();
                        var tempX = tempPos.getCordX();
                        var tempY = tempPos.getCordY();
                        var tempDir = ppant.getDirection();
                        this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, businessCard: tempBusinessCard, cordX: tempX, cordY: tempY, dir: tempDir });
                        console.log("Participant " + id + " is being initialized at the view of participant " + ppantID);
                    }   
                });

                //switch socket channel
                socket.leave(currentRoomId.toString());
                socket.join(targetRoomId.toString());
                this.#io.to(socket.id).emit('initAllchat', this.#rooms[targetRoomId - 1].getMessages());

            });

            socket.on('lectureMessage', (ppantID, text) => {
                // timestamping the message - (E)
                var currentDate = new Date();
                var currentTime = (currentDate.getHours()<10?'0':'') + currentDate.getHours().toString() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes().toString();
                console.log("<" + currentTime + "> " + ppantID + " says " + text + " in lecture.");
                // Getting the roomID from the ppant seems to not work?
                this.#io.emit('lectureMessageFromServer', ppantID, currentTime, text);
                //this.#io.sockets.in(roomID.toString()).emit('newAllchatMessage', ppantID, currentTime, text);
            

            });

            // TODO: remove and make it work with the actual model
            var mockedLectures = [{
                id: 1,
                title: 'Grundbegriffe der Informatik',
                speaker: 'Stüker',
                summary: 'Die wundersame Welt von Automaten und Turing Maschinen fasziniert Informatiker aller Generationen.',
                startTime: Date.now() - 600000,
                endTime: Date.now() + 300000,
                videoUrl: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'
                
            }, 
            {
                id: 2,
                title: 'Softwaretechnik 1',
                speaker: 'Walter F. Tichy',
                summary: 'Spannende Entwurfsmuster für jung und alt.',
                startTime: Date.now() - 500000,
                endTime: Date.now() + 560000,
                videoUrl: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'
            }]
            socket.on('getCurrentLectures', (ppantID) => {
                let doorService = new DoorService();
                let lectureDoorPosition = doorService.getLectureDoorPosition();

                //check if participant is in right position to enter room
                //ppants.get(ppantID).getPosition() !== door.getStartPosition() did not work for some reason
                if (ppants.get(ppantID).getPosition().getRoomId() !== lectureDoorPosition.getRoomId() ||
                    ppants.get(ppantID).getPosition().getCordX() !== lectureDoorPosition.getCordX() ||
                    ppants.get(ppantID).getPosition().getCordY() !== lectureDoorPosition.getCordY()) {
                    console.log('wrong position');
                    return;
                }

                // TODO: return the lectures here from the schedule, mocked for now
                //something like var lectures = this.conference.getSchedule().getCurrentLectures()

                socket.emit('currentLectures', mockedLectures);
            });

            socket.on('getSchedule', () => {
                LectureService.getAllLecturesWithOratorData("1").then(lectures => {
                    socket.emit('currentSchedule', lectures);
                }) 
            });

            socket.on('enterLecture', (ppantID, lectureId) => {
                console.log('id: ' + lectureId);
                console.log(mockedLectures.filter(x => x.id === lectureId)[0]);


                // TODO: retrieve data from the database here
                // and also add user to the chat accordingly
                socket.emit('lectureEntered',  mockedLectures.filter(x => x.id.toString() === lectureId.toString())[0]);
            })            

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
                console.log(ppantID);
                socket.broadcast.emit('remove player', ppantID);
                console.log('Participant with Participant_ID: ' + ppantID + ' has disconnected from the game . . .');

                //remove participant from room
                var currentRoomId = ppants.get(ppantID).getPosition().getRoomId();
                this.#rooms(currentRoomId - 1).exitParticipant(ppantID);
                
                ppantControllers.delete(socket.id);
                ppants.delete(ppantID);

                // Destroy ppant and his controller
            });

            //Allows debugging the server. 
            //BEWARE: In debug mode everything can be manipulated so the server can crash easily.
            socket.on('evalServer', (data) => {
                if(!this.#DEBUGMODE)
                    return;

                try {
                    var res = eval(data);
                } catch (e) {
                    console.log("Eval Error: Can't find " + data + " in code.");
                    return;
                }		
                socket.emit('evalAnswer',res);
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