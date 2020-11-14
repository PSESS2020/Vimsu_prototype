const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const RoomService = require('../services/RoomService.js');
const Settings = require('../utils/Settings.js');
const CommandHandler = require('../models/CommandHandler.js');
const AllchatContext = require('../models/AllchatContext.js');
const LectureContext = require('../models/LectureContext.js');
const LectureService = require('../services/LectureService');
const Schedule = require('../models/Schedule')
const RankListService = require('../services/RankListService')
const Account = require('../../../../website/models/Account.js');
const TypeOfTask = require('../utils/TypeOfTask.js')
const Messages = require('../utils/Messages.js');
const Conference = require('../models/Conference.js');
const ChatService = require('../services/ChatService.js');
const ParticipantService = require('../services/ParticipantService.js');
const AchievementService = require('../services/AchievementService.js');
const TaskService = require('../services/TaskService.js');
const FriendListService = require('../services/FriendListService.js');
const FriendRequestListService = require('../services/FriendRequestListService.js');
const OneToOneChat = require('../models/OneToOneChat.js');
const GroupChat = require('../models/GroupChat');
const dbClient = require('../../../../config/db');
const blobClient = require('../../../../config/blob');
const TypeChecker = require('../../client/shared/TypeChecker');
const TypeOfDoor = require('../../client/shared/TypeOfDoor.js');

