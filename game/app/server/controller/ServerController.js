/* ############################################################################### */
/* ########################### LOADING REQUIREMENTS ############################## */
/* ############################################################################### */

const Position = require('../models/Position.js');
const ParticipantController = require('./ParticipantController.js');
const RoomService = require('../services/RoomService.js');
const TypeOfRoom = require('../../client/shared/TypeOfRoom.js');
const Settings = require('../../utils/Settings.js');
const Commands = require('../../utils/Commands.js');
const LectureService = require('../services/LectureService');
const Schedule = require('../models/Schedule')
const RankListService = require('../services/RankListService')
const Account = require('../../../../website/models/Account.js');
const TypeOfTask = require('../../utils/TypeOfTask.js')
const Messages = require('../../utils/Messages.js');
const Conference = require('../models/Conference.js');
const ChatService = require('../services/ChatService.js');
const ParticipantService = require('../services/ParticipantService.js');
const AchievementService = require('../services/AchievementService.js');
const TaskService = require('../services/TaskService.js');
const FriendListService = require('../services/FriendListService.js');
const FriendRequestListService = require('../services/FriendRequestListService.js');
const OneToOneChat = require('../models/OneToOneChat.js');

module.exports = class ServerController {

    #io;
    #db;
    #blob;
    #conference;
    #listOfConfCont;
    #DEBUGMODE;
    #banList;
    #muteList;
    #ppantControllers;


    //TODO: Muss noch ausgelagert werden in RoomController oder ConferenceController
    #rooms;
    #ppants;
    #roomService;

    constructor(socket, db, blob) {
        if (!!ServerController.instance) {
            return ServerController.instance;
        }

        ServerController.instance = this;

        this.#io = socket;
        this.#db = db;
        this.#blob = blob;

        //Should be turned off if the product gets released.
        this.#DEBUGMODE = false;

        //Should be initialized here, otherwise the controllers are reset every time a user joins.
        this.#ppantControllers = new Map();

        //Init all rooms
        this.#roomService = new RoomService();
        //Array to hold all Rooms
        this.#rooms = this.#roomService.getAllRooms();

        this.#banList = [];
        this.#muteList = [];

        // Array to hold all participants
        this.#ppants = new Map();

        this.init();
    }

    //There are currently 3 differenct socketIo Channels
    //foyerChannel: Settings.FOYER_ID.toString()
    //foodCourtChannel: Settings.FOODCOURT_ID.toString()
    //receptionChannel: Settings.RECEPTION_ID.toString()

    init() {

        LectureService.createAllLectures(Settings.CONFERENCE_ID, this.#db).then(lectures => {
            var schedule = new Schedule(lectures);
            var conference = new Conference(schedule);
            this.#conference = conference;
        }).catch(err => {
            console.error(err);
        });

        this.#io.on('connection', (socket) => {

            /* When a new player connects, we create a participant instance, initialize it to
             * the right position (whatever that is) and the emit that to all the other players,
             * unless we're just doing regular game-state updates.
             * - (E) */
            socket.on('new participant', () => {
                /* If we already have a ppant connected on this socket, we do nothing
                /* - (E) */
                if (this.#ppantControllers.has(socket.id) || !socket.request.session.loggedin) {
                    return;
                }

                // TODO: make tis not display ban-message on double-log-in
                var accountId = socket.request.session.accountId;
                if (this.isBanned(accountId)) {
                    this.#io.to(socket.id).emit('remove yourself');
                    return;
                }

                console.log('Participant ' + socket.id + ' has connected to the game . . . ');

                //variables for creating account instance
                //let accountId = socket.request.session.accountId;
                let username = socket.request.session.username;
                let title = socket.request.session.title;
                let surname = socket.request.session.surname;
                let forename = socket.request.session.forename;
                let job = socket.request.session.job;
                let company = socket.request.session.company;
                let email = socket.request.session.email;

                let account = new Account(accountId, username, title, surname, forename, job, company, email);

                //create Participant
                //ParticipantService either creates a new one or gets old data from DB
                ParticipantService.createParticipant(account, Settings.CONFERENCE_ID, this.#db).then(ppant => {
                    if (this.#ppants.has(ppant.getId())) {
                        console.log("ppant already joined the game");
                        this.#io.to(socket.id).emit('gameEntered');
                        return;
                    }

                    let currentRoomId = ppant.getPosition().getRoomId();
                    let currentRoom = this.#rooms[currentRoomId - 1].getRoom();

                    let typeOfCurrentRoom;
                    for (var i = 0, n = this.#rooms.length; i < n; i++) {
                        if (this.#rooms[i].getRoom().getRoomId() === currentRoomId) {
                            typeOfCurrentRoom = this.#rooms[i].getRoom().getTypeOfRoom();
                            break;
                        }
                    }

                    console.log("roomId:" + currentRoomId)

                    socket.ppantId = ppant.getId();

                    //Join Room Channel (P)
                    socket.join(currentRoomId.toString());

                    //Join all Chat Channels
                    //console.log("server ppant chatlist: " + ppant.getChatList());
                    ppant.getChatList().forEach(chat => {
                        socket.join(chat.getId());
                    });

                    //At this point kind of useless, maybe usefull when multiple rooms exist (P)
                    currentRoom.enterParticipant(ppant);
                    var ppantCont = new ParticipantController(ppant);
                    this.#ppants.set(ppant.getId(), ppant);

                    //console.log("add participant to ppantcontroller: " + socket.id + " " + ppantCont.getParticipant().getId());
                    this.#ppantControllers.set(socket.id, ppantCont);

                    //Get asset paths of starting room
                    let assetPaths = this.#rooms[currentRoomId - 1].getAssetPaths();

                    //Get MapElements of starting room
                    let mapElements = currentRoom.getListOfMapElements();
                    let mapElementsData = [];

                    mapElements.forEach(mapElement => {
                        mapElementsData.push({
                            id: mapElement.getId(),
                            type: mapElement.getGameObjectType(),
                            name: mapElement.getName(),
                            width: mapElement.getWidth(),
                            length: mapElement.getLength(),
                            cordX: mapElement.getPosition().getCordX(),
                            cordY: mapElement.getPosition().getCordY(),
                            isSolid: mapElement.getSolid(),
                            isClickable: mapElement.getClickable()
                        });
                    });

                    //Get GameObjects of starting room
                    let gameObjects = currentRoom.getListOfGameObjects();
                    let gameObjectData = [];

                    //needed to send all gameObjects of starting room to client
                    //would be nicer and easier if they both share GameObject.js
                    gameObjects.forEach(gameObject => {
                        gameObjectData.push({
                            id: gameObject.getId(),
                            type: gameObject.getGameObjectType(),
                            name: gameObject.getName(),
                            width: gameObject.getWidth(),
                            length: gameObject.getLength(),
                            cordX: gameObject.getPosition().getCordX(),
                            cordY: gameObject.getPosition().getCordY(),
                            isSolid: gameObject.getSolid(),
                            isClickable: gameObject.getClickable()
                        });
                    });

                    //Get all NPCs from starting room
                    let npcs = currentRoom.getListOfNPCs();
                    let npcData = [];

                    //needed to init all NPCs in clients game view
                    npcs.forEach(npc => {
                        npcData.push({
                            id: npc.getId(),
                            name: npc.getName(),
                            cordX: npc.getPosition().getCordX(),
                            cordY: npc.getPosition().getCordY(),
                            direction: npc.getDirection()
                        });
                    });

                    //Get all Doors from starting room
                    let doors = currentRoom.getListOfDoors();
                    let doorData = [];

                    //needed to init all Doors in clients game view
                    doors.forEach(door => {
                        console.log(door.getTargetRoomId())

                        doorData.push({
                            id: door.getId(),
                            typeOfDoor: door.getTypeOfDoor(),
                            name: door.getName(),
                            cordX: door.getMapPosition().getCordX(),
                            cordY: door.getMapPosition().getCordY(),
                            targetRoomId: door.getTargetRoomId()
                        });
                    });



                    //Needed for emiting this business card to other participants in room
                    var businessCardObject = {
                        id: ppant.getId(),
                        username: username,
                        title: title,
                        surname: surname,
                        forename: forename,
                        job: job,
                        company: company,
                        email: email
                    };


                    //Server sends Room ID, typeOfRoom and listOfGameObjects to Client
                    this.#io.to(socket.id).emit('currentGameStateYourRoom', currentRoomId, typeOfCurrentRoom,
                        assetPaths, mapElementsData, gameObjectData, npcData, doorData, currentRoom.getWidth(), currentRoom.getLength());


                    // Sends the start-position, participant Id and business card back to the client so the avatar can be initialized and displayed in the right cell
                    this.#io.to(socket.id).emit('initOwnParticipantState', { id: ppant.getId(), businessCard: businessCardObject, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection() });

                    // Initialize Allchat
                    this.#io.to(socket.id).emit('initAllchat', currentRoom.getMessages());

                    this.#ppants.forEach((participant, id, map) => {

                        if (id != ppant.getId() && participant.getPosition().getRoomId() === currentRoomId) {

                            var username = participant.getBusinessCard().getUsername();

                            var tempPos = participant.getPosition();
                            var tempX = tempPos.getCordX();
                            var tempY = tempPos.getCordY();
                            var tempDir = participant.getDirection();

                            this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, username: username, cordX: tempX, cordY: tempY, dir: tempDir });
                            console.log("Participant " + id + " is being initialized at the view of participant ");
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
                    socket.to(currentRoomId.toString()).emit('roomEnteredByParticipant', { id: ppant.getId(), username: businessCardObject.username, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection() });

                    if (typeOfCurrentRoom === TypeOfRoom.FOYER) {
                        this.applyTaskAndAchievement(ppant.getId(), TypeOfTask.FOYERVISIT);
                    } else if (typeOfCurrentRoom === TypeOfRoom.FOODCOURT) {
                        this.applyTaskAndAchievement(ppant.getId(), TypeOfTask.FOODCOURTVISIT);
                    } else if (typeOfCurrentRoom === TypeOfRoom.RECEPTION) {
                        this.applyTaskAndAchievement(ppant.getId(), TypeOfTask.RECEPTIONVISIT);
                    }

                    RankListService.getRank(ppant.getId(), Settings.CONFERENCE_ID, this.#db).then(rank => {
                        socket.emit('updateSuccessesBar', ppant.getAwardPoints(), rank);
                    }).catch(err => {
                        console.error(err);
                    })

                }).catch(err => {
                    console.error(err)
                });
            });


            socket.on('sendMessage', (ppantID, text) => {

                var participant = this.#ppants.get(ppantID);

                /* Adding the possibility of chat-based commands for moderators.
                 * Checks if the participant is a moderator and if the first character
                 * of their message is the "command-starting character" (atm, this
                 * is a backslash). Only if these two conditions are met we start
                 * checking for the actual commands.
                 *
                 * You could probably use the '==='-operator here, but I am not a 
                 * hundred percent sure, so I didn't for now.
                 *
                 *  - (E) */
                if (participant.isModerator() && text.charAt(0) == Settings.CMDSTARTCHAR) {
                    /* Now, we check if the message contains any command
                     * known by the server and handle this appropriately.
                     * We move this to another method for better readability.
                     *
                     * We also remove the first character of the string (the
                     * "command-starting character"), because we do no longer
                     * need it.
                     *
                     * - (E) */
                    this.commandHandler(participant, text.substr(1));
                } else { // If the message contains a command, we don't want to be handled like a regular message

                    if (this.#muteList.includes(socket.request.session.accountId)) {
                        this.sendMute(socket.id);
                        return; // muted ppants can't post messages into any allchat
                    }

                    var roomID = participant.getPosition().getRoomId();
                    var username = participant.getBusinessCard().getUsername();

                    // timestamping the message - (E)
                    var currentDate = new Date();
                    this.#rooms[roomID - 1].getRoom().addMessage(ppantID, username, currentDate, text);

                    // Getting the roomID from the ppant seems to not work?
                    this.#io.in(roomID.toString()).emit('newAllchatMessage', { username: username, timestamp: currentDate, text: text });

                    //this.#io.sockets.in(roomID.toString()).emit('newAllchatMessage', ppantID, currentTime, text);
                }

            });

            /* Now we handle receiving a movement-input from a participant.
             * NOTE:
             * WE'RE GOING TO WRITE THIS IN A WAY THAT MAKES THE SERVER HANDLE
             * EACH MOVEMENT INDIVIDUALLY, MEANING THAT THE SERVER HANDLES AND
             * INFORMS ABOUT EACH MOVEMENT ACTION SEPERATELY, NOT COLLECTING
             * THEM INTO A SINGLE MESSAGE THAT GETS SEND OUT REGULARLY
             * - (E) */
            socket.on('requestMovementStart', (ppantID, direction, newCordX, newCordY) => {

                let roomId = this.#ppants.get(ppantID).getPosition().getRoomId();

                let oldDir = this.#ppants.get(ppantID).getDirection();
                let oldPos = this.#ppants.get(ppantID).getPosition();
                let newPos = new Position(roomId, newCordX, newCordY);

                //check if new position is legit. Prevents manipulation from Client
                if (oldPos.getCordX() - newPos.getCordX() >= 2 || newPos.getCordX() - oldPos.getCordX() >= 2) {
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                    return;
                }

                if (oldPos.getCordY() - newPos.getCordY() >= 2 || newPos.getCordY() - oldPos.getCordY() >= 2) {
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                    return;
                }

                //CollisionCheck
                //No Collision, so every other participant gets the new position (P)
                if (!this.#rooms[roomId - 1].getRoom().checkForCollision(newPos)) {
                    this.#ppants.get(ppantID).setPosition(newPos);
                    this.#ppants.get(ppantID).setDirection(direction);
                    socket.to(roomId.toString()).emit('movementOfAnotherPPantStart', ppantID, direction, newCordX, newCordY);

                } else {
                    //Server resets client position to old Position (P)
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                }
            });


            //Handle movement stop
            socket.on('requestMovementStop', (ppantID) => {
                var roomId = this.#ppants.get(ppantID).getPosition().getRoomId();

                socket.to(roomId.toString()).emit('movementOfAnotherPPantStop', ppantID);
            });


            //Event to handle click on door tile
            socket.on('enterRoom', (ppantID, targetRoomId) => {

                let enterPosition = this.#ppants.get(ppantID).getPosition();
                let currentRoomId = enterPosition.getRoomId();
                let currentRoom = this.#rooms[currentRoomId - 1].getRoom();
                let targetRoom = this.#rooms[targetRoomId - 1].getRoom();
                let targetRoomType = targetRoom.getTypeOfRoom();

                //get door from current room to target room
                let door = currentRoom.getDoorTo(targetRoomId);
                //console.log("curr room " + currentRoomId + " target room " + targetRoomId + " target type " + targetRoomType + " target id" + door.getTargetRoomId());
                //check if participant is in right position to enter room
                //this.#ppants.get(ppantID).getPosition() !== door.getStartPosition() did not work for some reason
                if (!door.isValidEnterPosition(enterPosition)) {
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

                targetRoom.enterParticipant(this.#ppants.get(ppantID));
                currentRoom.exitParticipant(ppantID);

                //Get asset paths of target room
                let assetPaths = this.#rooms[targetRoomId - 1].getAssetPaths();

                //Get MapElements of target room
                let mapElements = targetRoom.getListOfMapElements();
                let mapElementsData = [];

                mapElements.forEach(mapElement => {
                    mapElementsData.push({
                        id: mapElement.getId(),
                        type: mapElement.getGameObjectType(),
                        name: mapElement.getName(),
                        width: mapElement.getWidth(),
                        length: mapElement.getLength(),
                        cordX: mapElement.getPosition().getCordX(),
                        cordY: mapElement.getPosition().getCordY(),
                        isSolid: mapElement.getSolid(),
                        isClickable: mapElement.getClickable()
                    });
                });

                //get all GameObjects from target room
                let gameObjects = targetRoom.getListOfGameObjects();
                let gameObjectData = [];

                //needed to send all gameObjects of starting room to client
                //would be nicer and easier if they both share GameObject.js
                gameObjects.forEach(gameObject => {
                    gameObjectData.push({
                        id: gameObject.getId(),
                        type: gameObject.getGameObjectType(),
                        name: gameObject.getName(),
                        width: gameObject.getWidth(),
                        length: gameObject.getLength(),
                        cordX: gameObject.getPosition().getCordX(),
                        cordY: gameObject.getPosition().getCordY(),
                        isSolid: gameObject.getSolid(),
                        isClickable: gameObject.getClickable()
                    });
                });

                let npcs = targetRoom.getListOfNPCs();
                let npcData = [];

                //needed to init all NPCs in clients game view
                npcs.forEach(npc => {
                    npcData.push({
                        id: npc.getId(),
                        name: npc.getName(),
                        cordX: npc.getPosition().getCordX(),
                        cordY: npc.getPosition().getCordY(),
                        direction: npc.getDirection()
                    });
                });

                //Get all Doors from starting room
                let doors = targetRoom.getListOfDoors();
                let doorData = [];

                //needed to init all Doors in clients game view
                doors.forEach(door => {
                    doorData.push({
                        id: door.getId(),
                        typeOfDoor: door.getTypeOfDoor(),
                        name: door.getName(),
                        cordX: door.getMapPosition().getCordX(),
                        cordY: door.getMapPosition().getCordY(),
                        targetRoomId: door.getTargetRoomId()
                    });
                });

                //emit new room data to client
                this.#io.to(socket.id).emit('currentGameStateYourRoom', targetRoomId, targetRoomType,
                    assetPaths, mapElementsData, gameObjectData, npcData, doorData, targetRoom.getWidth(), targetRoom.getLength());

                //set new position in server model
                this.#ppants.get(ppantID).setPosition(newPos);
                this.#ppants.get(ppantID).setDirection(d);

                //Get username
                let username = this.#ppants.get(ppantID).getBusinessCard().getUsername();

                //Emit new position to participant
                this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: d });

                //Emit to all participants in old room, that participant is leaving
                socket.to(currentRoomId.toString()).emit('remove player', ppantID);

                //Emit to all participants in new room, that participant is joining
                socket.to(targetRoomId.toString()).emit('roomEnteredByParticipant', { id: ppantID, username: username, cordX: x, cordY: y, dir: d });

                //Emit to participant all participant positions, that were in new room before him
                this.#ppants.forEach((ppant, id, map) => {
                    if (id != ppantID && ppant.getPosition().getRoomId() === targetRoomId) {
                        var username = ppant.getBusinessCard().getUsername();
                        var tempPos = ppant.getPosition();
                        var tempX = tempPos.getCordX();
                        var tempY = tempPos.getCordY();
                        var tempDir = ppant.getDirection();
                        this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, username: username, cordX: tempX, cordY: tempY, dir: tempDir });
                        console.log("Participant " + id + " is being initialized at the view of participant " + ppantID);
                    }
                });

                //switch socket channel
                socket.leave(currentRoomId.toString());
                socket.join(targetRoomId.toString());
                this.#io.to(socket.id).emit('initAllchat', this.#rooms[targetRoomId - 1].getRoom().getMessages());

                if (targetRoomId === Settings.FOYER_ID) {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.FOYERVISIT);
                } else if (targetRoomId === Settings.FOODCOURT_ID) {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.FOODCOURTVISIT);
                } else if (targetRoomId === Settings.RECEPTION_ID) {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.RECEPTIONVISIT);
                }
            });

            socket.on('lectureMessage', (ppantID, username, text) => {
                var lectureID = socket.currentLecture; // socket.currentLecture is the lecture the participant is currently in
                var lecture = this.#conference.getSchedule().getLecture(lectureID);
                var lectureChat = lecture.getLectureChat();
                var participant = this.#ppants.get(ppantID);

                /* We want to check if the ppant "owns" the lecture here.
                 * As the orator-class seems not be actually used yet, we just use
                 * the orator-name from the lecture class and compare it to the username
                 * of the aprticipant. And since I'm not sure if that will work, we just allow
                 * every moderator to use commands in the lecture-chat (for testing purposes).
                 * 
                 * - (E) */
                if (/* (participant.getBusinessCard().getUsername() == lecture.getOratorName() || */
                    participant.isModerator() /*)*/ && text.charAt(0) == Settings.CMDSTARTCHAR) {
                    /* Now, we check if the message contains any command
                     * known by the server and handle this appropriately.
                     * We move this to another method for better readability.
                     *
                     * We also remove the first character of the string (the
                     * "command-starting character"), because we do no longer
                     * need it.
                     *
                     * - (E) */
                    this.commandHandlerLecture(socket, lecture, text.substr(1));
                } else if (lecture.hasToken(ppantID)) {

                    this.applyTaskAndAchievement(ppantID, TypeOfTask.ASKQUESTIONINLECTURE);
                    //participant.increaseAchievementCount('messagesSent');

                    // timestamping the message - (E)
                    var currentDate = new Date();
                    var message = { senderID: ppantID, username: username, messageID: lectureChat.getMessages().length, timestamp: currentDate, messageText: text }
                    lectureChat.appendMessage(message);
                    console.log("<" + currentDate + "> " + ppantID + " says " + text + " in lecture.");

                    this.#io.in(socket.currentLecture).emit('lectureMessageFromServer', message);
                    

                }
            });

            var currentLecturesData = [];

            socket.on('enterLecture', (ppantID, lectureId) => {

                let idx = currentLecturesData.findIndex(x => x.id === lectureId);

                if (idx < 0) {
                    throw new Error(lectureId + " is not in list of current lectures")
                }

                var schedule = this.#conference.getSchedule();
                var lecture = schedule.getLecture(lectureId);

                if (lecture.isBanned(socket.request.session.accountId)) {
                    this.sendRemoval(socket.id);
                    return;
                }

                if (lecture.enter(ppantID)) {
                    console.log(ppantID + " joins " + lectureId);
                    socket.join(lectureId);
                    socket.currentLecture = lectureId;

                    var token = lecture.hasToken(ppantID);
                    var lectureChat = lecture.getLectureChat();
                    console.log(lectureChat);
                    var messages = lecture.getLectureChat().getMessages();
                    console.log(messages);

                    LectureService.getVideo(currentLecturesData[idx].videoId, this.#db).then(videoName => {
                        currentLecturesData[idx].videoUrl = "./game/video/" + videoName;
                        socket.emit('lectureEntered', currentLecturesData[idx], token, messages);
                        socket.broadcast.emit('hideAvatar', ppantID);
                    })
                } else {
                    socket.emit('lectureFull', currentLecturesData[idx].id);
                }
            })

            socket.on('leaveLecture', (participantId, lectureId, lectureEnded) => {
                var schedule = this.#conference.getSchedule();
                var lecture = schedule.getLecture(lectureId);
                lecture.leave(participantId);
                console.log(participantId + " leaves " + lectureId)
                socket.leave(lectureId);
                socket.currentLecture = undefined;
                socket.broadcast.emit('showAvatar', participantId);
                console.log(lectureEnded);
                if (lectureEnded) {
                    this.applyTaskAndAchievement(participantId, TypeOfTask.LECTUREVISIT);
                }
            });

            socket.on('getCurrentLectures', (ppantID) => {

                let enterPosition = this.#ppants.get(ppantID).getPosition();
                let currentRoomId = enterPosition.getRoomId();
                let lectureDoor = this.#rooms[currentRoomId - 1].getRoom().getLectureDoor();

                //check if participant is in right position to enter room
                //this.#ppants.get(ppantID).getPosition() !== door.getStartPosition() did not work for some reason
                if (!lectureDoor.isValidEnterPosition(enterPosition)) {
                    console.log('wrong position');
                    return;
                }

                var schedule = this.#conference.getSchedule();
                var currentLectures = schedule.getCurrentLectures();

                currentLecturesData = [];
                currentLectures.forEach(lecture => {
                    currentLecturesData.push(
                        {
                            id: lecture.getId(),
                            title: lecture.getTitle(),
                            videoId: lecture.getVideoId(),
                            duration: lecture.getDuration(),
                            remarks: lecture.getRemarks(),
                            oratorName: lecture.getOratorName(),
                            startingTime: lecture.getStartingTime(),
                            maxParticipants: lecture.getMaxParticipants()
                        }
                    )
                })

                socket.emit('currentLectures', currentLecturesData);
            });

            socket.on('getSchedule', () => {
                var schedule = this.#conference.getSchedule();
                var lectures = schedule.getAllLectures();

                var lecturesData = [];
                lectures.forEach(lecture => {
                    lecturesData.push(
                        {
                            id: lecture.getId(),
                            title: lecture.getTitle(),
                            remarks: lecture.getRemarks(),
                            oratorName: lecture.getOratorName(),
                            startingTime: lecture.getStartingTime(),
                            maxParticipants: lecture.getMaxParticipants()
                        }
                    )
                })

                socket.emit('currentSchedule', lecturesData);
            });

            socket.on('getBusinessCard', (ppantID, targetID) => {
                let businessCard = this.#ppants.get(targetID).getBusinessCard();
                let businessCardObject = {
                    id: businessCard.getParticipantId(),
                    username: businessCard.getUsername(),
                    title: businessCard.getTitle(),
                    surname: businessCard.getSurname(),
                    forename: businessCard.getForename(),
                    job: businessCard.getJob(),
                    company: businessCard.getCompany(),
                    email: undefined
                }

                let targetRank = undefined;

                //Check if ppant with targetID is a friend
                //if so, emit the email. if not, emit the rank
                if (this.#ppants.get(ppantID).getFriendList().includes(targetID)) {
                    businessCardObject.email = businessCard.getEmail();
                    socket.emit('businessCard', businessCardObject, targetRank);
                } else {
                    RankListService.getRank(targetID, Settings.CONFERENCE_ID, this.#db).then(rank => {
                        targetRank = rank;
                        socket.emit('businessCard', businessCardObject, targetRank);
                    })
                }
            });

            socket.on('getAchievements', (ppantID) => {

                var achData = [];

                this.#ppants.get(ppantID).getAchievements().forEach(ach => {
                    achData.push(
                        {
                            currentLevel: ach.getCurrentLevel(),
                            maxLevel: ach.getMaxLevel(),
                            color: ach.getColor(),
                            icon: ach.getIcon(),
                            title: ach.getTitle(),
                            description: ach.getDescription()
                        }
                    )
                });
                socket.emit('achievements', achData);
            });

            socket.on('getRankList', () => {
                RankListService.getRankListWithUsername(Settings.CONFERENCE_ID, 30, this.#db).then(rankList => {
                    socket.emit('rankList', rankList);
                })
            })

            socket.on('getFriendList', (ppantID) => {
                var friendList = this.#ppants.get(ppantID).getFriendList();

                var friendListData = [];

                friendList.getAllBusinessCards().forEach(businessCard => {
                    friendListData.push(
                        {
                            friendId: businessCard.getParticipantId(),
                            username: businessCard.getUsername(),
                            title: businessCard.getTitle(),
                            surname: businessCard.getSurname(),
                            forename: businessCard.getForename(),
                            surname: businessCard.getSurname(),
                            job: businessCard.getJob(),
                            company: businessCard.getCompany(),
                            email: businessCard.getEmail()
                        }
                    )
                });

                socket.emit('friendList', friendListData);
            });

            socket.on('getInviteFriends', (ppantID, groupName, chatId) => {
                if (!groupName || groupName.length > 20) {
                    socket.emit('inviteFriends', undefined, groupName, undefined);
                } else {
                    let ppant = this.#ppants.get(ppantID);
                    let friendList = ppant.getFriendList();

                    if (chatId) {
                        var chatPartnerIDList = ppant.getChat(chatId).getParticipantList();
                        var chatPartnerLength = chatPartnerIDList.length;
                        var friendIds = [];

                        friendList.getAllBusinessCards().forEach(businessCard => {
                            friendIds.push(businessCard.getParticipantId())
                        })

                        friendIds = friendIds.filter((friend) => !chatPartnerIDList.includes(friend));

                        var businessCards = [];

                        friendIds.forEach(friendId => {
                            businessCards.push(friendList.getBusinessCard(friendId));
                        })

                    } else {
                        var businessCards = friendList.getAllBusinessCards();
                        var chatPartnerLength = 1;
                    }

                    var friendListData = [];

                    businessCards.forEach(businessCard => {
                        friendListData.push(
                            {
                                friendId: businessCard.getParticipantId(),
                                username: businessCard.getUsername(),
                                title: businessCard.getTitle(),
                                surname: businessCard.getSurname(),
                                forename: businessCard.getForename(),
                                surname: businessCard.getSurname(),
                                job: businessCard.getJob(),
                                company: businessCard.getCompany(),
                                email: businessCard.getEmail()
                            }
                        )
                    });

                    socket.emit('inviteFriends', friendListData, groupName, Settings.MAXGROUPPARTICIPANTS - chatPartnerLength, chatId);
                }
            });

            socket.on('getFriendRequestList', (ppantID) => {
                var friendRequestList = this.#ppants.get(ppantID).getReceivedRequestList();

                var friendRequestListData = [];

                friendRequestList.getAllBusinessCards().forEach(businessCard => {
                    friendRequestListData.push(
                        {
                            friendId: businessCard.getParticipantId(),
                            username: businessCard.getUsername(),
                            title: businessCard.getTitle(),
                            surname: businessCard.getSurname(),
                            forename: businessCard.getForename(),
                            surname: businessCard.getSurname(),
                            job: businessCard.getJob(),
                            company: businessCard.getCompany(),
                            email: businessCard.getEmail()
                        }
                    )
                });

                socket.emit('friendRequestList', friendRequestListData);
            });



            //Called whenever a ppant creates a new 1:1 chat (P)
            socket.on('createNewChat', (creatorID, chatPartnerID, chatPartnerUsername) => {
                let creator = this.#ppants.get(creatorID);
                let chatPartner = this.#ppants.get(chatPartnerID);

                let areFriends = creator.hasFriend(chatPartnerID);
                let friendRequestSent = creator.hasSentFriendRequest(chatPartnerID);

                console.log(!creator.hasChatWith(chatPartnerID));
                //check if chat already exists, only create one if not
                if (!creator.hasChatWith(chatPartnerID)) {

                    let creatorUsername = creator.getBusinessCard().getUsername();
                    let chatData;

                    //creates new chat and writes it in DB
                    ChatService.newOneToOneChat(creatorID, chatPartnerID, creatorUsername, chatPartnerUsername, Settings.CONFERENCE_ID, this.#db).then(chat => {

                        //add chat to creator
                        creator.addChat(chat);

                        //Creator joins chat channel
                        socket.join(chat.getId());

                        //write ID in Participant Collection in DB
                        ParticipantService.addChatID(creatorID, chat.getId(), Settings.CONFERENCE_ID, this.#db);
                        ParticipantService.addChatID(chatPartnerID, chat.getId(), Settings.CONFERENCE_ID, this.#db);

                        chatData = {
                            title: chatPartnerUsername,
                            chatId: chat.getId(),
                            timestamp: '', //please dont change the timestamp here
                            previewUsername: '',
                            previewMessage: '',
                            areFriends: areFriends,
                            friendRequestSent: friendRequestSent,
                            partnerId: chatPartnerID,
                            groupChat: false,
                            messages: [],

                        };

                        this.applyTaskAndAchievement(creatorID, TypeOfTask.INITPERSONALCHAT);

                        /* Tell the creator's client to create a new chat. The true tells
                        * the client to immediately open the chatThreadView of the new chat 
                        * so that the creator can start sending messages.
                        * - (E) */
                        this.#io.to(socket.id).emit('newChat', chatData, true);

                        return chat;

                    }).then(chat => {

                        let chatId = chat.getId();

                        ChatService.loadChat(chatId, Settings.CONFERENCE_ID, this.#db).then(loadedChat => {

                            //check if chatPartner is online
                            if (chatPartner !== undefined) {
                                chatPartner.addChat(loadedChat);

                                chatData = {
                                    title: creatorUsername,
                                    chatId: loadedChat.getId(),
                                    timestamp: '', //please dont change the timestamp here
                                    previewUsername: '',
                                    previewMessage: '',
                                    areFriends: areFriends,
                                    friendRequestSent: friendRequestSent,
                                    partnerId: chatPartnerID,
                                    groupChat: false,
                                    messages: [],

                                };

                                //chat partner joins chat channel
                                let socketPartner = this.getSocketObject(this.getSocketId(chatPartner.getId()));
                                socketPartner.join(loadedChat.getId());
                                this.#io.to(this.getSocketId(chatPartner.getId())).emit('newChat', chatData, false);
                                this.#io.to(this.getSocketId(chatPartner.getId())).emit('gotNewChat', creatorUsername);
                            }

                        })
                    });

                } else {
                    ChatService.existsOneToOneChat(creatorID, chatPartnerID, Settings.CONFERENCE_ID, this.#db).then(chat => {
                        let chatData = {
                            title: chatPartnerUsername,
                            chatId: chat.chatId,
                            areFriends: areFriends,
                            friendRequestSent: friendRequestSent,
                            partnerId: chatPartnerID,
                            groupChat: false,
                            messages: chat.messageList,
                        }

                        this.#io.to(socket.id).emit('chatThread', chatData);
                    })
                }
            });

            //Called whenever a participant creates a new group chat (N)
            socket.on('createNewGroupChat', (creatorID, chatName, chatPartnerIDList, limit, chatId) => {

                if (chatPartnerIDList.length > limit || chatPartnerIDList.length < 1) {
                    return false;
                }

                let creator = this.#ppants.get(creatorID);
                let creatorUsername = creator.getBusinessCard().getUsername();

                //check if the invited friends are friends with the creator. if not, remove the partner from the list.
                chatPartnerIDList.forEach(chatPartnerID => {
                    if (!creator.hasFriend(chatPartnerID)) {
                        let index = chatPartnerIDList.indexOf(chatPartnerID);
                        chatPartnerIDList.splice(index, 1);
                    };
                })

                if (chatId) {
                    //group chat already exists
                    let chat = creator.getChat(chatId);

                    if (chat instanceof OneToOneChat) {
                        return false;
                    }

                    chatPartnerIDList.forEach(newChatPartnerID => {

                        if (newChatPartnerID !== creatorID) {

                            ParticipantService.addChatID(newChatPartnerID, chatId, Settings.CONFERENCE_ID, this.#db);

                            ChatService.storeParticipant(chatId, Settings.CONFERENCE_ID, newChatPartnerID, this.#db).then(res => {

                                ParticipantService.getUsername(newChatPartnerID, Settings.CONFERENCE_ID, this.#db).then(newChatPartnerUsername => {
                                    let msgText = newChatPartnerUsername + " has joined the chat";

                                    ChatService.createChatMessage(chatId, '', '', msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {

                                        let newChatPartner = this.#ppants.get(newChatPartnerID);

                                        ChatService.loadChat(chatId, Settings.CONFERENCE_ID, this.#db).then(loadedChat => {

                                            if (newChatPartner !== undefined) {

                                                newChatPartner.addChat(loadedChat);

                                                let socketPartner = this.getSocketObject(this.getSocketId(newChatPartner.getId()));

                                                socketPartner.join(loadedChat.getId());

                                                var messageInfoData = [];

                                                loadedChat.getMessageList().forEach((message) => {
                                                    messageInfoData.push({
                                                        senderUsername: message.getUsername(),
                                                        timestamp: message.getTimestamp(),
                                                        msgText: message.getMessageText()
                                                    });
                                                });

                                                if (loadedChat.getMessageList().length > 0) {
                                                    var lastMessage = loadedChat.getMessageList()[loadedChat.getMessageList().length - 1];
                                                    var previewText = lastMessage.getMessageText();

                                                    if (previewText.length > 36) {
                                                        previewText = previewText.slice(0, 36) + "...";
                                                    }

                                                    var chatData = {
                                                        chatId: loadedChat.getId(),
                                                        title: loadedChat.getChatName(),
                                                        timestamp: lastMessage.getTimestamp(),
                                                        previewUsername: lastMessage.getUsername(),
                                                        previewMessage: previewText,
                                                        areFriends: true,
                                                        friendRequestSent: true,
                                                        partnerId: undefined,
                                                        groupChat: true,
                                                        messages: messageInfoData
                                                    }

                                                } else {
                                                    var chatData = {
                                                        chatId: loadedChat.getId(),
                                                        title: loadedChat.getChatName(),
                                                        timestamp: '',
                                                        previewUsername: '',
                                                        previewMessage: '',
                                                        areFriends: true,
                                                        friendRequestSent: true,
                                                        partnerId: undefined,
                                                        groupChat: true,
                                                        messages: messageInfoData
                                                    }
                                                }

                                                this.#io.to(this.getSocketId(newChatPartner.getId())).emit('newChat', chatData, false);
                                                this.#io.to(this.getSocketId(newChatPartner.getId())).emit('gotNewGroupChat', chatData.title, creatorUsername);
                                            }

                                            let existingChatPartnerIDList = chat.getParticipantList();

                                            existingChatPartnerIDList.forEach(existingChatParticipantID => {
                                                let existingChatParticipant = this.#ppants.get(existingChatParticipantID);

                                                if (existingChatParticipant !== undefined) {
                                                    let existingChatParticipantChat = existingChatParticipant.getChat(chatId);
                                                    existingChatParticipantChat.addParticipant(newChatPartnerID);
                                                    existingChatParticipantChat.addMessage(msg);
                                                }
                                            })

                                            var msgToEmit = {
                                                senderUsername: msg.getUsername(),
                                                msgId: msg.getMessageId(),
                                                senderId: msg.getSenderId(),
                                                timestamp: msg.getTimestamp(),
                                                msgText: msg.getMessageText()
                                            };

                                            this.#io.in(chatId).emit('newChatMessage', chatId, msgToEmit);

                                        })
                                    })
                                })
                            })
                        }
                    })

                } else {

                    //group chat doesn't exist yet
                    console.log("new groupchat participants: " + chatPartnerIDList);

                    let chatData;

                    //still store creatorID in memberID, so that chat removal is easy
                    chatPartnerIDList.push(creatorID);

                    //creates new group chat and writes it in DB
                    ChatService.newGroupChat(creatorID, chatPartnerIDList, chatName, Settings.CONFERENCE_ID, this.#db).then(chat => {

                        //add chat to chat creator
                        creator.addChat(chat);

                        //write ID in Participant Collection of chat owner in DB
                        ParticipantService.addChatID(creatorID, chat.getId(), Settings.CONFERENCE_ID, this.#db);

                        //Creator joins chat channel
                        socket.join(chat.getId());

                        chatData = {
                            title: chat.getChatName(),
                            chatId: chat.getId(),
                            timestamp: '', //please dont change the timestamp here
                            previewUsername: '',
                            previewMessage: '',
                            areFriends: true,
                            friendRequestSent: true,
                            partnerId: undefined,
                            groupChat: true,
                            messages: []
                        };

                        this.applyTaskAndAchievement(creatorID, TypeOfTask.INITPERSONALCHAT);

                        /* Tell the creator's client to create a new chat. The true tells
                            * the client to immediately open the chatThreadView of the new chat 
                            * so that the creator can start sending messages.
                            * - (E) */
                        this.#io.to(socket.id).emit('newChat', chatData, true);


                        /*chatPartnerIDList.forEach(chatPartnerID => {
                            this.#ppantControllers.forEach( (ppantCont, socketId) => {
                                console.log("ppantController socket ids: " + socketId + " " + ppantCont.getParticipant().getId());
                            });

                            let chatPartner = this.#ppants.get(chatPartnerID);
                            console.log("server partner id group: " + chatPartner.getId() + " " + chatPartnerID)
                            let socketid = this.getSocketId(chatPartner.getId());

                            console.log("server socket id group: " + socketid)
    
                        })*/

                        return chat.getId();

                    }).then(chatId => {

                        chatPartnerIDList.forEach(chatPartnerID => {
                            if (chatPartnerID !== creatorID) {

                                ParticipantService.addChatID(chatPartnerID, chatId, Settings.CONFERENCE_ID, this.#db);

                                let chatPartner = this.#ppants.get(chatPartnerID);
                                //console.log("server socket id group: " + socketPartner)

                                if (chatPartner !== undefined) {

                                    ChatService.loadChat(chatId, Settings.CONFERENCE_ID, this.#db).then(loadedChat => {

                                        chatPartner.addChat(loadedChat);

                                        //console.log("server socket partner before: " + chatPartner.getId())

                                        //chat partner joins chat channel
                                        //console.log("server socket partner after: " + socketPartner.id)
                                        let socketPartner = this.getSocketObject(this.getSocketId(chatPartner.getId()));

                                        socketPartner.join(loadedChat.getId());

                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('newChat', chatData, false);
                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('gotNewGroupChat', chatData.title, creatorUsername);

                                    });
                                }
                            }
                        });

                    })
                }
            });


            /* Technically speaking, the client should not send the id to the
             * server, as this allows for spoofing. I think.
             * - (E) */

            /* Gets the necessary information for the chatListView and sends it to the client.
             * Gets the chatList from the participant and then for every chat gets the title,
             * the timestamp, sender-username and a preview of the last message for display purposes. 
             * - (E) */
            socket.on('getChatList', (ppantID, ppantUsername) => {
                var chatList = this.#ppants.get(ppantID).getChatList();
                var chatListData = [];
                chatList.forEach(chat => {
                    //console.log("chat from server: " + chat.getId())
                    if (chat.getMessageList().length > 0) {
                        var lastMessage = chat.getMessageList()[chat.getMessageList().length - 1];
                        var previewText = lastMessage.getMessageText();
                        if (previewText.length > 36) {
                            previewText = previewText.slice(0, 36) + "...";
                        }
                        //check if chat is 1:1 with non empty msg list
                        if (chat instanceof OneToOneChat) {
                            chatListData.push({
                                // Get some superficial chat data
                                title: chat.getOtherUsername(ppantUsername),
                                chatId: chat.getId(),
                                timestamp: lastMessage.getTimestamp(),
                                previewUsername: lastMessage.getUsername(),
                                previewMessage: previewText
                            });
                        }
                        //check if chat is non empty group chat
                        else {
                            chatListData.push({
                                // Get some superficial chat data
                                title: chat.getChatName(),
                                chatId: chat.getId(),
                                timestamp: lastMessage.getTimestamp(),
                                previewUsername: lastMessage.getUsername(),
                                previewMessage: previewText
                            });
                        }

                    } else {
                        //check if chat is 1:1 with empty msg list
                        if (chat instanceof OneToOneChat) {
                            chatListData.push({
                                // Get some superficial chat data
                                title: chat.getOtherUsername(ppantUsername),
                                chatId: chat.getId(),
                                timestamp: '', //please dont change the timestamp here
                                previewUsername: '',
                                previewMessage: ''
                            });
                        }
                        //check if chat is groupChat with empty msg list
                        else {
                            chatListData.push({
                                // Get some superficial chat data
                                title: chat.getChatName(),
                                chatId: chat.getId(),
                                timestamp: '',
                                previewUsername: '',
                                previewMessage: ''
                            });
                        }
                    }

                });
                this.#io.to(socket.id).emit('chatList', chatListData);
            });

            /* Gets the necessary information to display a chat and sends it to the client.
             * First checks if the participant is actually a member of the chat he wants to see.
             * If he is, gets the chat-object, gets it's message list and "copy-pastes" the 
             * relevant information into a new field, which is then send to the client.
             * - (E) */
            socket.on('getChatThread', (requesterId, chatID) => {

                var participant = this.#ppants.get(requesterId);
                //var participant = this.#ppants.get(socket.ppantId);
                console.log("CHAT THREAD PARTICIPANT: " + participant.getId());
                if (participant.isMemberOfChat(chatID)) {
                    // Load chat-data into chatData field
                    var chat = participant.getChat(chatID);
                    var messageInfoData = [];
                    // Maybe only the info of like the first 16 messages or so?
                    chat.getMessageList().forEach((message) => {
                        console.log("getChatThreadMessages: " + message.getMessageText());
                        messageInfoData.push({
                            senderUsername: message.getUsername(),
                            timestamp: message.getTimestamp(),
                            msgText: message.getMessageText()
                        });
                    });

                    if (chat instanceof OneToOneChat) {
                        let partnerId = chat.getOtherUserId(requesterId);

                        if (partnerId) {
                            var chatData = {
                                chatId: chat.getId(),
                                title: chat.getOtherUsername(participant.getBusinessCard().getUsername()),
                                areFriends: participant.hasFriend(partnerId),
                                friendRequestSent: participant.hasSentFriendRequest(partnerId),
                                partnerId: partnerId,
                                groupChat: false,
                                messages: messageInfoData
                            }
                            //partner left before
                        } else {
                            var chatData = {
                                chatId: chat.getId(),
                                title: chat.getOtherUsername(participant.getBusinessCard().getUsername()),
                                areFriends: true,
                                friendRequestSent: true,
                                partnerId: undefined,
                                groupChat: false,
                                messages: messageInfoData
                            }
                        }

                    } else {
                        var chatData = {
                            chatId: chat.getId(),
                            title: chat.getChatName(),
                            areFriends: true,
                            friendRequestSent: true,
                            partnerId: undefined,
                            groupChat: true,
                            messages: messageInfoData
                        }
                    }

                    //console.log(JSON.stringify(chatData));
                    this.#io.to(socket.id).emit('chatThread', chatData);
                }
            });

            /* Takes a new message in a chat and sends it to every member in that chat.
             * This can probably still be heavily optimized.
             * - (E) */

            socket.on('newChatMessage', (senderId, senderUsername, chatId, msgText) => {

                let sender = this.#ppants.get(senderId);
                //console.log('from server 1 ' + msgText);
                if (sender.isMemberOfChat(chatId)) {
                    //console.log('from server 2 ' + msgText);
                    //gets list of chat participants to which send the message to
                    let chatPartnerIDList = sender.getChat(chatId).getParticipantList();

                    //creates a new chat message and stores it into DB.
                    ChatService.createChatMessage(chatId, senderId, senderUsername, msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {

                        console.log("chatParticipantList: " + chatPartnerIDList);

                        chatPartnerIDList.forEach(chatParticipantID => {
                            let chatParticipant = this.#ppants.get(chatParticipantID);

                            //Checks if receiver of message is online
                            if (chatParticipant !== undefined) {

                                let chatParticipantChat = chatParticipant.getChat(chatId)
                                chatParticipantChat.addMessage(msg);
                            }
                        });

                        var msgToEmit = {
                            senderUsername: msg.getUsername(),
                            msgId: msg.getMessageId(),
                            senderId: msg.getSenderId(),
                            timestamp: msg.getTimestamp(),
                            msgText: msg.getMessageText()
                        };

                        // readded this line because it is required to distribute chat messages after joining the 1to1 chat 
                        this.#io.in(chatId).emit('newChatMessage', chatId, msgToEmit);
                        socket.broadcast.to(chatId).emit('gotNewChatMessage', msg.getUsername());
                    });
                }
            });

            socket.on('getChatParticipantList', (requesterId, chatId) => {
                let requester = this.#ppants.get(requesterId);

                if (requester.isMemberOfChat(chatId)) {
                    //console.log('from server 2 ' + msgText);
                    //gets list of chat participants to which send the message to
                    let chatPartnerIDList = requester.getChat(chatId).getParticipantList();

                    let chatParticipantList = [];

                    Promise.all(chatPartnerIDList.map(async chatPartnerID => {
                        const username = await ParticipantService.getUsername(chatPartnerID, Settings.CONFERENCE_ID, this.#db)
                        chatParticipantList.push(username);
                    })).then(res => {
                        this.#io.to(socket.id).emit('chatParticipantList', chatParticipantList);
                    })
                }
            })

            //adds a new Friend Request to the system
            socket.on('newFriendRequest', (requesterID, targetID, chatID) => {
                console.log(`Received friend request from ${requesterID} for ${targetID}.`);

                let target = this.#ppants.get(targetID);
                let requester = this.#ppants.get(requesterID);

                //check if target and requester are online
                if (target !== undefined && requester !== undefined) {
                    let targetBusCard = target.getBusinessCard();
                    let requesterBusCard = requester.getBusinessCard();

                    target.addFriendRequest(requesterBusCard);
                    requester.addSentFriendRequest(targetBusCard);

                    let requesterBusCardData = {
                        friendId: requesterBusCard.getParticipantId(),
                        username: requesterBusCard.getUsername(),
                        title: requesterBusCard.getTitle(),
                        surname: requesterBusCard.getSurname(),
                        forename: requesterBusCard.getForename(),
                        surname: requesterBusCard.getSurname(),
                        job: requesterBusCard.getJob(),
                        company: requesterBusCard.getCompany(),
                        email: requesterBusCard.getEmail()
                    }

                    this.#io.to(this.getSocketId(target.getId())).emit('newFriendRequestReceived', requesterBusCardData, chatID);

                    //target is offline
                } else if (target === undefined && requester !== undefined) {
                    //get BusCard from DB and add it to sent friend Request
                    ParticipantService.getBusinessCard(targetID, Settings.CONFERENCE_ID, this.#db).then(targetBusCard => {
                        requester.addSentFriendRequest(targetBusCard);
                    }).catch(err => {
                        console.error(err);
                    });

                    //requester goes instantly offline after he sent friend request
                    //extremly unlikely to happen but safer
                } else if (target !== undefined && requester === undefined) {
                    //get BusCard from DB and add it to sent friend Request
                    ParticipantService.getBusinessCard(requesterID, Settings.CONFERENCE_ID, this.#db).then(requesterBusCard => {
                        target.addFriendRequest(requesterBusCard);

                        let requesterBusCardData = {
                            friendId: requesterBusCard.getParticipantId(),
                            username: requesterBusCard.getUsername(),
                            title: requesterBusCard.getTitle(),
                            surname: requesterBusCard.getSurname(),
                            forename: requesterBusCard.getForename(),
                            surname: requesterBusCard.getSurname(),
                            job: requesterBusCard.getJob(),
                            company: requesterBusCard.getCompany(),
                            email: requesterBusCard.getEmail()
                        }

                        this.#io.to(this.getSocketId(target.getId())).emit('newFriendRequestReceived', requesterBusCardData, chatID);
                    }).catch(err => {
                        console.error(err);
                    });
                }

                //update DB
                FriendRequestListService.storeReceivedFriendRequest(targetID, requesterID, Settings.CONFERENCE_ID, this.#db);
                FriendRequestListService.storeSentFriendRequest(requesterID, targetID, Settings.CONFERENCE_ID, this.#db);
            });

            //handles a friendrequest, either accepted or declined
            socket.on('handleFriendRequest', (targetID, requesterID, acceptRequest) => {
                let target = this.#ppants.get(targetID);
                let requester = this.#ppants.get(requesterID);

                if (acceptRequest) {

                    //check if target is online
                    if (target !== undefined) {
                        target.acceptFriendRequest(requesterID);
                    }
                    //check if requester is online
                    if (requester !== undefined) {
                        requester.sentFriendRequestAccepted(targetID);

                        let targetBusCard = target.getBusinessCard();
                        let targetBusCardData = {
                            friendId: targetBusCard.getParticipantId(),
                            username: targetBusCard.getUsername(),
                            title: targetBusCard.getTitle(),
                            surname: targetBusCard.getSurname(),
                            forename: targetBusCard.getForename(),
                            surname: targetBusCard.getSurname(),
                            job: targetBusCard.getJob(),
                            company: targetBusCard.getCompany(),
                            email: targetBusCard.getEmail()
                        }

                        ChatService.existsOneToOneChat(targetID, requesterID, Settings.CONFERENCE_ID, this.#db).then(chat => {
                            this.#io.to(this.getSocketId(requester.getId())).emit('acceptedFriendRequest', targetBusCardData, chat.chatId);
                        })

                    }

                    //update DB
                    FriendListService.storeFriend(targetID, requesterID, Settings.CONFERENCE_ID, this.#db).then(res => {
                        FriendListService.storeFriend(requesterID, targetID, Settings.CONFERENCE_ID, this.#db).then(res => {
                            this.applyTaskAndAchievement(targetID, TypeOfTask.BEFRIENDOTHER);
                            this.applyTaskAndAchievement(requesterID, TypeOfTask.BEFRIENDOTHER);
                        })
                    })

                } else {
                    //check if target is online
                    if (target !== undefined) {
                        target.declineFriendRequest(requesterID);
                    }
                    //check if requester is online
                    if (requester !== undefined) {
                        requester.sentFriendRequestDeclined(targetID);

                        ChatService.existsOneToOneChat(targetID, requesterID, Settings.CONFERENCE_ID, this.#db).then(chat => {
                            this.#io.to(this.getSocketId(requester.getId())).emit('rejectedFriendRequest', chat.chatId);
                        })
                    }
                }

                //update DB
                FriendRequestListService.removeReceivedFriendRequest(targetID, requesterID, Settings.CONFERENCE_ID, this.#db);
                FriendRequestListService.removeSentFriendRequest(requesterID, targetID, Settings.CONFERENCE_ID, this.#db);

                //Not sure if a answer from server is necessary
            });

            //handles removing a friend in both friend lists
            socket.on('removeFriend', (removerID, removedFriendID) => {
                let remover = this.#ppants.get(removerID);
                let removedFriend = this.#ppants.get(removedFriendID);

                //if remover is still online, remove friend from ppant instance
                if (remover !== undefined) {
                    remover.removeFriend(removedFriendID);
                }

                //if removed friend is online, remove friend from ppant instance
                if (removedFriend !== undefined) {
                    removedFriend.removeFriend(removerID);

                    ChatService.existsOneToOneChat(removerID, removedFriendID, Settings.CONFERENCE_ID, this.#db).then(chat => {
                        this.#io.to(this.getSocketId(removedFriend.getId())).emit('removedFriend', removerID, chat.chatId);
                    })
                }

                //update DB
                FriendListService.removeFriend(removerID, removedFriendID, Settings.CONFERENCE_ID, this.#db);
                FriendListService.removeFriend(removedFriendID, removerID, Settings.CONFERENCE_ID, this.#db);
            });



            socket.on('removeParticipantFromChat', (removerId, chatId) => {
                let remover = this.#ppants.get(removerId);
                let removerUsername = remover.getBusinessCard().getUsername();


                if (remover !== undefined && remover.isMemberOfChat(chatId)) {
                    //console.log('from server 2 ' + msgText);

                    //BEWARE: Do not change/manipulate the chatPartnerIDList of remover, because it is referenced here and
                    //any change will affect the code above.
                    //gets list of chat participants for removing participant in their chat.
                    let chatPartnerIDList = remover.getChat(chatId).getParticipantList();
                    console.log("before " + chatPartnerIDList);

                    let msgText = removerUsername + " has left the chat";

                    ChatService.createChatMessage(chatId, '', '', msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {
                        chatPartnerIDList.forEach(chatPartnerID => {
                            let chatPartner = this.#ppants.get(chatPartnerID);

                            //Checks if receiver of message is online
                            if (chatPartnerID !== removerId && chatPartner !== undefined) {

                                let chatPartnerChat = chatPartner.getChat(chatId);
                                chatPartnerChat.removeParticipant(removerId);
                                console.log("chatpartner " + chatPartnerChat.getParticipantList());
                                chatPartnerChat.addMessage(msg);
                            }
                        })

                        var msgToEmit = {
                            senderUsername: msg.getUsername(),
                            msgId: msg.getMessageId(),
                            senderId: msg.getSenderId(),
                            timestamp: msg.getTimestamp(),
                            msgText: msg.getMessageText()
                        };

                        // readded this line because it is required to distribute chat messages after leaving chat
                        this.#io.in(chatId).emit('newChatMessage', chatId, msgToEmit);
                    })

                    remover.removeChat(chatId);
                    console.log("after " + remover.getChatList());
                    socket.leave(chatId);
                }

                ChatService.removeParticipant(chatId, removerId, Settings.CONFERENCE_ID, this.#db);
            });



            socket.on('getNPCStory', (ppantID, npcID) => {
                //let npcService = new NPCService();
                let currentRoomId = this.#ppants.get(ppantID).getPosition().getRoomId();
                let npc = this.#rooms[currentRoomId - 1].getRoom().getNPC(npcID);
                //let npc = npcService.getNPC(npcID);
                let name = npc.getName();
                let story = npc.getStory();
                if (name === "BasicTutorial") {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.BASICTUTORIALCLICK);
                } else if (name === "Chef") {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.CHEFCLICK);
                } else if (name === "FoyerHelper") {
                    this.applyTaskAndAchievement(ppantID, TypeOfTask.FOYERHELPERCLICK);
                }

                socket.emit('showNPCStory', name, story);
            });

            // This will need a complete rewrite once the server-side models are properly implemented
            // as of now, this is completely broken
            socket.on('disconnect', (reason) => {
                //Prevents server crash because client sends sometimes disconnect" event on connection to server.
                if (!this.#ppantControllers.has(socket.id)) {
                    console.log("disconnect");
                    return;
                }

                /* This still needs error-Handling for when no such ppantCont exists - (E) */
                var ppantID = this.#ppantControllers.get(socket.id).getParticipant().getId();

                var currentRoomId = this.#ppants.get(ppantID).getPosition().getRoomId();
                // gameRoomController.removeParticipantController(this.#ppantControllers.get(socket.id);
                // The next line can probably be just handled inside the previous one
                //io.sockets.emit('remove player', ppantID);
                console.log(ppantID);
                socket.to(currentRoomId.toString()).emit('remove player', ppantID);
                console.log('Participant with Participant_ID: ' + ppantID + ' has disconnected from the game . . .');

                //write position and direction from disconnecting participant in DB
                let pos = this.#ppants.get(ppantID).getPosition();
                let direction = this.#ppants.get(ppantID).getDirection();
                ParticipantService.updateParticipantPosition(ppantID, Settings.CONFERENCE_ID, pos, this.#db);
                ParticipantService.updateParticipantDirection(ppantID, Settings.CONFERENCE_ID, direction, this.#db);

                //remove participant from room
                this.#rooms[currentRoomId - 1].getRoom().exitParticipant(ppantID);

                console.log("delete participant from ppantController: " + socket.id);
                this.#ppantControllers.delete(socket.id);
                this.#ppants.delete(ppantID);

                if (socket.currentLecture) {
                    var schedule = this.#conference.getSchedule();
                    var lectureId = socket.currentLecture;
                    var lecture = schedule.getLecture(lectureId);
                    lecture.leave(ppantID);
                    console.log(ppantID + " leaves " + lectureId)
                    socket.leave(lectureId);
                    socket.currentLecture = undefined;
                }

                // Destroy ppant and his controller
            });

            //Allows debugging the server. 
            //BEWARE: In debug mode everything can be manipulated so the server can crash easily.
            socket.on('evalServer', (data) => {
                if (!this.#DEBUGMODE)
                    return;

                try {
                    var res = eval(data);
                } catch (e) {
                    console.log("Eval Error: Can't find " + data + " in code.");
                    return;
                }
                socket.emit('evalAnswer', res);
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


    // TODO
    // - Switch all the commands from using ids to using usernames
    commandHandler(moderator, input) {
        /* commands need to be delimited by a space. So we first split
         * the input at each occurence of a whitespace character.
         * - (E) */
        var commandArgs = input.split(" ");

        /* Now we extract the command from the input.
         * 
         * The command can only occur at the very beginning of an input, so
         * we just take the substring of the input up to (but obviously not
         * including) the first whitespace-character.
         *
         * We also covert the string to lower case, so that we can easily compare
         * it to our constants. This means that the moderator does not need to
         * worry about capitalization when inputting a command, which may be
         * undesirable behaviour.
         *
         * - (E) */
        var command = commandArgs[0].toLowerCase();

        /* Every command is saved in an enum-File similiar to the directions.
         * So we can use the TypeChecker-class to check if the input includes
         * a legal command.
         * - (E) */
        /*
        try {
            Typechecker.isEnumOf(command, Commands);
        } catch (TypeError) {
            // TODO: tell mod this is not a recognized command
            return;
        }
        */

        /* So now we check which command the user actually entered.
         * I would like to just iterate over every command via a 
         * "for ... in ..."-loop, but I'm not sure how to do handling
         * in this case (short of adding the handling as a property of
         * the command itself). So we just have to use a switch-statement.
         *
         * Tbh, I do somewhat detest this solution. 
         * Of course, using this does also make the previous use of the
         * TypeChecker coompletely redundant.
         *
         * This does also, for now, not including every command.
         *
         * A better solution would be to turn the commands into objects
         * that contain their own handling. Then we could just iterate
         * over every command and have them call their own handling.
         * This would also make adding new commands a lot easier I think.
         *
         *  - (E) */
        switch (command) {
            case Commands.GLOBAL:
                // Allows to send a global message

                /* We get the message that the moderator wanted to send by just
                 * looking for the first occurence of a whitespace-character,
                 * which should occur after the command.
                 * Everything inputted after the command is treated as the message
                 * the moderator wanted to send.
                 *
                 * if the commandArgs-array has a lengt of one, no text occurs after
                 * the command, and we do not need any handling.
                 *
                 * - (E) */
                if (commandArgs.length > 1) {
                    var currentDate = new Date();
                    var message = {
                        timestamp: currentDate,
                        text: input.substr(input.indexOf(" "))
                    }

                    /* Sending the global message to all the users.
                     * Furthermore, we might alter the handling to not send
                     * any global messages to any other moderators.
                     *
                     * - (E) */
                    this.#io.emit('New global announcement', moderator.getBusinessCard().getUsername(), message); // This might be altered to not
                    // include moderators
                }
                break;
            case Commands.LOGMESSAGES:
                /* Display msgIDs and the senderIDs of the messages to mod.
                 * This can be used to identify the senderIDs of messages send into the allchat,
                 * so that the moderator can remove the right user from a conference.
                 * - (E) */
                var room = this.#rooms[moderator.getPosition().getRoomId() - 1];
                var messageHeader = "List of messages posted in " + room.getRoom().getTypeOfRoom();
                var messageBody = [];
                var msg = room.getRoom().getMessages();
                for (var i = 0; i < msg.length; i++) {
                    messageBody.splice(0, 0, "[" + msg[i].timestamp + "] (senderId: " + msg[i].senderID +
                        ") has messageId: " + msg[i].messageID);
                }
                this.#io.to(this.getSocketId(moderator.getId())).emit('New global message', messageHeader, messageBody);
                break;
            case Commands.HELP:
                // TODO: maybe move all these strings into a util-file?
                var messageHeader = "List of Commands."
                var messageBody = ["\\global <message>  --  Post a message into the global chat. " +
                    "It will display in every participants game-view as a pop-up.",
                    "\\help  --  This command. Displays a list of all commands and how to use them.",
                "\\log --  Will show a log of all messages send into the allchat of the room you're " +
                "currently in, including the messageID and senderID of each message.",
                "\\rmuser <list of participantIDs>  -- Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and removes all of them from " +
                "the conference. They will not be able to reenter the conference.\n WARNING: It is " +
                "not yet possible to unban a banned user!",
                "\\rmmsg <list of msgIDs  -- Takes a list of messageIDs, each one separated from the next " +
                "one by a whitespace character, and removes the corresponding messages - " +
                "if they exist - from the allchat of the room you're currently in. Will also send a warning to " +
                "the senders of the messages, reminding them to follow chat etiquette.",
                "\\rmallby <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and removes all messages posted " +
                "by them into the allchat of the room you're currently in. Will also send a warning " +
                "to these participants, reminding them to follow chat-etiquette.",
                "\\mute <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and mutes them, meaning they " +
                "will no longer be able to post messages into the allchat.",
                "\\unmute <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                "seperated from the next by a whitespace-character, and unmutes them, meaning they " +
                "will be able to post messages into the allchat again if they were previously muted."];
                this.#io.to(this.getSocketId(moderator.getId())).emit('New global message', messageHeader, messageBody);
                break;
            case Commands.REMOVEPLAYER:
                // removes player(s) from conference
                // Maybe instead of being able to remove several players be able
                // to remove just one and give them a ban message instead?

                //TODO have this take something else instead of participant-IDs

                /* This will assume that each argument supplied with the \rmuser-command
                 * is a valid participantID, each one separated from the next by a whitespace.
                 * It will perform the removal.
                 */
                for (var i = 1; i < commandArgs.length; i++) {

                    var ppantID = commandArgs[i];


                    /* First, it gets the socket object corresponding to player that
                     * is supposed to be removed from the game. 
                     * - (E) */
                    var id = this.getSocketId(ppantID); // get the Id of the socket belonging to the 
                    // participant that is to be removed

                    if (id != undefined) {
                        var socket = this.getSocketObject(id); // get the actual socket object

                        /* Tells the clientController to remove itself from the game
                         * (meaning to return to the homepage). Since the handling of
                         * this can be altered client-side, we also need to remove the socket
                         * from all the rooms (see below).
                         * - (E) */
                        this.#io.to(id).emit('remove yourself');
                        this.#banList.push(socket.request.session.accountId);

                        /* Get all the socketIO-rooms the socket belonging to the participant that
                         * is to be removed is currently in and remove the socket from all those rooms
                         * - (E) */
                        var roomsToRemoveFrom = Object.keys(socket.rooms);
                        console.log(roomsToRemoveFrom);
                        for (var i = 0; i < roomsToRemoveFrom.length; i++) {
                            var room = roomsToRemoveFrom[i];
                            socket.leave(room);
                            console.log(room);
                            this.#io.in(room).emit("remove player", ppantID);
                        }

                        console.log('Participant with Participant_ID: ' + ppantID + ' was removed from the game . . .');

                        /* We do for now not delete the socket from the ppantControllers-list,
                         * as I want to see if this will keep the user from reentering the game.
                         * UPDATE: IT DOES NOT.
                         * Also, we can not remove the participant from the ppant-List, as the
                         * ppant-List is not known at this part of the program.
                         * - (E) */
                        //this.ppantControllers.delete(socket.id);
                        //ppants.delete(ppantID);
                    }

                    console.log('Participant with Participant_ID: ' + ppantID + ' was removed from the game . . .');

                    /* We do for now not delete the socket from the #ppantControllers-list,
                     * as I want to see if this will keep the user from reentering the game.
                     * UPDATE: IT DOES NOT.
                     * Also, we can not remove the participant from the ppant-List, as the
                     * ppant-List is not known at this part of the program.
                     * - (E) */
                    //this.#ppantControllers.delete(socket.id);
                    //this.#ppants.delete(ppantID); 
                }
                break;
            case Commands.REMOVEMESSAGE:
                var messagesToDelete = commandArgs.slice(1);
                var roomID = moderator.getPosition().getRoomId();
                var msg = this.#rooms[roomID - 1].getRoom().getMessages();
                for (var i = 0; i < msg.length; i++) {
                    if (messagesToDelete.includes(msg[i].messageID.toString())) {
                        this.sendWarning(this.getSocketId(msg[i].senderID));
                        msg.splice(i, 1);
                        i--; // This is important, as without it, we could not remove
                        // two subsequent messages
                    }
                }
                this.#io.in(roomID.toString()).emit('initAllchat', msg);
                break;
            case Commands.REMOVEMESSAGESBYPLAYER:
                var roomID = moderator.getPosition().getRoomId();
                var msg = this.#rooms[roomID - 1].getRoom().getMessages();
                var newMsg = msg;
                for (var i = 0; i < msg.length; i++) {
                    if (commandArgs.includes(msg[i].senderID.toString())) {
                        this.sendWarning(this.getSocketId(msg[i].senderID));
                        msg.splice(i, 1);
                        i--; // This is important, as without it, we could not remove
                        // two subsequent messages
                    }
                }
                this.#io.in(roomID.toString()).emit('initAllchat', msg);
                break;
            case Commands.MUTE:
                for (var i = 1; i < commandArgs.length; i++) {
                    var socket = this.getSocketObject(this.getSocketId(commandArgs[i]));
                    if (socket != undefined && !this.#muteList.includes(accountId)) {
                        this.#muteList.push(socket.request.session.accountId);
                        this.sendMute(socket.id);
                    }
                }
                var socket = this.get
                break;
            case Commands.UNMUTE:
                for (var i = 1; i < commandArgs.length; i++) {
                    var socket = this.getSocketObject(this.getSocketId(commandArgs[i]));
                    var accountId = socket.request.session.accountId;
                    if (socket != undefined && this.#muteList.includes(accountId)) {
                        this.#muteList.splice(this.#muteList.indexOf(accountId), 1);
                        this.sendUnmute(socket.id);
                    }
                }
                break;
            default:
                var messageHeader = "Unrecognized command."
                var messageText = "You entered an unrecognized command. Enter '\\help' to receive an overview of all commands and how to use them."
                this.#io.to(this.getSocketId(moderator.getId())).emit('New global message', messageHeader, messageText);
                break;
        }
    };

    commandHandlerLecture(socket, lecture, input) {
        // TODO
        // TO IMPLEMENT
        // - revoke user token
        // - grant user token

        /* commands need to be delimited by a space. So we first split
         * the input at each occurence of a whitespace character.
         * - (E) */
        var commandArgs = input.split(" ");

        /* Get the chat of the lecture we're currently in for message operations */
        var lectureChat = lecture.getLectureChat().getMessages();

        /* Now we extract the command from the input.
         * 
         * The command can only occur at the very beginning of an input, so
         * we just take the substring of the input up to (but obviously not
         * including) the first whitespace-character.
         *
         * We also covert the string to lower case, so that we can easily compare
         * it to our constants. This means that the moderator does not need to
         * worry about capitalization when inputting a command, which may be
         * undesirable behaviour.
         *
         * - (E) */
        var command = commandArgs[0].toLowerCase();

        switch (command) {
            case Commands.REMOVEMESSAGE:
                for (var i = 0; i < lectureChat.length; i++) {
                    if (commandArgs.includes(lectureChat[i].messageID.toString())) {
                        this.sendWarning(this.getSocketId(lectureChat[i].senderID));
                        lectureChat.splice(i, 1);
                        i--; // This is important, as without it, we could not remove
                        // two subsequent messages
                    }
                }
                this.#io.in(socket.currentLecture).emit('updateLectureChat', lectureChat);
                break;
            case Commands.REMOVEMESSAGESBYPLAYER:
                for (var i = 0; i < lectureChat.length; i++) {
                    if (commandArgs.includes(lectureChat[i].senderID.toString())) {
                        this.sendWarning(this.getSocketId(lectureChat[i].senderID));
                        lectureChat.splice(i, 1);
                        i--; // This is important, as without it, we could not remove
                        // two subsequent messages
                    }
                }
                this.#io.in(socket.currentLecture).emit('updateLectureChat', lectureChat);
                break;
            case Commands.REMOVEPLAYER:
                for (var i = 1; i < commandArgs.length; i++) {
                    var ppantId = commandArgs[i];
                    if (lecture.hasPPant(ppantId)) {
                        var socketClient = this.getSocketObject(this.getSocketId(ppantId));
                        lecture.leave(ppantId);
                        lecture.revokeToken(ppantId);
                        lecture.ban(socket.request.session.accountId);
                        socketClient.leave(socketClient.currentLecture);
                        socketClient.currentLecture = undefined;
                        socketClient.broadcast.emit('showAvatar', ppantId);
                        this.#io.to(socketClient.id).emit('force close lecture');
                        this.sendRemoval(socketClient.id);
                    }
                }
                break;
            case Commands.REVOKETOKEN:
                for (var i = 1; i < commandArgs.length; i++) {
                    lecture.revokeToken(commandArgs[i]);
                    var socketid = this.getSocketId(commandArgs[i]);
                    this.sendRevoke(socketid);
                    this.#io.to(socketid).emit('update token', false);
                }
                break;
            case Commands.GRANTTOKEN:
                for (var i = 1; i < commandArgs.length; i++) {
                    lecture.grantToken(commandArgs[i]);
                    var socketid = this.getSocketId(commandArgs[i]);
                    this.sendGrant(socketid);
                    this.#io.to(socketid).emit('update token', true);
                }
                break;
            case Commands.HELP:
                var messageHeader = "List of Commands."
                var messageBody = ["\\help  --  This command. Displays a list of all commands and how to use them.",
                    "\\log --  Will show a log of all messages send into the lecture chat" +
                    ", including the messageID and senderID of each message.",
                    "\\rmuser <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and removes all of them from " +
                    "the lecture. They will not be able to reenter the lecture.\n WARNING: It is " +
                    "not yet possible to revert this!",
                    "\\rmmsg <list of msgIDs  --  Takes a list of messageIDs, each one seperated from the " +
                    "next one by a whitespace character, and removes the corresponding messages - " +
                    "if they exist - from the lecture chat. Will also send a warning to " +
                    "the senders of the messages, reminding them to follow chat etiquette.",
                    "\\rmallby <list of participantIDs>  --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and removes all messages posted " +
                    "by them into the lecture chat. Will also send a warning " +
                    "to these participants, reminding them to follow chat-etiquette.",
                    "\\revoke <list of participantIDs> --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and revokes their lecture tokens " +
                    "(if they own one). They will no longer be able to post messages into the lecture chat.",
                    "\\grant <list of participantIDs> --  Takes a list of participantIDs, each one " +
                    "seperated from the next by a whitespace-character, and grants them lecture tokens " +
                    "(if they are currently listening to the lecture and do not own one). They will " +
                    "be able to post messages into the lecture chat.",
                    "\\close -- Closes the lecture and makes it inaccessible. Every current participant " +
                    "will be forcefully ejected and nobody will be able to rejoin the lecture. " +
                    "WARNING: this command can NOT be reversed."];
                this.#io.to(socket.id).emit('New global message', messageHeader, messageBody);
                break;
            case Commands.LOGMESSAGES:
                var messageHeader = "List of messages posted in " + lecture.getTitle();
                var messageBody = [];
                for (var i = 0; i < lectureChat.length; i++) {
                    messageBody.splice(0, 0, "[" + lectureChat[i].timestamp + "] (senderId: " + lectureChat[i].senderID +
                        ") has messageId: " + lectureChat[i].messageID);
                }
                this.#io.to(socket.id).emit('New global message', messageHeader, messageBody);
                break;
            case Commands.CLOSE:
                var ppantsInLecture = lecture.getActiveParticipants();
                lecture.hide();
                this.#io.in(socket.currentLecture).emit('force close lecture');
                ppantsInLecture.forEach((ppantId) => {
                    // Get the necessary data to use the socket-connection
                    var socketClient = this.getSocketObject(this.getSocketId(ppantId));
                    lecture.leave(ppantId);
                    lecture.revokeToken(ppantId);
                    socketClient.leave(socketClient.currentLecture);
                    socketClient.currentLecture = undefined;
                    socketClient.broadcast.emit('showAvatar', ppantId);
                    this.sendClosed(socketClient.id);
                });
            default:
                var messageHeader = "Unrecognized command."
                var messageText = "You entered an unrecognized command. Enter '\\help' to receive an overview of all commands and how to use them."
                this.#io.to(socket.id).emit('New global message', messageHeader, messageText);
                break;
        }

    };

    getSocketId(ppantID) {
        /* So this is functional using this helping variable, but I will need to redo it in pretty.
         * The problem is that, since the forEach()-method takes a function as a callback-parameter,
         * when we call "return socketId;" inside of the if-statement, we only return it to the
         * method calling the function containing the if-statement, which is the forEach()-method.
         * This means that the return-value doesn't actually reach the commandHandler the way it is
         * supposed to. Instead, the getSocketId()-method returns an undefined value.
         * Returning the help-variable instead fixes the issue (for now), but it is not a pretty
         * solution.
         * - (E) */
        var id;
        this.#ppantControllers.forEach((ppantCont, socketId) => {
            if (ppantCont.getParticipant().getId() == ppantID) {
                id = socketId;
            }
        });
        return id;
    };

    // The following methods should probably be private

    getSocketObject(socketId) {
        var mainNamespace = this.#io.of('/');
        var socketKeys = Object.keys(mainNamespace.connected);
        for (var i = 0; i < socketKeys.length; i++) {
            if (socketKeys[i] == socketId) {
                console.log("server socket object: " + mainNamespace.connected[socketKeys[i]]);
                return mainNamespace.connected[socketKeys[i]];
            }
        }
    };

    getIdOf(username) {
        /* Gets the participantId belonging to a username.
         * Since double-log-ins are still possible atm, this will only return
         * the id of last logged-in participant of a user.
         * - (E) */
        var id;
        this.#ppantControllers.forEach((ppantCont, socketId) => {
            if (ppantCont.getParticipant().getBusinessCard().getUsername() == username) {
                id = ppantCont.getParticipant().getId();
            }
        });
        return id;
    };

    /* Sends a warning to the user who is connected to the socket with the passed Id.
     * If the id is undefined, this will do nothing.
     * - (E) */
    // TODO: merge all these into a single function
    sendWarning(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.WARNING.header, Messages.WARNING.body);
        }
    };

    sendRemoval(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.REMOVAL.header, Messages.REMOVAL.body);
        }
    };

    sendRevoke(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.REVOKE.header, Messages.REVOKE.body);
        }
    };

    sendGrant(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.GRANT.header, Messages.GRANT.body);
        }
    };

    sendMute(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.MUTE.header, Messages.MUTE.body);
        }
    };

    sendUnmute(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.UNMUTE.header, Messages.UNMUTE.body);
        }
    };

    sendClosed(socketid) {
        if (socketid != undefined) {
            this.#io.to(socketid).emit("New global message", Messages.CLOSED.header, Messages.CLOSED.body);
        }
    };

    isBanned(accountId) {
        if (this.#banList.includes(accountId)) {
            return true;
        };
        return false;
    };

    /* Can't actually be used yet, as it requires accountIds as arguments,
     * but nothing (no user or method) knows enough to properly use this.
     * - (E) */
    unban(accountId) {
        if (this.#banList.includes(accountId)) {
            this.#banList.splice(this.#banList.indexOf(accountId), 1);
        };
    };

    // require to handle the entire logic of applying achievements and points as well as sending updates to the client
    async applyTaskAndAchievement(participantId, taskType) {
        var participant = this.#ppants.get(participantId);

        var task = new TaskService().getTaskByType(taskType)

        if (participant) {
            participant.addTask(task);

            ParticipantService.updateTaskCounts(participantId, Settings.CONFERENCE_ID, participant.getTaskTypeMappingCounts(), this.#db);

            // computes achievements, updates participants, and returns newly unlocked achievements
            var newAchievements = new AchievementService().computeAchievements(participant);

            newAchievements.forEach(ach => {
                var achData = {
                    currentLevel: ach.getCurrentLevel(),
                    color: ach.getColor(),
                    icon: ach.getIcon(),
                    title: ach.getTitle(),
                    description: ach.getDescription()
                }

                this.#io.to(this.getSocketId(participantId)).emit('newAchievement', achData);

                ParticipantService.updateAchievementLevel(participantId, Settings.CONFERENCE_ID, ach.getId(), ach.getCurrentLevel(), this.#db);
            });

            ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, participant.getAwardPoints(), this.#db).then(res => {
                RankListService.getRank(participantId, Settings.CONFERENCE_ID, this.#db).then(rank => {
                    this.#io.to(this.getSocketId(participantId)).emit('updateSuccessesBar', participant.getAwardPoints(), rank);
                })

                Promise.all([...this.#ppants.keys()].map(async ppantId => {
                    RankListService.getRank(ppantId, Settings.CONFERENCE_ID, this.#db).then(rank => {
                        this.#io.to(this.getSocketId(ppantId)).emit('updateSuccessesBar', undefined, rank);
                    });
                }))
            });
        } else {
            ParticipantService.getPoints(participantId, Settings.CONFERENCE_ID, this.#db).then(points => {
                var awardPoints = task.getAwardPoints();
                var currentPoints = points + awardPoints;
                ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, currentPoints, this.#db);

                ParticipantService.getTaskCount(participantId, Settings.CONFERENCE_ID, taskType, this.#db).then(count => {
                    var newTaskCount = count + 1;
                    ParticipantService.updateTaskCount(participantId, Settings.CONFERENCE_ID, taskType, newTaskCount, this.#db)

                    var achievementDefinition = new AchievementService().getAchievementDefinitionByTypeOfTask(taskType);
                    var levels = achievementDefinition.getLevels();

                    var counter = 0;
                    Promise.all(levels.map(async level => {
                        var levelsCount = level.count;
                        var awardPoints = level.points;

                        if (levelsCount <= newTaskCount) {
                            var achievements = await ParticipantService.getAchievements(participantId, Settings.CONFERENCE_ID, this.#db);
                            var currentLevel;
                            achievements.forEach(achievement => {
                                if (achievement.id == achievementDefinition.getId()) {
                                    currentLevel = achievement.currentLevel;
                                }
                            })
                            counter++;
                            if (currentLevel < counter) {
                                ParticipantService.updateAchievementLevel(participantId, Settings.CONFERENCE_ID, achievementDefinition.getId(), counter, this.#db);
                                currentPoints += awardPoints;
                                ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, currentPoints, this.#db).then(res => {
                                    Promise.all([...this.#ppants.keys()].map(async ppantId => {
                                        RankListService.getRank(ppantId, Settings.CONFERENCE_ID, this.#db).then(rank => {
                                            this.#io.to(this.getSocketId(ppantId)).emit('updateSuccessesBar', undefined, rank);
                                        });
                                    }))
                                })
                            }
                        }
                    }))
                })
            })
        }
    }
}