/**
 * The Server Controller
 * @module ServerController
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class ServerController {

    #io;
    #db;
    #blob;
    #conference;
    #DEBUGMODE;
    #banList;
    #muteList;
    #rooms;
    #roomService;
    #interval;
    #currentLecturesData;

    //map from socket-id to ppant-id
    #socketMap;

    //map from ppant-id to ppant-instance
    #ppants;

    /**
     * Creates an instance of ServerController
     * @constructor module:ServerController
     * 
     * @param {SocketIO} socket socket instance
     * @param {dbClient} db db instance
     * @param {blobClient} blob blob instance
     */
    constructor(socket, db, blob) {
        if (!!ServerController.instance) {
            return ServerController.instance;
        }

        ServerController.instance = this;

        TypeChecker.isInstanceOf(db, dbClient);
        TypeChecker.isInstanceOf(blob, blobClient);

        this.#io = socket;
        this.#db = db;
        this.#blob = blob;

        //Should be turned off if the product gets released.
        this.#DEBUGMODE = false;

        this.#socketMap = new Map();

        //Init all rooms
        this.#roomService = new RoomService();

        //Array to hold all Rooms
        this.#rooms = this.#roomService.getAllRooms();

        this.#banList = [];
        this.#muteList = [];

        // Array to hold all participants
        this.#ppants = new Map();

        this.#init();
    }

    /**
     * @private initializes all socket events from client
     * 
     * @method module:ServerController#init
     */
    #init = function () {

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
             * unless we're just doing regular game-state updates. */
            socket.on('new participant', () => {

                /* If we already have a ppant connected on this socket, we do nothing */
                if (this.#socketMap.has(socket.id) || !socket.request.session.loggedin) {
                    return;
                }

                var accountId = socket.request.session.accountId;
                if (this.#isBanned(accountId)) {
                    this.#io.to(socket.id).emit('remove yourself');
                    return;
                }

                console.log('Participant ' + socket.id + ' has connected to the game . . . ');

                //variables for creating account instance
                let username = socket.request.session.username;
                let title = socket.request.session.title;
                let surname = socket.request.session.surname;
                let forename = socket.request.session.forename;
                let job = socket.request.session.job;
                let company = socket.request.session.company;
                let email = socket.request.session.email;

                let account = new Account(accountId, username, title, surname, forename, job, company, email);

                //create Participant
                ParticipantService.createParticipant(account, Settings.CONFERENCE_ID, this.#db).then(ppant => {

                    //Don't allow user to join the conference more than once with the same account
                    // if (this.#ppants.has(ppant.getId())) {
                    //     console.log("Participant already joined the conference");
                    //     this.#io.to(socket.id).emit('gameEntered');
                    //     return;
                    // }

                    let currentRoomId = ppant.getPosition().getRoomId();
                    let currentRoom = this.#rooms[currentRoomId - 1].getRoom();

                    let typeOfCurrentRoom;
                    for (var i = 0, n = this.#rooms.length; i < n; i++) {
                        if (this.#rooms[i].getRoom().getRoomId() === currentRoomId) {
                            typeOfCurrentRoom = this.#rooms[i].getRoom().getTypeOfRoom();
                            break;
                        }
                    }

                    socket.ppantID = ppant.getId();

                    //Join Room Channel
                    socket.join(currentRoomId.toString());

                    //Join All Chat Channels
                    ppant.getChatList().forEach(chat => {
                        socket.join(chat.getId());
                    });

                    //Sets ppant in the right room
                    currentRoom.enterParticipant(ppant);

                    //Adds ppant data to maps
                    this.#socketMap.set(socket.id, ppant.getId());
                    this.#ppants.set(ppant.getId(), ppant);

                    //Gets asset paths of the starting room
                    let assetPaths = this.#rooms[currentRoomId - 1].getAssetPaths();

                    //Gets MapElements of the starting room
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
                            isClickable: mapElement.getClickable()
                        });
                    });

                    //Get GameObjects of the starting room
                    let gameObjects = currentRoom.getListOfGameObjects();
                    let gameObjectData = [];

                    //Sends all gameObjects of starting room to client
                    gameObjects.forEach(gameObject => {
                        gameObjectData.push({
                            id: gameObject.getId(),
                            type: gameObject.getGameObjectType(),
                            name: gameObject.getName(),
                            width: gameObject.getWidth(),
                            length: gameObject.getLength(),
                            cordX: gameObject.getPosition().getCordX(),
                            cordY: gameObject.getPosition().getCordY(),
                            isClickable: gameObject.getClickable()
                        });
                    });

                    //Get all NPCs from starting room
                    let npcs = currentRoom.getListOfNPCs();
                    let npcData = [];

                    //Sends all NPCs to client
                    npcs.forEach(npc => {
                        npcData.push({
                            id: npc.getId(),
                            name: npc.getName(),
                            cordX: npc.getPosition().getCordX(),
                            cordY: npc.getPosition().getCordY(),
                            direction: npc.getDirection()
                        });
                    });

                    //Get all doors from starting room
                    let doors = currentRoom.getListOfDoors();
                    let doorData = [];

                    //Sends all doors to client
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

                    //Emit this business card to other participants in the room
                    let businessCardObject = {
                        id: ppant.getId(),
                        username: username,
                        title: title,
                        surname: surname,
                        forename: forename,
                        job: job,
                        company: company,
                        email: email
                    };

                    //Sends Room ID, typeOfRoom and listOfGameObjects to Client
                    this.#io.to(socket.id).emit('currentGameStateYourRoom', currentRoomId, typeOfCurrentRoom,
                        assetPaths, mapElementsData, gameObjectData, npcData, doorData, currentRoom.getWidth(), currentRoom.getLength(), currentRoom.getOccMap());

                    //Sends the start-position, participant Id and business card back to the client so the avatar can be initialized and displayed in the right cell
                    this.#io.to(socket.id).emit('initOwnParticipantState', { id: ppant.getId(), businessCard: businessCardObject, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection(), isVisible: ppant.getIsVisible(), isModerator: ppant.getIsModerator() });

                    //Initializes Allchat
                    this.#io.to(socket.id).emit('initAllchat', currentRoom.getMessages());

                    this.#ppants.forEach((participant, id, map) => {

                        if (id != ppant.getId() && participant.getPosition().getRoomId() === currentRoomId) {

                            let username = participant.getBusinessCard().getUsername();

                            let tempPos = participant.getPosition();
                            let tempX = tempPos.getCordX();
                            let tempY = tempPos.getCordY();
                            let tempDir = participant.getDirection();
                            let isVisible = participant.getIsVisible();
                            let isModerator = participant.getIsModerator();

                            this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, username: username, cordX: tempX, cordY: tempY, dir: tempDir, isVisible: isVisible, isModerator: isModerator });
                        }
                    });

                    /* Emits the ppantID of the new participant to all other participants
                     * connected to the server so that they may create a new client-side
                     * participant-instance corresponding to it.
                     * This should send to all other connected sockets but not to the one
                     * that just connected */
                    socket.to(currentRoomId.toString()).emit('roomEnteredByParticipant', { id: ppant.getId(), username: businessCardObject.username, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection(), isVisible: ppant.getIsVisible(), isModerator: ppant.getIsModerator() });

                    /*
                    * Check if this is the first conference visit of this ppant 
                    * if so, reminds him to click the BasicTutorial NPC
                    */
                    if (ppant.getTaskTypeMappingCount(TypeOfTask.BASICTUTORIALCLICK) === 0) {
                        let messageHeader = 'Welcome to VIMSU!';
                        let messageBody = 'Please talk to our BasicTutorial NPC by clicking' +
                            ' the tile he is standing on. He will give you a' +
                            ' short introduction that will help you to learn the basics of using VIMSU.';

                        this.#io.to(socket.id).emit('New notification', messageHeader, messageBody);
                    }

                    /* Sends current points and rank to client */
                    socket.emit('updatePoints', ppant.getAwardPoints());

                    RankListService.getRank(ppant.getId(), Settings.CONFERENCE_ID, this.#db).then(rank => {
                        socket.emit('updateRank', rank);
                    }).catch(err => {
                        console.error(err);
                    })
                }).catch(err => {
                    console.error(err)
                });
            });

            /* handles participant sending a message */
            socket.on('sendMessage', (text) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(text);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let participant = this.#ppants.get(ppantID);
                if (!participant)
                    return;

                let roomID = participant.getPosition().getRoomId();
                let room = this.#rooms[roomID - 1].getRoom();
                let username = participant.getBusinessCard().getUsername();
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                /* Adding the possibility of chat-based commands for moderators.
                 * Checks if the participant is a moderator and if the first character
                 * of their message is the "command-starting character" (atm, this
                 * is a backslash). Only if these two conditions are met we start
                 * checking for the actual commands. */
                if (participant.getIsModerator() && text.charAt(0) == Settings.CMDSTARTCHAR) {

                    /* Now, we check if the message contains any command
                     * known by the server and handle this appropriately.
                     * We move this to another method for better readability.
                     *
                     * We also remove the first character of the string (the
                     * "command-starting character"), because we do no longer
                     * need it. */
                    let input = text.substring(1).split(" ");
                    new CommandHandler(this).handleCommand(socket,
                        new AllchatContext(this, room),
                        input, username);
                } else {
                    // If the message contains a command, we don't want to be handled like a regular message

                    // muted ppants can't post messages into any allchat
                    if (this.#muteList.includes(socket.request.session.accountId)) {
                        this.sendNotification(socket.id, Messages.MUTE);
                        return;
                    }

                    // timestamping the message
                    let currentDate = new Date();
                    room.addMessage(ppantID, username, currentDate, text);

                    this.#io.in(roomID.toString()).emit('newAllchatMessage', { username: username, timestamp: currentDate, text: text });
                }

            });

            /* handles receiving a movement-input from a participant. */
            socket.on('requestMovementStart', (direction, newCordX, newCordY) => {


                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let oldDir = ppant.getDirection();
                let oldPos = ppant.getPosition();

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isEnumOf(direction, Direction);
                    TypeChecker.isInt(newCordX);
                    TypeChecker.isInt(newCordY);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    //reset position on client
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                    return;
                }

                let roomId = ppant.getPosition().getRoomId();

                let newPos = new Position(roomId, newCordX, newCordY);

                /* Check if new position is legit. Prevents manipulation from Client */

                //Expected new position with direction DOWNRIGHT
                if (direction === Direction.DOWNRIGHT) {
                    if (!((oldPos.getCordX() - newPos.getCordX() === 0) &&
                        (newPos.getCordY() - oldPos.getCordY() === Settings.MOVEMENTSPEED_Y || newPos.getCordY() - oldPos.getCordY() === 0))) {
                        this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                        return;
                    }
                } 

                //Expected new position with direction DOWNLEFT
                else if (direction === Direction.DOWNLEFT) {
                    if (!((oldPos.getCordX() - newPos.getCordX() === Settings.MOVEMENTSPEED_X || oldPos.getCordX() - newPos.getCordX() === 0) &&
                        (newPos.getCordY() - oldPos.getCordY() === 0))) {
                        this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                        return;
                    }
                } 

                //Expected new position with direction UPRIGHT
                else if (direction === Direction.UPRIGHT) {
                    if (!((newPos.getCordX() - oldPos.getCordX() === Settings.MOVEMENTSPEED_X || newPos.getCordX() - oldPos.getCordX() === 0) &&
                        (newPos.getCordY() - oldPos.getCordY() === 0))) {
                        this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                        return;
                    }
                } 

                //Expected new position with direction UPLEFT
                else if (direction === Direction.UPLEFT) {
                    if (!((oldPos.getCordX() - newPos.getCordX() === 0) &&
                        (oldPos.getCordY() - newPos.getCordY() === Settings.MOVEMENTSPEED_Y || oldPos.getCordY() - newPos.getCordY() === 0))) {
                        this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                        return;
                    }
                } 

                let currentRoom = this.#rooms[roomId - 1].getRoom();

                //Collision Checking

                //No Collision, so every other participant gets the new position
                if (!currentRoom.checkForCollision(newPos)) {
                    ppant.setPosition(newPos);
                    ppant.setDirection(direction);
                    socket.to(roomId.toString()).emit('movementOfAnotherPPantStart', ppantID, direction, newCordX, newCordY);
                } else {
                    //Server resets client position to old Position (P)
                    this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: oldPos.getCordX(), cordY: oldPos.getCordY(), dir: oldDir });
                }

                //Checks old position and old direction whether they're valid position and direction to enter a room
                let doors = currentRoom.getListOfDoors();
                doors.forEach(door => {
                    if (door.isValidEnterPositionWithoutClick(oldPos, oldDir, direction)) {
                        if (door.getTypeOfDoor() === TypeOfDoor.LECTURE_DOOR)
                            this.#getCurrentLectures(socket);
                        else
                            this.#enterRoom(door.getTargetRoomId(), socket);
                        return;
                    }
                })
            });


            /* Handles movement stop */
            socket.on('requestMovementStop', () => {
                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let roomId = ppant.getPosition().getRoomId();

                socket.to(roomId.toString()).emit('movementOfAnotherPPantStop', ppantID);
            });


            /* Handles click on door tile */
            socket.on('enterRoom', (targetRoomId) => {
                this.#enterRoom(targetRoomId, socket);
            });

            /* handles lecture message input */
            socket.on('lectureMessage', (text) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(text);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let participant = this.#ppants.get(ppantID);
                if (!participant)
                    return;

                let username = participant.getBusinessCard().getUsername();

                let lectureID = socket.currentLecture; // socket.currentLecture is the lecture the participant is currently in
                let lecture = this.#conference.getSchedule().getLecture(lectureID);
                let lectureChat = lecture.getLectureChat();
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                if (!lecture.isOpened() && !lecture.isEnded()) {
                    return;
                }

                /* 
                 * Check if this ppant is a moderator or the orator of this lecture
                 * Only moderators and the orator can use commands
                 * */
                if ((participant.getBusinessCard().getUsername() === lecture.getOratorUsername() ||
                    participant.getIsModerator()) && text.charAt(0) === Settings.CMDSTARTCHAR) {

                    /* Now, we check if the message contains any command
                     * known by the server and handle this appropriately.
                     * We move this to another method for better readability.
                     *
                     * We also remove the first character of the string (the
                     * "command-starting character"), because we do no longer
                     * need it. */
                    let input = text.substring(1).split(" ");
                    new CommandHandler(this).handleCommand(socket,
                        new LectureContext(this, lecture),
                        input);

                } else if (lecture.hasToken(ppantID, participant.getBusinessCard().getUsername(), participant.getIsModerator())) {
                    //User can only chat when he has a token or is the orator or moderator of this lecture

                    this.#applyTaskAndAchievement(ppantID, TypeOfTask.ASKQUESTIONINLECTURE);

                    // timestamping the message
                    let currentDate = new Date();
                    let message = { senderID: ppantID, username: username, messageID: lectureChat.getMessages().length, timestamp: currentDate, text: text }
                    lectureChat.appendMessage(message);

                    this.#io.in(socket.currentLecture).emit('lectureMessageFromServer', message);
                }
            });

            /* handles entering lecture */
            socket.on('enterLecture', (lectureId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(lectureId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let idx = this.#currentLecturesData.findIndex(x => x.id === lectureId);
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;
                let ppantUsername = ppant.getBusinessCard().getUsername();
                let isModerator = ppant.getIsModerator();

                //prevents server to crash when client emits a wrong lectureID
                if (idx < 0) {
                    console.log('Client emitted wrong Lecture-ID!');
                    return;
                }

                let schedule = this.#conference.getSchedule();
                let lecture = schedule.getLecture(lectureId);

                if (lecture.isBanned(socket.request.session.accountId)) {
                    this.sendNotification(socket.id, Messages.REMOVAL);
                    return;
                }

                if (lecture.enter(ppantID, ppantUsername, isModerator)) {
                    socket.join(lectureId);
                    socket.currentLecture = lectureId;

                    let token = lecture.hasToken(ppantID, ppantUsername, isModerator);
                    let messages = lecture.getLectureChat().getMessages();
                    ppant.setIsVisible(false);

                    if (ppantUsername === lecture.getOratorUsername())
                        var isOrator = true;
                    else
                        var isOrator = false;

                    socket.emit('lectureEntered', this.#currentLecturesData[idx], token, messages, isOrator, isModerator, new Date().getTime());
                    socket.broadcast.emit('hideAvatar', ppantID);
                } else {
                    socket.emit('lectureFull', lectureId);
                }
            })

            /* handles getting video on lecture start */
            socket.on('getVideoUrl', (lectureId) => {
                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(lectureId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let idx = this.#currentLecturesData.findIndex(x => x.id === lectureId);

                //prevents server to crash when client emits a wrong lectureID
                if (idx < 0) {
                    console.log('Client emitted wrong Lecture-ID!');
                    return;
                }

                let schedule = this.#conference.getSchedule();
                let lecture = schedule.getLecture(lectureId);

                if (socket.currentLecture == lectureId && lecture.isOpened() && !lecture.isEnded()) {
                    var videoUrl = LectureService.getVideoUrl(lecture.getVideoId(),
                        this.#blob, new Date(lecture.getStartingTime()), Math.ceil(lecture.getDuration() / 60));

                    socket.emit('videoUrl', videoUrl);
                }
            })

            /* handles leaving lecture */
            socket.on('leaveLecture', (lectureId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(lectureId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let schedule = this.#conference.getSchedule();
                let lecture = schedule.getLecture(lectureId);

                //prevents server to crash when client emits a wrong lectureID
                if (!lecture) {
                    console.log('Client emitted wrong Lecture-ID!');
                    return;
                }

                let participant = this.#ppants.get(ppantID);
                if (!participant)
                    return;

                participant.setIsVisible(true);
                lecture.leave(ppantID);
                socket.leave(lectureId);
                socket.currentLecture = undefined;
                socket.broadcast.emit('showAvatar', ppantID);

                //applies achievement if lecture has already ended and ppant has token
                if (lecture.isEnded() && lecture.hasToken(ppantID, participant.getBusinessCard().getUsername(), participant.getIsModerator())) {
                    this.#applyTaskAndAchievement(ppantID, TypeOfTask.LECTUREVISIT);
                }
            });

            /* handles clicking lecture door, show current lectures */
            socket.on('getCurrentLectures', () => {
                this.#getCurrentLectures(socket);
            });

            /* handles clearing interval for emiting current lectures */
            socket.on('clearInterval', () => {
                clearInterval(this.#interval);
            })

            /* handles schedule list clicked, show schedule */
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
                            maxParticipants: lecture.getMaxParticipants(),
                            duration: lecture.getDuration()
                        }
                    )
                })

                socket.emit('currentSchedule', lecturesData, new Date().getTime());
            });

            /* handles ppant clicked, show business card */
            socket.on('getBusinessCard', (targetID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(targetID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let target = this.#ppants.get(targetID);

                //prevents the server to crash when a ppant emits a non existing targetID
                if (!target) {
                    console.log('Client emitted wrong Participant ID!');
                    return;
                }

                let businessCard = target.getBusinessCard();
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
                if (ppant.hasFriend(targetID)) {
                    businessCardObject.email = businessCard.getEmail();
                    socket.emit('businessCard', businessCardObject, targetRank, target.getIsModerator());
                } else {
                    RankListService.getRank(targetID, Settings.CONFERENCE_ID, this.#db).then(rank => {
                        targetRank = rank;
                        socket.emit('businessCard', businessCardObject, targetRank, target.getIsModerator());
                    })
                }
            });

            /* handles achievements clicked, show achievements */
            socket.on('getAchievements', () => {
                let ppantID = socket.ppantID;
                let achData = [];
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                ppant.getAchievements().forEach(ach => {
                    achData.push(
                        {
                            currentLevel: ach.getCurrentLevel(),
                            maxLevel: ach.getMaxLevel(),
                            color: ach.getColor(),
                            icon: ach.getIcon(),
                            title: ach.getTitle(),
                            description: ach.getDescription(),
                            currentCount: ppant.getTaskTypeMappingCount(ach.getTaskType()),
                            nextTarget: ach.getNextCount()
                        }
                    )
                });
                socket.emit('achievements', achData);
            });

            /* handles rank list clicked, show rank list*/
            socket.on('getRankList', () => {
                RankListService.getRankListWithUsername(Settings.CONFERENCE_ID, 30, this.#db).then(rankList => {
                    socket.emit('rankList', rankList);
                })
            })

            /* handles friend list clicked, show friend list */
            socket.on('getFriendList', () => {
                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let friendList = ppant.getFriendList();

                let friendListData = [];

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

            /* shows friends to be invited to the group chat */
            socket.on('getInviteFriends', (groupName, chatId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(groupName);
                    if (chatId !== undefined)
                        TypeChecker.isString(chatId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                groupName = groupName.replace(/</g, "&lt;").replace(/>/g, "&gt;")

                if (!groupName || groupName.length > 20) {
                    //group name is empty or has length more than 20 chars

                    socket.emit('inviteFriends', undefined, groupName, undefined, undefined);
                } else {
                    //group name is valid

                    let ppant = this.#ppants.get(ppantID);
                    if (!ppant)
                        return;

                    let friendList = ppant.getFriendList();

                    if (chatId) {
                        //chat existed already

                        if (ppant.isMemberOfChat(chatId)) {
                            var chatPartnerIDList = ppant.getChat(chatId).getParticipantList();
                            var chatPartnerLength = chatPartnerIDList.length;
                            var friendIds = [];

                            friendList.getAllBusinessCards().forEach(businessCard => {
                                friendIds.push(businessCard.getParticipantId())
                            })

                            //filter friend so that only friends are displayed that are not member of this chat yet
                            friendIds = friendIds.filter((friend) => !chatPartnerIDList.includes(friend));

                            var businessCards = [];

                            friendIds.forEach(friendId => {
                                businessCards.push(friendList.getBusinessCard(friendId));
                            })
                        }
                        else
                            //participant is not a member of chat
                            return false;
                    } else {
                        //chat not yet existed, so we emit all friends
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

            /* handles friend request list clicked, shows friend request list */
            socket.on('getFriendRequestList', () => {
                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;
                let friendRequestList = ppant.getReceivedRequestList();

                let friendRequestListData = [];

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

            /* Called whenever a ppant creates a new 1:1 chat */
            socket.on('createNewChat', (chatPartnerID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatPartnerID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let creatorID = socket.ppantID;
                let creator = this.#ppants.get(creatorID);
                if (!creator)
                    return;

                let chatPartner = this.#ppants.get(chatPartnerID);

                ParticipantService.getUsername(chatPartnerID, Settings.CONFERENCE_ID, this.#db).then(chatPartnerUsername => {
                    if (chatPartnerUsername) {
                        let areFriends = creator.hasFriend(chatPartnerID);
                        let friendRequestSent = creator.hasSentFriendRequest(chatPartnerID);

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
                                    timestamp: '',
                                    previewUsername: '',
                                    previewMessage: '',
                                    areFriends: areFriends,
                                    friendRequestSent: friendRequestSent,
                                    partnerId: chatPartnerID,
                                    groupChat: false,
                                    messages: [],

                                };

                                this.#applyTaskAndAchievement(creatorID, TypeOfTask.INITPERSONALCHAT);

                                /* Tell the creator's client to create a new chat. The true tells
                                * the client to immediately open the chatThreadView of the new chat 
                                * so that the creator can start sending messages. */
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
                                            timestamp: '',
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
                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('gotNewChat', creatorUsername, chatData.chatId);
                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('newChat', chatData, false);
                                    }

                                })
                            });

                        } else {
                            //creator has a chat with this chat partner
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
                    }
                });
            });

            /* Called whenever a participant creates a new group chat */
            socket.on('createNewGroupChat', (chatName, chatPartnerIDListInput, chatId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatName);
                    TypeChecker.isInstanceOf(chatPartnerIDListInput, Array);
                    for (let i = 0; i < chatPartnerIDListInput.length; i++) {
                        TypeChecker.isString(chatPartnerIDListInput[i]);
                    }
                    if (chatId !== undefined)
                        TypeChecker.isString(chatId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                //check if there is a chatPartner twice in list for some reason
                let chatPartnerIDList = [];
                for (let i = 0; i < chatPartnerIDListInput.length; i++) {
                    if (!chatPartnerIDList.includes(chatPartnerIDListInput[i])) {
                        chatPartnerIDList.push(chatPartnerIDListInput[i]);
                    }
                }
                
                let creatorID = socket.ppantID;
                let creator = this.#ppants.get(creatorID);
                if (!creator)
                    return;
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

                    if (!creator.isMemberOfChat(chatId))
                        return false;

                    let chat = creator.getChat(chatId);

                    if (chat instanceof OneToOneChat)
                        return false;


                    let existingChatPartnerIDList = chat.getParticipantList();
                    let existingChatPartnerLength = existingChatPartnerIDList.length;

                    var limit = Settings.MAXGROUPPARTICIPANTS - existingChatPartnerLength;

                    if (chatPartnerIDList.length > limit || chatPartnerIDList.length < 1) {
                        return false;
                    }

                    Promise.all(chatPartnerIDList.map(async newChatPartnerID => {

                        if (newChatPartnerID !== creatorID && !existingChatPartnerIDList.includes(newChatPartnerID)) {

                            ParticipantService.addChatID(newChatPartnerID, chatId, Settings.CONFERENCE_ID, this.#db);

                            await ChatService.storeParticipant(chatId, newChatPartnerID, Settings.CONFERENCE_ID, this.#db);

                            var newChatPartnerUsername = await ParticipantService.getUsername(newChatPartnerID, Settings.CONFERENCE_ID, this.#db)
                            let msgText = newChatPartnerUsername + " has joined the chat";
                            var msg = await ChatService.createChatMessage(chatId, '', '', msgText, Settings.CONFERENCE_ID, this.#db);
                            let newChatPartner = this.#ppants.get(newChatPartnerID);
                            var loadedChat = await ChatService.loadChat(chatId, Settings.CONFERENCE_ID, this.#db);

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

                                    if (previewText.length > 35) {
                                        previewText = previewText.slice(0, 35) + "...";
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

                                this.#io.to(this.getSocketId(newChatPartner.getId())).emit('gotNewGroupChat', chatData.title, creatorUsername, chatData.chatId);
                                this.#io.to(this.getSocketId(newChatPartner.getId())).emit('newChat', chatData, false);
                            }

                            existingChatPartnerIDList.forEach(existingChatParticipantID => {
                                if (!chatPartnerIDList.includes(existingChatParticipantID)) {

                                    let existingChatParticipant = this.#ppants.get(existingChatParticipantID);

                                    if (existingChatParticipant !== undefined && existingChatParticipant.isMemberOfChat(chatId)) {
                                        let existingChatParticipantChat = existingChatParticipant.getChat(chatId);

                                        existingChatParticipantChat.addParticipant(newChatPartnerID);
                                        existingChatParticipantChat.addMessage(msg);

                                        if (existingChatParticipantChat instanceof GroupChat) {
                                            this.#io.to(this.getSocketId(existingChatParticipantID)).emit('addToChatParticipantList', newChatPartnerUsername);

                                            if (existingChatParticipant.hasFriend(newChatPartnerID))
                                                this.#io.to(this.getSocketId(existingChatParticipantID)).emit('removeFromInviteFriends', newChatPartnerID, true);
                                            else
                                                this.#io.to(this.getSocketId(existingChatParticipantID)).emit('removeFromInviteFriends', undefined, true);
                                        }
                                    }
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
                        }
                    }))

                } else {

                    //group chat doesn't exist yet
                    var limit = Settings.MAXGROUPPARTICIPANTS - 1;

                    if (chatPartnerIDList.length > limit || chatPartnerIDList.length < 1) {
                        return false;
                    }

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

                        this.#applyTaskAndAchievement(creatorID, TypeOfTask.INITPERSONALCHAT);

                        /* Tell the creator's client to create a new chat. The true tells
                         * the client to immediately open the chatThreadView of the new chat 
                         * so that the creator can start sending messages. */
                        this.#io.to(socket.id).emit('newChat', chatData, true);

                        return chat.getId();

                    }).then(chatId => {

                        chatPartnerIDList.forEach(chatPartnerID => {
                            if (chatPartnerID !== creatorID) {

                                ParticipantService.addChatID(chatPartnerID, chatId, Settings.CONFERENCE_ID, this.#db);

                                let chatPartner = this.#ppants.get(chatPartnerID);

                                if (chatPartner !== undefined) {

                                    ChatService.loadChat(chatId, Settings.CONFERENCE_ID, this.#db).then(loadedChat => {

                                        chatPartner.addChat(loadedChat);

                                        //chat partner joins chat channel
                                        let socketPartner = this.getSocketObject(this.getSocketId(chatPartner.getId()));

                                        socketPartner.join(loadedChat.getId());

                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('gotNewGroupChat', chatData.title, creatorUsername, loadedChat.getId());
                                        this.#io.to(this.getSocketId(chatPartner.getId())).emit('newChat', chatData, false);

                                    });
                                }
                            }
                        });
                    })
                }
            });

            /* Gets the necessary information for the chatListView and sends it to the client.
             * Gets the chatList from the participant and then for every chat gets the title,
             * the timestamp, sender-username and a preview of the last message for display purposes. */
            socket.on('getChatList', () => {
                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let ppantUsername = ppant.getBusinessCard().getUsername();

                let chatList = ppant.getChatList();
                let chatListData = [];
                chatList.forEach(chat => {
                    if (chat.getMessageList().length > 0) {
                        let lastMessage = chat.getMessageList()[chat.getMessageList().length - 1];
                        let previewText = lastMessage.getMessageText();
                        if (previewText.length > 35) {
                            previewText = previewText.slice(0, 35) + "...";
                        }
                        //check if chat is 1:1 with non empty msg list
                        if (chat instanceof OneToOneChat) {
                            chatListData.push({
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
                                title: chat.getOtherUsername(ppantUsername),
                                chatId: chat.getId(),
                                timestamp: '',
                                previewUsername: '',
                                previewMessage: ''
                            });
                        }
                        //check if chat is groupChat with empty msg list
                        else {
                            chatListData.push({
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
             * relevant information into a new field, which is then send to the client. */
            socket.on('getChatThread', (chatID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let requesterId = socket.ppantID;
                let participant = this.#ppants.get(requesterId);
                if (!participant)
                    return;

                if (participant.isMemberOfChat(chatID)) {
                    let chat = participant.getChat(chatID);
                    let messageInfoData = [];
                    chat.getMessageList().forEach((message) => {
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

                        } else {
                            //partner left before

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

                    this.#io.to(socket.id).emit('chatThread', chatData);
                }
            });

            /* Takes a new message in a chat and sends it to every member in that chat. */
            socket.on('newChatMessage', (chatId, msgText) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatId);
                    TypeChecker.isString(msgText);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let senderId = socket.ppantID;
                let sender = this.#ppants.get(senderId);
                if (!sender)
                    return;

                let senderUsername = sender.getBusinessCard().getUsername();
                msgText = msgText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                if (sender.isMemberOfChat(chatId)) {
                    //gets list of chat participants to which send the message to
                    let chatPartnerIDList = sender.getChat(chatId).getParticipantList();

                    //creates a new chat message and stores it into DB.
                    ChatService.createChatMessage(chatId, senderId, senderUsername, msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {

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

                        //distribute chat messages after joining the 1to1 chat 
                        socket.broadcast.to(chatId).emit('gotNewChatMessage', msg.getUsername(), chatId);
                        this.#io.in(chatId).emit('newChatMessage', chatId, msgToEmit);
                    });
                }
            });

            /* shows group chat participant list */
            socket.on('getChatParticipantList', (chatId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let requesterId = socket.ppantID;
                let requester = this.#ppants.get(requesterId);
                if (!requester)
                    return;

                if (requester.isMemberOfChat(chatId)) {
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

            /* adds a new Friend Request to the system */
            socket.on('newFriendRequest', (targetID, chatID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(targetID);
                    TypeChecker.isString(chatID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let requesterID = socket.ppantID;
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

                } else if (target === undefined && requester !== undefined) {
                    //target is offline
                    //get BusCard from DB and add it to sent friend Request
                    ParticipantService.getBusinessCard(targetID, Settings.CONFERENCE_ID, this.#db).then(targetBusCard => {
                        requester.addSentFriendRequest(targetBusCard);
                    }).catch(err => {
                        console.error(err);
                    });
                } else if (target !== undefined && requester === undefined) {
                    //requester goes instantly offline after he sent friend request
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

            /* handles a friendrequest, either accepted or declined */
            socket.on('handleFriendRequest', (requesterID, acceptRequest) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(requesterID);
                    TypeChecker.isBoolean(acceptRequest);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let targetID = socket.ppantID;
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
                    FriendListService.storeFriend(targetID, requesterID, Settings.CONFERENCE_ID, this.#db);
                    FriendListService.storeFriend(requesterID, targetID, Settings.CONFERENCE_ID, this.#db);

                    this.#applyTaskAndAchievement(targetID, TypeOfTask.BEFRIENDOTHER);
                    this.#applyTaskAndAchievement(requesterID, TypeOfTask.BEFRIENDOTHER);


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
            });

            /* handles removing a friend in both friend lists */
            socket.on('removeFriend', (removedFriendID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(removedFriendID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                }

                let removerID = socket.ppantID;
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

            /* handles participant leaving chat, so removes participant from chat */
            socket.on('removeParticipantFromChat', (chatId) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(chatId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                }

                let removerId = socket.ppantID;
                let remover = this.#ppants.get(removerId);
                let removerBusinessCard = remover.getBusinessCard();
                let removerUsername = removerBusinessCard.getUsername();

                if (remover !== undefined && remover.isMemberOfChat(chatId)) {
                    let chatPartnerIDList = remover.getChat(chatId).getParticipantList();

                    let msgText = removerUsername + " has left the chat";

                    ChatService.createChatMessage(chatId, '', '', msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {
                        chatPartnerIDList.forEach(chatPartnerID => {
                            let chatPartner = this.#ppants.get(chatPartnerID);

                            //Checks if receiver of message is online
                            if (chatPartnerID !== removerId && chatPartner !== undefined) {

                                let chatPartnerChat = chatPartner.getChat(chatId);
                                chatPartnerChat.removeParticipant(removerId);
                                chatPartnerChat.addMessage(msg);

                                if (chatPartnerChat instanceof GroupChat) {
                                    this.#io.in(chatId).emit('removeFromChatParticipantList', removerUsername);

                                    if (chatPartner.hasFriend(removerId)) {
                                        var removerBusinessCardData = {
                                            friendId: removerBusinessCard.getParticipantId(),
                                            username: removerUsername,
                                            title: removerBusinessCard.getTitle(),
                                            surname: removerBusinessCard.getSurname(),
                                            forename: removerBusinessCard.getForename(),
                                            surname: removerBusinessCard.getSurname(),
                                            job: removerBusinessCard.getJob(),
                                            company: removerBusinessCard.getCompany(),
                                            email: removerBusinessCard.getEmail()
                                        }

                                        this.#io.to(this.getSocketId(chatPartnerID)).emit('addToInviteFriends', removerBusinessCardData, true)
                                    } else
                                        this.#io.to(this.getSocketId(chatPartnerID)).emit('addToInviteFriends', undefined, true)

                                }
                            }
                        })

                        var msgToEmit = {
                            senderUsername: msg.getUsername(),
                            msgId: msg.getMessageId(),
                            senderId: msg.getSenderId(),
                            timestamp: msg.getTimestamp(),
                            msgText: msg.getMessageText()
                        };

                        //distribute chat messages after leaving chat
                        this.#io.in(chatId).emit('newChatMessage', chatId, msgToEmit);

                    })

                    remover.removeChat(chatId);
                    socket.leave(chatId);
                }

                ChatService.removeParticipant(chatId, removerId, Settings.CONFERENCE_ID, this.#db);
            });

            /* handles npc clicked, show story */
            socket.on('getNPCStory', (npcID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isInt(npcID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let currentRoomId = ppant.getPosition().getRoomId();
                let npc = this.#rooms[currentRoomId - 1].getRoom().getNPC(npcID);

                //prevents server to crash when client emits wrong NPC ID
                if (!npc) {
                    console.log('Client emitted wrong NPC-ID!');
                    return;
                }

                let name = npc.getName();
                let story = npc.getStory();
                if (name === "BasicTutorial") {
                    this.#applyTaskAndAchievement(ppantID, TypeOfTask.BASICTUTORIALCLICK);
                } else if (name === "Chef") {
                    this.#applyTaskAndAchievement(ppantID, TypeOfTask.CHEFCLICK);
                } else if (name === "FoyerHelper") {
                    this.#applyTaskAndAchievement(ppantID, TypeOfTask.FOYERHELPERCLICK);
                }

                socket.emit('showNPCStory', name, story);
            });

            socket.on('disconnect', (reason) => {
                //Prevents server crash because client sends sometimes disconnect event on connection to server.
                if (!this.#socketMap.has(socket.id)) {
                    return;
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let currentRoomId = ppant.getPosition().getRoomId();
                socket.to(currentRoomId.toString()).emit('remove player', ppantID);
                console.log('Participant with Participant_ID: ' + ppantID + ' has disconnected from the game . . .');

                //write position and direction from disconnecting participant in DB
                let pos = ppant.getPosition();
                let direction = ppant.getDirection();
                ParticipantService.updateParticipantPosition(ppantID, Settings.CONFERENCE_ID, pos, this.#db);
                ParticipantService.updateParticipantDirection(ppantID, Settings.CONFERENCE_ID, direction, this.#db);

                //remove participant from room
                this.#rooms[currentRoomId - 1].getRoom().exitParticipant(ppantID);

                this.#socketMap.delete(socket.id);
                this.#ppants.delete(ppantID);

                if (socket.currentLecture) {
                    //participant was in the lecture when disconnecting
                    var schedule = this.#conference.getSchedule();
                    var lectureId = socket.currentLecture;
                    var lecture = schedule.getLecture(lectureId);
                    lecture.leave(ppantID);
                    socket.leave(lectureId);
                    socket.currentLecture = undefined;
                }
            });

            //Allows debugging the server. 
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
    }

    /**
     * Gets socket ID of a participant
     * @method module:ServerController#getSocketId
     * 
     * @param {String} ppantID participant ID
     * 
     * @return {String} socketId
     */
    getSocketId(ppantID) {
        TypeChecker.isString(ppantID);

        var id;
        this.#socketMap.forEach((participantID, socketId) => {
            if (participantID == ppantID) {
                id = socketId;
            }
        });
        return id;
    };

    /**
     * Gets socket object of a participant
     * @method module:ServerController#getSocketObject
     * 
     * @param {String} socketId socket ID
     * 
     * @return {Socket} socket object
     */
    getSocketObject(socketId) {
        TypeChecker.isString(socketId);

        var mainNamespace = this.#io.of('/');
        var socketKeys = Object.keys(mainNamespace.connected);
        for (var i = 0; i < socketKeys.length; i++) {
            if (socketKeys[i] == socketId) {
                return mainNamespace.connected[socketKeys[i]];
            }
        }
    };

    /**
     * Gets ID of username based on its username
     * @method module:ServerController#getIdOf
     * 
     * @param {String} username username
     * 
     * @return {String} participantId
     */
    getIdOf(username) {
        TypeChecker.isString(username);

        var id;
        this.#ppants.forEach((participant, ppantID) => {
            if (participant.getBusinessCard().getUsername() === username) {
                id = ppantID;
            }
        });
        return id;
    };

    /**
     * Called from context class to emits event in a socket room
     * @method module:ServerController#emitEventIn
     * 
     * @param {(String|number)} [idOfSocketRoomToEmitIn] socket room ID
     * @param {String} eventName event name
     * @param {*} eventArguments event arguments
     */
    emitEventIn(idOfSocketRoomToEmitIn, eventName, eventArguments) {
        TypeChecker.isString(eventName);

        if (eventArguments !== undefined) {
            this.#io.in(idOfSocketRoomToEmitIn).emit(eventName, eventArguments);
        } else {
            this.#io.in(idOfSocketRoomToEmitIn).emit(eventName);
        }
    };

    /**
     * Called from context class to emits event to an individual socket id
     * @method module:ServerController#emitEventTo
     * 
     * @param {(String|number)} [idOfSocketRoomToEmitIn] socket id
     * @param {String} eventName event name
     * @param {*} eventArguments event arguments
     */
    emitEventTo(idOfSocketToEmitTo, eventName, eventArguments) {
        TypeChecker.isString(eventName);

        if (eventArguments !== undefined) {
            if (this.#socketIsConnected(idOfSocketToEmitTo)) {
                this.#io.to(idOfSocketToEmitTo).emit(eventName, eventArguments);
            };
        } else {
            this.#io.to(idOfSocketToEmitTo).emit(eventName);
        }
    };

    /**
     * Sends notification to an individual socket id
     * @method module:ServerController#sendNotification
     * 
     * @param {String} socketid socket id
     * @param {{header: String, body: String[]}} message message
     */
    sendNotification(socketid, message) {
        //only send notfitication when socketID is valid and user is online
        if (socketid === undefined) {
            return;
        }
        TypeChecker.isString(socketid);
        TypeChecker.isString(message.header);
        if (message.body instanceof Array) {
            TypeChecker.isInstanceOf(message.body, Array);
            message.body.forEach(line => {
                TypeChecker.isString(line);
            });
        } else {
            TypeChecker.isString(message.body);
        }

        if (this.#socketIsConnected(socketid)) {
            this.#io.to(socketid).emit("New notification", message.header, message.body);
        }
    };

    /**
     * Sends global announcement to all participants
     * @method module:ServerController#sendGlobalAnnouncement
     * 
     * @param {String} username announcer username
     * @param {String} text announcement text
     */
    sendGlobalAnnouncement(username, text) {
        TypeChecker.isString(username);
        TypeChecker.isString(text);

        text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.#io.emit('New global announcement', username, text);
    }

    /**
     * @private Checks if account is banned from entering the conference
     * 
     * @method module:ServerController#isBanned
     * 
     * @param {String} accountId account ID
     * 
     * @return {boolean} true if banned, otherwise false
     */
    #isBanned = function (accountId) {
        TypeChecker.isString(accountId);

        return this.#banList.includes(accountId);
    };

    /**
     * Bans account from entering the conference
     * @method module:ServerController#ban
     * 
     * @param {String} accountId account ID
     */
    ban(accountId) {
        TypeChecker.isString(accountId);

        if (!this.#banList.includes(accountId)) {
            this.#banList.push(accountId);
        };
    };

    /**
     * Unbans account from entering the conference. Currently not used
     * @method module:ServerController#unban
     * 
     * @param {String} accountId account ID
     */
    unban(accountId) {
        TypeChecker.isString(accountId);

        if (this.#banList.includes(accountId)) {
            this.#banList.splice(this.#banList.indexOf(accountId), 1);
        };
    };

    /**
     * @private Checks if socket is connected
     * 
     * @method module:ServerController#socketIsConnected
     * 
     * @param {String} socketid socket id
     * 
     * @return {boolean} true if connected, otherwise false
     */
    #socketIsConnected = function (socketid) {
        TypeChecker.isString(socketid);

        var mainNamespace = this.#io.of('/');
        var socketKeys = Object.keys(mainNamespace.connected);
        for (var i = 0; i < socketKeys.length; i++) {
            if (socketKeys[i] == socketid) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks if participant is muted
     * @method module:ServerController#isMuted
     * 
     * @param {String} accountID account ID
     * 
     * @return {boolean} true if muted, otherwise false
     */
    isMuted(accountID) {
        TypeChecker.isString(accountID);

        return this.#muteList.includes(accountID);
    };

    /**
     * Mutes participant
     * @method module:ServerController#mute
     * 
     * @param {String} accountID account ID
     */
    mute(accountID) {
        TypeChecker.isString(accountID);

        this.#muteList.push(accountID);
    };

    /**
     * Unmutes participant
     * @method module:ServerController#unmute
     * 
     * @param {String} accountID account ID
     */
    unmute(accountID) {
        TypeChecker.isString(accountID);

        this.#muteList.splice(this.#muteList.indexOf(accountID), 1);
    };

    /**
     * @private Gets current lectures and emit to client
     * 
     * @method module:ServerController#getCurrentLectures
     * 
     * @param {Socket.IO} socket 
     */
    #getCurrentLectures = function (socket) {
        let ppantID = socket.ppantID;
        let ppant = this.#ppants.get(ppantID);
        if (!ppant)
            return;

        let enterPosition = ppant.getPosition();
        let currentRoomId = enterPosition.getRoomId();
        let lectureDoor = this.#rooms[currentRoomId - 1].getRoom().getLectureDoor();

        //check if participant is in right position to enter room
        if (!lectureDoor.isValidEnterPosition(enterPosition)) {
            return;
        }

        clearInterval(this.#interval);

        this.#emitCurrentLectures(socket);

        //checks every 1 second if there is any new accessible lecture
        this.#interval = setInterval(() => {
            this.#emitCurrentLectures(socket);
        }, 1000);
    }

    /**
     * @private Emits current lectures to client
     * 
     * @method module:ServerController#emitCurrentLectures
     * 
     * @param {Socket.IO} socket 
     */
    #emitCurrentLectures = function (socket) {
        var schedule = this.#conference.getSchedule();
        let currentLectures = schedule.getCurrentLectures();

        this.#currentLecturesData = [];
        currentLectures.forEach(lecture => {
            this.#currentLecturesData.push(
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

        socket.emit('currentLectures', this.#currentLecturesData);
    }

    /**
     * @private Handles entering room
     * 
     * @method module:ServerController#enterRoom
     * 
     * @param {number} targetRoomId 
     * @param {Socket.IO} socket 
     */
    #enterRoom = function (targetRoomId, socket) {
        //prevents server to crash when client purposely sends wrong type of data to server
        try {
            TypeChecker.isInt(targetRoomId);
        } catch (e) {
            console.log('Client emitted wrong type of data! ' + e);
            return;
        }

        let ppantID = socket.ppantID;
        let ppant = this.#ppants.get(ppantID);
        if (!ppant)
            return;

        let enterPosition = ppant.getPosition();
        let currentRoomId = enterPosition.getRoomId();
        let currentRoom = this.#rooms[currentRoomId - 1].getRoom();

        //prevents server to crash when client emits a non existing room ID
        if (!this.#rooms[targetRoomId - 1]) {
            console.log('Client emitted wrong Room-ID!');
            return;
        }

        let targetRoom = this.#rooms[targetRoomId - 1].getRoom();
        let targetRoomType = targetRoom.getTypeOfRoom();

        //get door from current room to target room
        let door = currentRoom.getDoorTo(targetRoomId);

        if (!door) {
            console.log('There is no door from ' + currentRoom.getTypeOfRoom() + ' to ' + targetRoomType + '!');
            return;
        }

        //check if participant is in right position to enter room
        if (!door.isValidEnterPosition(enterPosition)) {
            return;
        }

        /*
        * Check if ppant clicked BasicTutorial before leaving reception at his first visit
        * He should read it before he is allowed to visit other rooms
        */
        if (currentRoomId === Settings.RECEPTION_ID && targetRoomId === Settings.FOYER_ID
            && ppant.getTaskTypeMappingCount(TypeOfTask.BASICTUTORIALCLICK) === 0) {

            let messageHeader = 'Welcome to VIMSU!';
            let messageBody = 'Before you can start exploring this conference,' +
                ' please talk to our BasicTutorial NPC by clicking' +
                ' the tile he is standing on. He will give you a' +
                ' short introduction that will help you to learn the basics of using VIMSU.';

            this.#io.to(socket.id).emit('New notification', messageHeader, messageBody);
            return;
        }

        let newPos = door.getTargetPosition();
        let x = newPos.getCordX();
        let y = newPos.getCordY();
        let d = door.getDirection();

        targetRoom.enterParticipant(ppant);
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
                isClickable: mapElement.getClickable()
            });
        });

        //get all GameObjects from target room
        let gameObjects = targetRoom.getListOfGameObjects();
        let gameObjectData = [];

        //needed to send all gameObjects of starting room to client
        gameObjects.forEach(gameObject => {
            gameObjectData.push({
                id: gameObject.getId(),
                type: gameObject.getGameObjectType(),
                name: gameObject.getName(),
                width: gameObject.getWidth(),
                length: gameObject.getLength(),
                cordX: gameObject.getPosition().getCordX(),
                cordY: gameObject.getPosition().getCordY(),
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
            assetPaths, mapElementsData, gameObjectData, npcData, doorData, targetRoom.getWidth(), targetRoom.getLength(), targetRoom.getOccMap());

        //set new position in server model
        ppant.setPosition(newPos);
        ppant.setDirection(d);

        //Get username, isModerator, isVisible
        let username = ppant.getBusinessCard().getUsername();
        let isModerator = ppant.getIsModerator();
        let isVisible = ppant.getIsVisible();

        //Emit new position to participant
        this.#io.to(socket.id).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: d });

        //Emit to all participants in old room, that participant is leaving
        socket.to(currentRoomId.toString()).emit('remove player', ppantID);

        //Emit to all participants in new room, that participant is joining
        socket.to(targetRoomId.toString()).emit('roomEnteredByParticipant', { id: ppantID, username: username, cordX: x, cordY: y, dir: d, isVisible: isVisible, isModerator: isModerator });

        //Emit to participant all participant positions, that were in new room before him
        this.#ppants.forEach((ppant, id, map) => {
            if (id != ppantID && ppant.getPosition().getRoomId() === targetRoomId) {
                let username = ppant.getBusinessCard().getUsername();
                let tempPos = ppant.getPosition();
                let tempX = tempPos.getCordX();
                let tempY = tempPos.getCordY();
                let tempDir = ppant.getDirection();
                let isVisible = ppant.getIsVisible();
                let isModerator = ppant.getIsModerator();
                this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, username: username, cordX: tempX, cordY: tempY, dir: tempDir, isVisible: isVisible, isModerator: isModerator });
            }
        });

        //switch socket channel
        socket.leave(currentRoomId.toString());
        socket.join(targetRoomId.toString());
        this.#io.to(socket.id).emit('initAllchat', this.#rooms[targetRoomId - 1].getRoom().getMessages());

        //applies achievement when entering a room
        if (targetRoomId === Settings.FOYER_ID) {
            this.#applyTaskAndAchievement(ppantID, TypeOfTask.FOYERVISIT);
        } else if (targetRoomId === Settings.FOODCOURT_ID) {
            this.#applyTaskAndAchievement(ppantID, TypeOfTask.FOODCOURTVISIT);
        } else if (targetRoomId === Settings.RECEPTION_ID) {
            this.#applyTaskAndAchievement(ppantID, TypeOfTask.RECEPTIONVISIT);
        }
    }

    /**
     * @private Handle the entire logic of applying achievements and points as well as sending updates to the client
     * 
     * @method module:ServerController#applyTaskAndAchievement
     * 
     * @param {String} participantId participant ID
     * @param {TypeOfTask} taskType task type
     */
    #applyTaskAndAchievement = async (participantId, taskType) => {
        TypeChecker.isString(participantId);
        TypeChecker.isEnumOf(taskType, TypeOfTask);

        var participant = this.#ppants.get(participantId);
        var task = new TaskService().getTaskByType(taskType);

        if (participant) {
            //participant is online

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

            this.#io.to(this.getSocketId(participantId)).emit('updatePoints', participant.getAwardPoints());

            await ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, participant.getAwardPoints(), this.#db);

            //updates the rank of all active participants
            Promise.all([...this.#ppants.keys()].map(async ppantId => {
                var rank = await RankListService.getRank(ppantId, Settings.CONFERENCE_ID, this.#db)
                this.#io.to(this.getSocketId(ppantId)).emit('updateRank', rank);
            }))
        } else {
            //participant is not online, so update alle infos to the database

            var awardPoints = task.getAwardPoints();
            var points = await ParticipantService.getPoints(participantId, Settings.CONFERENCE_ID, this.#db);
            var currentPoints = points + awardPoints;
            ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, currentPoints, this.#db);

            var count = await ParticipantService.getTaskCount(participantId, Settings.CONFERENCE_ID, taskType, this.#db);
            var newTaskCount = count + 1;
            ParticipantService.updateTaskCount(participantId, Settings.CONFERENCE_ID, taskType, newTaskCount, this.#db);

            var achievementDefinition = new AchievementService().getAchievementDefinition(taskType);
            var levels = achievementDefinition.getLevels();

            var counter = 0;
            Promise.all(levels.map(async level => {
                var levelsCount = level.count;
                var awardPoints = level.points;

                if (levelsCount <= newTaskCount) {
                    var achievements = await ParticipantService.getAchievements(participantId, Settings.CONFERENCE_ID, this.#db);
                    var currentLevel;
                    achievements.forEach(achievement => {
                        if (achievement.id == achievementDefinition.getId())
                            currentLevel = achievement.currentLevel;
                    })
                    counter++;
                    if (currentLevel < counter) {
                        ParticipantService.updateAchievementLevel(participantId, Settings.CONFERENCE_ID, achievementDefinition.getId(), counter, this.#db);
                        currentPoints += awardPoints;
                        await ParticipantService.updatePoints(participantId, Settings.CONFERENCE_ID, currentPoints, this.#db);

                        //updates the rank of all active participants
                        Promise.all([...this.#ppants.keys()].map(async ppantId => {
                            var rank = await RankListService.getRank(ppantId, Settings.CONFERENCE_ID, this.#db)
                            this.#io.to(this.getSocketId(ppantId)).emit('updateRank', rank);
                        }))
                    }
                }
            }))
        }
    }
}
