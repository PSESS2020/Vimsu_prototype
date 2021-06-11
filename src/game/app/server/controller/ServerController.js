const Position = require('../models/Position.js');
const Direction = require('../../client/shared/Direction.js');
const RoomService = require('../services/RoomService.js');
const Settings = require('../utils/' + process.env.SETTINGS_FILENAME);
const CommandHandler = require('../models/CommandHandler.js');
const AllchatContext = require('../models/AllchatContext.js');
const LectureContext = require('../models/LectureContext.js');
const LectureService = require('../services/LectureService');
const MeetingService = require('../services/MeetingService.js');
const Schedule = require('../models/Schedule')
const RankListService = require('../services/RankListService')
const Account = require('../../../../website/models/Account.js');
const TypeOfTask = require('../utils/TypeOfTask.js')
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
const Participant = require('../models/Participant.js');
const Group = require('../models/Group.js');
const ShirtColor = require('../../client/shared/ShirtColor.js');
const GroupService = require('../services/GroupService');
const Meeting = require('../models/Meeting.js');
const Message = require('../models/Message.js');
const RoomFactory = require('../models/RoomFactory.js');
const Floorplan = require('../utils/Floorplan.js');
const AssetPaths = require('../../client/shared/AssetPaths.js');

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
    #allDoors;
    #roomService;
    #interval;
    #currentLecturesData;
    #roomFactory;

    //map from socket-id to ppant-id
    #socketMap;

    //map from ppant-id to ppant-instance
    #ppants;

    //map from group-name to group-instance
    #groups;

    // conference meeting instance
    #conferenceMeeting;

    /**
     * Creates an instance of ServerController
     * @constructor module:ServerController
     * 
     * @param {SocketIO} socket socket instance
     * @param {dbClient} db db instance
     * @param {blobClient || undefined} blob blob instance if video storage is required, otherwise undefined
     */
    constructor(socket, db, blob) {
        if (!!ServerController.instance) {
            return ServerController.instance;
        }

        ServerController.instance = this;

        TypeChecker.isInstanceOf(db, dbClient);

        if (Settings.VIDEOSTORAGE_ACTIVATED) 
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

        //Array to hold all Doors
        this.#allDoors = [];
        this.#rooms.forEach(room => {
            this.#allDoors = this.#allDoors.concat(room.getListOfDoors());
        });
        
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

        if (Settings.VIDEOSTORAGE_ACTIVATED) {
            LectureService.createAllLectures(Settings.CONFERENCE_ID, this.#db).then(lectures => {
                var schedule = new Schedule(lectures);
                var conference = new Conference(schedule);
                this.#conference = conference;
            }).catch(err => {
                console.error(err);
            });
        }

        // Creates meeting for whole conference if it did not exist already and gets it
        MeetingService.getConferenceMeeting(Settings.CONFERENCE_ID, this.#db).then(conferenceMeeting => {
            this.#conferenceMeeting = conferenceMeeting;
        });

        // Array to hold all groups
        GroupService.getGroupMap(Settings.CONFERENCE_ID, this.#db).then(groupMap => {
            this.#groups = groupMap;
        }).catch(err => {
            console.error(err);
        });;

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

                /* Informs ppant if this is a conference with or without video storage */
                this.#io.to(socket.id).emit('isVideoConference', Settings.VIDEOSTORAGE_ACTIVATED);

                /* Sends ppant selected language data to client that is relevant for view */
                socket.messages = socket.request.session.conferenceLanguageData.messages;
                this.#io.to(socket.id).emit('selectedLanguageData', socket.request.session.conferenceLanguageData.clientView);

                //variables for creating account instance
                const username = socket.request.session.username;
                const title = socket.request.session.title;
                const surname = socket.request.session.surname;
                const forename = socket.request.session.forename;
                const job = socket.request.session.job;
                const company = socket.request.session.company;
                const email = socket.request.session.email;
                const role = socket.request.session.role;

                const account = new Account(accountId, username, title, surname, forename, job, company, email, role, "", "", true);

                //create Participant
                ParticipantService.createParticipant(account, Settings.CONFERENCE_ID, this.#db).then(ppant => {

                    //Don't allow user to join the conference more than once with the same account
                    if (this.#ppants.has(ppant.getId())) {
                        console.log("Participant already joined the conference");
                        this.#io.to(socket.id).emit('gameEntered');
                        return;
                    }

                    let currentRoomId = ppant.getPosition().getRoomId();
                    let currentRoom = this.getRoomById(currentRoomId);

                    /* In case the ppant is at a position that no longer exists in the current floorplan
                     * or is no longer walkable, we move him to the startposition */ 
                    if ((currentRoom === undefined) || (currentRoom.checkForCollision(ppant.getPosition()))) {
                        ppant.setPosition(new Position(Settings.STARTROOM_ID, Settings.STARTPOSITION_X, Settings.STARTPOSITION_Y));
                        ppant.setDirection(Settings.STARTDIRECTION);
                        currentRoomId = Settings.STARTROOM_ID;
                        currentRoom = this.getRoomById(currentRoomId);
                    }
                    let typeOfCurrentRoom = currentRoom.getTypeOfRoom();

                    socket.ppantID = ppant.getId();
                    socket.username = ppant.getBusinessCard().getUsername();

                    //Join Room Channel
                    socket.join(currentRoomId.toString());

                    //Join All Chat Channels
                    ppant.getChatList().forEach(chat => {
                        socket.join(chat.getId());
                    });

                    //Add ppant to conference meeting instance, only relevant when this ppant joined the conference for the first time
                    this.#conferenceMeeting.addMember(ppant.getId());

                    //Sets ppant in the right room
                    currentRoom.enterParticipant(ppant);

                    //Adds ppant data to maps
                    this.#socketMap.set(socket.id, ppant.getId());
                    this.#ppants.set(ppant.getId(), ppant);

                    //Checks if ppant is member of a still exisitng group
                    this.#groups.forEach(group => {
                        if (group.includesGroupMember(ppant.getId())) {
                            ppant.setShirtColor(group.getShirtColor());

                            //Notify user that he is part of a group (right now only for status bar)
                            socket.emit('join group', group.getName());
                        }
                    });
                     
                    //Open all doors this ppant achieved to open through his achievements before
                    let achievements = ppant.getAchievements();

                    achievements.forEach(ach => {
                        let opensDoorID = ach.getOpensDoorID();
                        if (opensDoorID !== undefined && ach.getCurrentLevel() === ach.getMaxLevel()) {
                            let door = this.getDoorByID(opensDoorID);
                            if (door !== undefined) {
                                door.openDoorFor(ppant.getId());
                            }
                        }
                    });

                    //Gets asset paths of the starting room
                    let assetPaths = AssetPaths;

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
                            isClickable: mapElement.getClickable(),
                            isIFrameObject: mapElement.getIFrameData() !== undefined,
                            story: mapElement.getStory(),
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
                            isClickable: gameObject.getClickable(),
                            isIFrameObject: gameObject.getIFrameData() !== undefined,
                            story: gameObject.getStory()
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
                            direction: npc.getDirection(),
                            shirtColor: npc.getShirtColor()
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

                    //name that is displayed in meetings and above avatar
                    let displayName = ppant.getBusinessCard()['get' + Settings.DISPLAY_NAME]();

                    //Sends Room ID, typeOfRoom and listOfGameObjects to Client
                    this.#io.to(socket.id).emit('currentGameStateYourRoom', currentRoomId, currentRoom.getRoomName(), typeOfCurrentRoom,
                        assetPaths, mapElementsData, gameObjectData, npcData, doorData, currentRoom.getWidth(), currentRoom.getLength(), currentRoom.getOccMap());

                    //Sends the start-position, participant Id and business card back to the client so the avatar can be initialized and displayed in the right cell
                    this.#io.to(socket.id).emit('initOwnParticipantState', { id: ppant.getId(), businessCard: businessCardObject, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection(), isVisible: ppant.getIsVisible(), isModerator: ppant.getIsModerator(), shirtColor: ppant.getShirtColor(), displayName: displayName });

                    //Initializes Allchat
                    this.#io.to(socket.id).emit('initAllchat', currentRoom.getMessages());

                    this.#ppants.forEach((participant, id, map) => {

                        if (id != ppant.getId() && participant.getPosition().getRoomId() === currentRoomId) {

                            
                            let otherDisplayName = participant.getBusinessCard()['get' + Settings.DISPLAY_NAME]();
                            let tempPos = participant.getPosition();
                            let tempX = tempPos.getCordX();
                            let tempY = tempPos.getCordY();
                            let tempDir = participant.getDirection();
                            let isVisible = participant.getIsVisible();
                            let isModerator = participant.getIsModerator();
                            let shirtColor = participant.getShirtColor();

                            this.#io.to(socket.id).emit('roomEnteredByParticipant', { id: id, displayName: otherDisplayName, cordX: tempX, cordY: tempY, dir: tempDir, isVisible: isVisible, isModerator: isModerator, shirtColor: shirtColor });
                        }
                    });

                    /* Emits the ppantID of the new participant to all other participants
                     * connected to the server so that they may create a new client-side
                     * participant-instance corresponding to it.
                     * This should send to all other connected sockets but not to the one
                     * that just connected */
                    socket.to(currentRoomId.toString()).emit('roomEnteredByParticipant', { id: ppant.getId(), displayName: displayName, cordX: ppant.getPosition().getCordX(), cordY: ppant.getPosition().getCordY(), dir: ppant.getDirection(), isVisible: ppant.getIsVisible(), isModerator: ppant.getIsModerator(), shirtColor: ppant.getShirtColor() });

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
                let room = this.getRoomById(roomID);
                let username = participant.getBusinessCard().getUsername();
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br/>');

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
                        input);
                } else {
                    // If the message contains a command, we don't want to be handled like a regular message

                    // muted ppants can't post messages into any allchat
                    if (this.#muteList.includes(socket.request.session.accountId)) {
                        this.sendNotification(socket.id, socket.messages.allchat.mute);
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

                let currentRoom = this.getRoomById(roomId);

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
                        if (door.isLectureDoor())
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

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

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
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br/>');

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

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

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
                    this.sendNotification(socket.id, socket.messages.lecture.removal);
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

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

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

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

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

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

                this.#getCurrentLectures(socket);
            });

            /* handles clearing interval for emiting current lectures */
            socket.on('clearInterval', () => {

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

                clearInterval(this.#interval);
            })

            /* handles schedule list clicked, show schedule */
            socket.on('getSchedule', () => {

                //if video storage is deactivated, there is nothing to do here 
                if (!Settings.VIDEOSTORAGE_ACTIVATED) {
                    return;
                }

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
                if (ppant.hasFriend(targetID) && Settings.ADVANCED_REGISTRATION_SYSTEM) {
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

            /* handles rank list clicked, show rank list */
            socket.on('getRankList', () => {
                RankListService.getRankListWithUsername(Settings.CONFERENCE_ID, this.#db, Settings.MAXNUMRANKLIST).then(rankList => {
                    socket.emit('rankList', rankList, true);
                })
            })

            /* handles rank list load more */
            socket.on('getMoreDataRankList', (currentRankListLength, lastRank, lastPoints, lastPointsLength) => {
                RankListService.getRankListWithUsername(Settings.CONFERENCE_ID, this.#db, Settings.MAXNUMRANKLIST, currentRankListLength, lastRank, lastPoints, lastPointsLength).then(rankList => {
                    socket.emit('rankList', rankList, false);
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

                //client should not be able to add new chat members to chat from an existing group
                if (this.#isChatFromGroup(chatId)) {
                    return;
                }

                let ppantID = socket.ppantID;
                groupName = groupName.replace(/</g, "&lt;").replace(/>/g, "&gt;")

                if (!groupName || groupName.length > 64) {
                    //group name is empty or has length more than 64 chars

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
                                    inviteButton: false, 
                                    leaveButton: true,
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
                                            inviteButton: false,
                                            leaveButton: true,
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
                                    inviteButton: false,
                                    leaveButton: true,
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

                //client should not be able to add new chat members to chat from an existing group
                if (this.#isChatFromGroup(chatId)) {
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
                for (let index = 0; index < chatPartnerIDList.length; index++) {
                    const chatPartnerID = chatPartnerIDList[index]
                    if (!creator.hasFriend(chatPartnerID)) {
                        chatPartnerIDList.splice(index, 1);
                        break;
                    };
                }

                if (chatId) {
                    //group chat already exists

                    if (!creator.isMemberOfChat(chatId))
                        return false;

                    let chat = creator.getChat(chatId);

                    if (chat instanceof OneToOneChat)
                        return false;

                    this.#handleJoinGroupChat(chatPartnerIDList, chat, creatorUsername);
                    

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
                            inviteButton: true,
                            leaveButton: true,
                            messages: []
                        };

                        this.#applyTaskAndAchievement(creatorID, TypeOfTask.INITPERSONALCHAT);

                        /* Tell the creator's client to create a new chat. The true tells
                         * the client to immediately open the chatThreadView of the new chat 
                         * so that the creator can start sending messages. */
                        this.#io.to(socket.id).emit('newChat', chatData, true);

                        // Handles Group Chat creation for chatPartners 
                        this.#handleGroupChatCreationWithoutOwner(chatPartnerIDList, chat, creatorUsername);
                    });
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

            socket.on('getMeetingList', () => {
                // get the participant
                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);

                // if participant does not exist, we do nothing
                if (!ppant)
                    return;

                let meetListData = [];

                // moderators get all group meetings, no matter what group they are part of
                if (ppant.getIsModerator()) {
                    this.#groups.forEach(group => {
                        let groupMeeting = group.getMeeting();
                        meetListData.push({
                            id: groupMeeting.getId(),
                            domain: Settings.DEFAULT_MEETINGDOMAIN,
                            name: groupMeeting.getName(),
                            password: groupMeeting.getPassword()
                        });
                    })
                }
                    
                /* get participants meetings and prepare data object
                 * that we are going to send to client. */
                let meetList = ppant.getMeetingList();

                /* for each meeting get (randomly generated) id, which
                 * we need to generate the URL as well as the name, which
                 * is what the meeting will get listed as. */
                meetList.forEach(meeting => {
                    // dont add groupMeeting twice when ppant is moderator and part of a group
                    if (!meetListData.some(meetingObject => meetingObject.id === meeting.getId())) {
                        meetListData.push({
                            id: meeting.getId(),
                            domain: Settings.DEFAULT_MEETINGDOMAIN,
                            name: meeting.getName(),
                            password: meeting.getPassword()
                        });
                    }
                });

                // send everything to client
                this.#io.to(socket.id).emit('meetingList', meetListData);
            });

            socket.on('getChatMeetingDomain', (chatId) => {
                try {
                    TypeChecker.isString(chatId);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                if (!Settings.CHATMEETING_ACIVATED) return;

                let requesterId = socket.ppantID;
                let participant = this.#ppants.get(requesterId);
                if (!participant)
                    return;

                if (participant.isMemberOfChat(chatId)) {
                    let chat = participant.getChat(chatId);
                    let meetingData = {
                        id: chat.getId(),
                        domain: Settings.DEFAULT_MEETINGDOMAIN,
                        name: chat instanceof OneToOneChat ? chat.getOtherUsername(participant.getBusinessCard().getUsername()) : chat.getChatName(),
                        password: chat.getId()
                    }

                    this.#io.to(socket.id).emit('chatMeeting', meetingData);
                }
            })

            socket.on('requestModMeeting', () => {
                // TODO
                // Check for available moderators
                // as soon as one is available, add him to meeting with requester
                // add requester to meeting
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
                                inviteButton: false,
                                leaveButton: true,
                                meetingButton: Settings.CHATMEETING_ACIVATED,
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
                                inviteButton: false,
                                leaveButton: true,
                                meetingButton: Settings.CHATMEETING_ACIVATED,
                                messages: messageInfoData
                            }
                        }

                    } else {
                        let leaveButton = true;
                        let inviteButton = true;
                        let meetingButton = Settings.CHATMEETING_ACIVATED;

                        if (this.#isChatFromGroup(chat.getId())) {
                            leaveButton = false;
                            inviteButton = false;
                            meetingButton = false;
                        }

                        var chatData = {
                            chatId: chat.getId(),
                            title: chat.getChatName(),
                            areFriends: true,
                            friendRequestSent: true,
                            partnerId: undefined,
                            groupChat: true,
                            inviteButton: inviteButton,
                            leaveButton: leaveButton,
                            meetingButton: meetingButton,
                            messages: messageInfoData
                        }
                    }

                    this.#io.to(socket.id).emit('chatThread', chatData);
                } else {
                    var chatData = {
                        chatId: chatID,
                        title: "An error has occured",
                        areFriends: true,
                        friendRequestSent: true,
                        partnerId: undefined,
                        groupChat: false,
                        inviteButton: false,
                        leaveButton: true,
                        meetingButton: false,
                        messages: [{
                            senderUsername: '',
                            timestamp: new Date(),
                            msgText: "*VIMSU Bot* You are not a member of this chat anymore. Please kindly leave the chat"
                        }]
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
                msgText = msgText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br/>');

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
                        this.#io.to(socket.id).emit('chatParticipantList', chatId, chatParticipantList);
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
                    return;
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

                    this.#io.to(this.getSocketId(removedFriend.getId())).emit('removedFriend friendList', removerID);

                    ChatService.existsOneToOneChat(removerID, removedFriendID, Settings.CONFERENCE_ID, this.#db).then(chat => {
                        this.#io.to(this.getSocketId(removedFriend.getId())).emit('removedFriend chatThread', chat.chatId);
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
                    return;
                }

                //client should not be able to leave a chat from a group without leaving the group entirely
                if (this.#isChatFromGroup(chatId)) {
                    return;
                }
                    
                let removerId = socket.ppantID;
            
                this.#handleLeaveChat(removerId, chatId);
            });

            /* handles npc clicked, show story */
            socket.on('getNPCStory', (npcID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isInt(npcID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let currentRoomId = ppant.getPosition().getRoomId();
                let npc = this.getRoomById(currentRoomId).getNPC(npcID);

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

                socket.emit('showNPCStory', name, story, npcID);
            });

            /* handles IFrameObject clicked, sends URL-Data to client */
            socket.on('getExternalWebsiteData', (gameObjectID) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isInt(gameObjectID);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);
                if (!ppant)
                    return;

                let currentRoomId = ppant.getPosition().getRoomId();
                let gameObject = this.getRoomById(currentRoomId).getGameObject(gameObjectID);

                //prevents server to crash when client emits wrong GameObject ID
                if (!gameObject) {
                    console.log('Client emitted wrong GameObject-ID!');
                    return;
                }

                let iFrameData = gameObject.getIFrameData();
        
                socket.emit('showExternalWebsite', iFrameData, gameObjectID);
            });

            /* handles entered code from client for door with doorId */
            socket.on('codeEntered', (doorId, enteredCode) => {

                //prevents server to crash when client purposely sends wrong type of data to server
                try {
                    TypeChecker.isString(doorId);
                    TypeChecker.isString(enteredCode);
                } catch (e) {
                    console.log('Client emitted wrong type of data! ' + e);
                    return;
                }

                let ppantID = socket.ppantID;
                let ppant = this.#ppants.get(ppantID);

                //user went offline
                if (ppant === undefined) {
                    return;
                }
                
                let door = this.getDoorByID(doorId);

                //door does not exist, client emitted wrong data
                if (door === undefined) {
                    return;
                }

                const messages = socket.messages;

                if (door.enterCodeToOpen(ppantID, enteredCode)) {
                    this.sendNotification(socket.id, messages.door.correctCode);
                } else {
                    this.sendNotification(socket.id, messages.door.wrongCode);
                }
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
                this.getRoomById(currentRoomId).exitParticipant(ppantID);

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
     * Gets ID of participant based on its username. Only returns an ID if user is currently online
     * @method module:ServerController#getIdOfOnlineParticipant
     * 
     * @param {String} username username
     * 
     * @return {String|undefined} participantId, if user exists and is currently online. Undefined otherwise
     */
    getIdOfOnlineParticipant(username) {
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
     * Gets ID of participant based on its username. It doesn't matter if user is online or not
     * @method module:ServerController#getIdOfParticipant
     * 
     * @param {String} username username
     * 
     * @return {String|undefined} participantId, if user exists. Undefined otherwise
     */
    async getIdOfParticipant(username) {
        TypeChecker.isString(username);

        let id = this.getIdOfOnlineParticipant(username);

        if (id !== undefined) {
            return id;

        //User is currently offline or does not exist, try to get ID from DB. Will return undefined if user was not found
        } else {
            return ParticipantService.getIDByUsername(username, Settings.CONFERENCE_ID, this.#db);
        }
    }

    /**
     * Gets username of participant based on its ID. It doesn't matter if user is online or not
     * @method module:ServerController#getUsernameOfParticipant
     * 
     * @param {String} ppantID participant ID
     * 
     * @return {String|boolean} username, if user exists. False otherwise
     */
    async getUsernameOfParticipant(ppantID) {
        TypeChecker.isString(ppantID);

        let socketID = this.getSocketId(ppantID);

        if (socketID !== undefined) {
            let socket = this.getSocketObject(socketID);
            return socket.username;

        //User is currently offline or does not exist, try to get username from DB. Will return false if user was not found
        } else {
            return ParticipantService.getUsername(ppantID, Settings.CONFERENCE_ID, this.#db);
        }
    }

    /**
     * Gets all rooms of current conference
     * @method module:ServerController#getRooms
     * 
     * @return {Room[]} rooms
     * 
     */
    getRooms() {
        return this.#rooms;
    }

     /**
     * Gets all group instances
     * @method module:ServerController#getGroups
     * 
     * @return {Group[]} groups
     */
    getGroups() {
        return Array.from(this.#groups.values());
    }

    /**
     * Gets group instance with passed groupName 
     * @method module:ServerController#getGroup
     * 
     * @param {String} groupName group name
     * 
     * @return {?Group} group, if group with passed name exists. Undefined otherwise
     */
    getGroup(groupName) {
        TypeChecker.isString(groupName);
        
        return this.#groups.get(groupName);
    }
    
    /**
     * Gets all participant instances that are currently online
     * @method module:ServerController#getOnlineParticipants
     * 
     * @return {Participant[]} online participants
     * 
     */
    getOnlineParticipants() {
        return Array.from(this.#ppants.values());
    }

    /**
     * Gets all participant instances that are currently online and member of the passed group instance
     * @method module:ServerController#getOnlineGroupMemberIDs
     * 
     * @param {Group} group group
     * 
     * @return {String[]} memberIDs of members that are currently online
     * 
     */
    getOnlineGroupMemberIDs(group) {
        TypeChecker.isInstanceOf(group, Group);

        let groupMemberIDs = group.getGroupMemberIDs();
        let onlineGroupMemberIDs = [];
        groupMemberIDs.forEach(memberID => {
            if (this.#ppants.get(memberID) !== undefined) {
                onlineGroupMemberIDs.push(memberID);
            }
        });

        return onlineGroupMemberIDs;
    }

    /**
     * Gets all currently available doors in this conference
     * @method module:ServerController#getAllDoors
     * 
     * @return {Door[]} allDoors
     * 
     */
    getAllDoors() {
        return this.#allDoors;
    }

    /**
     * Gets door with doorID if it exists, otherwise undefined
     * @method module:ServerController#getDoorByID
     * 
     * @return {String} doorID
     */
    getDoorByID(doorID) {
        for (let i = 0; i < this.#allDoors.length; i++) {
            const door = this.#allDoors[i]
            if (door.getId() === doorID) {
                return door;
            }
        }

        return undefined;
    }

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
     * Sends a larger notification where a larger window is needed to an individual socket id
     * @method module:ServerController#sendLargeNotification
     * 
     * @param {String} socketid socket id
     * @param {{header: String, body: String[]}} message message
     */
    sendLargeNotification(socketid, message) {
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
            this.#io.to(socketid).emit("New large notification", message.header, message.body);
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
     * Teleports ppant with ppantID to passed position if possible
     * @method module:ServerController#teleportParticipantToPosition
     * 
     * @param {String} ppantID ID of moved ppant
     * @param {Position} position new position of user
     * 
     * @return {boolean} true by success, false otherwise
     */
    teleportParticipantToPosition(ppantID, position) {
        TypeChecker.isString(ppantID);
        TypeChecker.isInstanceOf(position, Position);

        let ppant = this.#ppants.get(ppantID);
        let newRoomID = position.getRoomId();
        let direction = ppant.getDirection();

        //ppant is not online
        if (!ppant) {
            return false; 
        }

        //room does not exist
        if (this.getRoomById(newRoomID) === undefined) {
            return false;
        }

        let newRoom = this.getRoomById(newRoomID);

        //passed position is invalid
        if (newRoom.checkForCollision(position)) {
            return false;
        //passed position is valid
        } else {
            this.#changeParticipantPosition(ppant, position, direction);
            return true;
        }
    }

    /**
     * Teleports ppant with ppantID to ppant with targetID
     * @method module:ServerController#teleportParticipantToParticipant
     * 
     * @param {String} ppantID ID of moved ppant
     * @param {String} targetID ID of target ppant
     * 
     * @return {boolean} true by success, false otherwise
     */    
    teleportParticipantToParticipant(ppantID, targetID) {
        TypeChecker.isString(ppantID);
        TypeChecker.isString(targetID);

        let ppant = this.#ppants.get(ppantID);
        let target = this.#ppants.get(targetID);

        //one of the ppants is not online
        if (!ppant || !target) {
            return false; 
        }

        let newPosition = target.getPosition();
        let direction = ppant.getDirection();

        this.#changeParticipantPosition(ppant, newPosition, direction);
        return true;
    }

    /**
     * Teleports all group members in group with groupName to passed position if possible
     * @method module:ServerController#teleportGroupToPosition
     * 
     * @param {String} groupName name of group
     * @param {Position} position new position of group members
     * 
     * @return {boolean} true by success, false otherwise
     */
    teleportGroupToPosition(groupName, position) {
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(position, Position);

        let group = this.#groups.get(groupName);

        if (group === undefined) {
            return false;
        }

        let onlineGroupMemberIDs = this.getOnlineGroupMemberIDs(group);

        if (onlineGroupMemberIDs.length < 1) {
            return false;
        }

        let portSuccess = true;
        onlineGroupMemberIDs.forEach(memberID => {
            portSuccess = portSuccess && this.teleportParticipantToPosition(memberID, position);
        });

        return portSuccess;
    }

    /**
     * Teleports all group members in group with groupName to ppant with targetID
     * @method module:ServerController#teleportGroupToParticipant
     * 
     * @param {String} groupName name of group
     * @param {String} targetID ID of target ppant
     * 
     * @return {boolean} true by success, false otherwise
     */
    teleportGroupToParticipant(groupName, targetID) {
        TypeChecker.isString(groupName);
        TypeChecker.isString(targetID);

        let group = this.#groups.get(groupName);

        if (group === undefined) {
            return false;
        }

        let onlineGroupMemberIDs = this.getOnlineGroupMemberIDs(group);

        if (onlineGroupMemberIDs.length < 1) {
            return false;
        }

        let portSuccess = true;
        onlineGroupMemberIDs.forEach(memberID => {
            portSuccess = portSuccess && this.teleportParticipantToParticipant(memberID, targetID);
        });
       
        return portSuccess;
    }

    /**
     * Changes moderator state of this ppant
     * @method module:ServerController#setModState
     * 
     * @param {String} username username of this ppant
     * @param {boolean} modState moderator state
     * 
     * @return {boolean} true by success, false otherwise
     */
    setModState(username, modState) {
        TypeChecker.isString(username);
        TypeChecker.isBoolean(modState);

        return this.getIdOfParticipant(username).then(ppantID => {

            //user does not exist
            if (ppantID === undefined) {
                return false;
            }

            let ppant = this.#ppants.get(ppantID);
            let socketID = this.getSocketId(ppantID);

            //user is online
            if (ppant !== undefined && socketID !== undefined) {
                ppant.setIsModerator(modState);

                ppant.setIsModerator(modState);

                let socket = this.getSocketObject(socketID);
    
                //Emit to ppant that his mod state changed and notfiy him
                if (modState) {
                    var msg = socket.messages.mod.youAreNowMod;
                } else {
                    var msg = socket.messages.mod.youAreNoLongerMod;
                }
                this.sendNotification(socketID, msg);
                socket.emit('your mod state changed', modState);

                //Emit to all other ppants in room that mod state of this ppant changed
                let currentRoomId = ppant.getPosition().getRoomId();
                socket.to(currentRoomId.toString()).emit('other mod state changed', modState, ppantID); 
            }

            return ParticipantService.changeModState(ppantID, Settings.CONFERENCE_ID, modState, this.#db);
        })
    }

    /**
     * Creates a new group in this conference
     * @method module:ServerController#createGroup
     * 
     * @param {String} groupName unique name of group
     * @param {ShirtColor} groupColor group color
     * @param {String[]} memberIDs IDs of starting members
     * 
     * @return {boolean} true by success, false if group name is already used
     */
    createGroup(groupName, groupColor, memberIDs) {
        TypeChecker.isString(groupName);
        TypeChecker.isEnumOf(groupColor, ShirtColor);
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(groupMemberID => {
            TypeChecker.isString(groupMemberID);
        });

        //group name already exists
        if (this.#groups.get(groupName) !== undefined) {
            return false;
        }
        
        let groupOwnerID = 'groupChat: ' + groupName;
        let chatMemberIDs = memberIDs.slice();
        ChatService.newGroupChat(groupOwnerID, chatMemberIDs, 'Group: ' + groupName, Settings.CONFERENCE_ID, this.#db).then(groupChat => {
            let meetingMemberIDs = memberIDs.slice();
            MeetingService.newMeeting(meetingMemberIDs, groupName, Settings.CONFERENCE_ID, this.#db).then(groupMeeting => {
                let groupMemberIDs = memberIDs.slice();
                GroupService.createGroup(groupName, groupColor, groupMemberIDs, groupChat, groupMeeting, Settings.CONFERENCE_ID, this.#db).then(group => {
                    this.#groups.set(groupName, group);
                  
                    this.#handleGroupChatCreationWithoutOwner(memberIDs, groupChat, "GroupCreator");
                    this.#handleGroupMeetingCreation(memberIDs, groupMeeting);
                    this.#handleLeaveOldGroup(memberIDs, groupName);
        
                    memberIDs.forEach(memberID => {
                        let member = this.#ppants.get(memberID);
                        let socketID = this.getSocketId(memberID);
                   
                        if (member !== undefined && socketID !== undefined) {
                            
                            let socket = this.getSocketObject(socketID);
                            
                            this.#handleChangeShirtColor(member, groupColor, socket);
                    
                            //Notify user that he joined a new group
                            socket.emit('join group', groupName);

                            let msg = JSON.parse(JSON.stringify(socket.messages.group.youJoined));
                            msg.body = msg.body.replace('groupNamePlaceholder', groupName);
                            this.sendNotification(socketID, msg);
                        }
                    });
                })    
            })
        });
        return true;
    }

    /**
     * Deletes an existing group from this conference
     * @method module:ServerController#deleteGroup
     * 
     * @param {String} groupName unique name of group
     * 
     * @return {boolean} true by success, false if group with passed group name does not exist
     */
    deleteGroup(groupName) {
        TypeChecker.isString(groupName);

        let group = this.#groups.get(groupName);

        //group with that name does not exist
        if (group === undefined) {
            return false;
        }

        let groupChat = group.getGroupChat();
        let groupChatID = groupChat.getId();
        let memberIDs = group.getGroupMemberIDs();
        let groupMeeting = group.getMeeting();
        let meetingID = groupMeeting.getId();

        this.#handleLeaveGroupMeeting(memberIDs, meetingID);
        memberIDs.forEach(memberID => {
            let member = this.#ppants.get(memberID);
            let socketID = this.getSocketId(memberID);
            this.#handleLeaveChat(memberID, groupChatID);

            if (member !== undefined && socketID !== undefined) {

                let socket = this.getSocketObject(socketID);

                this.#handleChangeShirtColor(member, Settings.DEFAULT_SHIRTCOLOR_PPANT, socket);

                //Notify user that he left a group, client changes status bar and removes groupChat from View
                socket.emit('leave group');
                
                let msg = JSON.parse(JSON.stringify(socket.messages.group.youLeft));
                msg.body = msg.body.replace('groupNamePlaceholder', groupName);
                this.sendNotification(socketID, msg);
            }
        });

        this.#groups.delete(groupName);     
        GroupService.deleteGroup(groupName, Settings.CONFERENCE_ID, this.#db);
        return true;
    }

    /**
     * Deletes all existing group from this conferenc
     * @method module:ServerController#deleteAllGroups
     */
     deleteAllGroups() {
        this.#groups.forEach((group, groupName) => {
            this.deleteGroup(groupName); 
        });
    }

    /**
     * Adds users to an existing group 
     * @method module:ServerController#addGroupMember
     * 
     * @param {String} groupName unique name of group
     * @param {String[]} memberIDs IDs of users that will be added
     * 
     * @return {boolean} true by success, false if group with passed group name does not exist
     */
    addGroupMember(groupName, memberIDs) {
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(groupMemberID => {
            TypeChecker.isString(groupMemberID);
        });

        let group = this.#groups.get(groupName);

        //group with that name does not exist
        if (group === undefined) {
            return false;
        }

        let groupColor = group.getShirtColor();
        let groupChat = group.getGroupChat();
        let groupMeeting = group.getMeeting();
        
        this.#handleJoinGroupChat(memberIDs, groupChat, "GroupCreator");
        this.#handleJoinGroupMeeting(memberIDs, groupMeeting);
        this.#handleLeaveOldGroup(memberIDs, groupName);

        memberIDs.forEach(memberID => {
            if (!group.includesGroupMember(memberID)) {
                group.addGroupMember(memberID);
                GroupService.addGroupMember(groupName, memberID, Settings.CONFERENCE_ID, this.#db);

                let member = this.#ppants.get(memberID);
                let socketID = this.getSocketId(memberID);
                if (member !== undefined && socketID !== undefined) {
            
                    let socket = this.getSocketObject(socketID);
                    
                    this.#handleChangeShirtColor(member, groupColor, socket);

                    //Notify user that he joined a new group 
                    socket.emit('join group', groupName);

                    let msg = JSON.parse(JSON.stringify(socket.messages.group.youJoined));
                    msg.body = msg.body.replace('groupNamePlaceholder', groupName);
                    this.sendNotification(socketID, msg);
                }
        }   
        });
        return true;
    }

    /**
     * Removes users from an existing group 
     * @method module:ServerController#removeGroupMember
     * 
     * @param {String} groupName unique name of group
     * @param {String[]} memberIDs IDs of users that will be removed
     * 
     * @return {boolean} true by success, false if group with passed group name does not exist
     */
    removeGroupMember(groupName, memberIDs) {
        TypeChecker.isString(groupName);
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(groupMemberID => {
            TypeChecker.isString(groupMemberID);
        });

        let group = this.#groups.get(groupName);

        //group with that name does not exist
        if (group === undefined) {
            return false;
        }

        let groupChat = group.getGroupChat();
        let groupChatID = groupChat.getId();
        let groupMeeting = group.getMeeting();
        let meetingID = groupMeeting.getId();

        memberIDs.forEach(memberID => {
            if (group.includesGroupMember(memberID)) {

                this.#handleLeaveGroupMeeting([memberID], meetingID);
                this.#handleLeaveChat(memberID, groupChatID);
                group.removeGroupMember(memberID);
                GroupService.removeGroupMember(groupName, memberID, Settings.CONFERENCE_ID, this.#db);

                let member = this.#ppants.get(memberID);
                let socketID = this.getSocketId(memberID);

                if (member !== undefined && socketID !== undefined) {

                    let socket = this.getSocketObject(socketID);
                    
                    this.#handleChangeShirtColor(member, Settings.DEFAULT_SHIRTCOLOR_PPANT, socket);

                    //Notify user that he left a group, client changes status bar and removes groupChat from View
                    socket.emit('leave group');

                    let msg = JSON.parse(JSON.stringify(socket.messages.group.youLeft));
                    msg.body = msg.body.replace('groupNamePlaceholder', groupName);
                    this.sendNotification(socketID, msg);
                }
            }
        });

        let newMemberIDs = group.getGroupMemberIDs();

        //if group has no longer members, delete it from map
        if (newMemberIDs.length < 1) {
            this.#groups.delete(groupName);
        }

        return true;
    }

    /**
     * @private Handle ppant leaving an old group if he joined a new one
     * 
     * @method module:ServerController#handleLeaveOldGroup
     * 
     * @param {String[]} memberIDs memberIDs of new group
     * @param {String} newGroupName name of new group
     */
    #handleLeaveOldGroup = function(memberIDs, newGroupName) {
        TypeChecker.isInstanceOf(memberIDs, Array);
        memberIDs.forEach(groupMemberID => {
            TypeChecker.isString(groupMemberID);
        });
        TypeChecker.isString(newGroupName);

        memberIDs.forEach(memberID => {
            this.#groups.forEach((otherGroup, otherGroupName) => {
                if (otherGroupName !== newGroupName && otherGroup.includesGroupMember(memberID)) {
                    otherGroup.removeGroupMember(memberID);
                    let newMemberIDs = otherGroup.getGroupMemberIDs();

                    //if other group has no longer members, delete it from map
                    if (newMemberIDs.length < 1) {
                        this.#groups.delete(otherGroupName);
                    }
                    GroupService.removeGroupMember(otherGroupName, memberID, Settings.CONFERENCE_ID, this.#db);

                    let otherGroupChat = otherGroup.getGroupChat();
                    let otherGroupChatID = otherGroupChat.getId();
                    let otherGroupMeeting = otherGroup.getMeeting();
                    let otherGroupMeetingID = otherGroupMeeting.getId();

                    this.#handleLeaveChat(memberID, otherGroupChatID);
                    this.#handleLeaveGroupMeeting([memberID], otherGroupMeetingID);
                }
            });
        });
    }

    /**
     * @private Handles group meeting creation
     * 
     * @method module:ServerController#handleGroupMeetingCreation
     * 
     * @param {String[]} memberIDList list of ppantIDs that join groupMeeting
     * @param {GroupChat} meeting group meeting
     */
     #handleGroupMeetingCreation = function(memberIDList, meeting) {
        TypeChecker.isInstanceOf(memberIDList, Array);
        memberIDList.forEach(memberID => {
            TypeChecker.isString(memberID);
        })
        TypeChecker.isInstanceOf(meeting, Meeting);

        let meetingName = meeting.getName();
        let meetingID = meeting.getId();
        let meetingPassword = meeting.getPassword();
        let meetingDomain = Settings.DEFAULT_MEETINGDOMAIN;

        /* Meeting Data that will be sent to client */
        let meetingData = {
            id: meetingID,
            domain: meetingDomain,
            name: meetingName,
            password: meetingPassword,
        };

        memberIDList.forEach(memberID => {
        
            let member = this.#ppants.get(memberID);
            let socketID = this.getSocketId(memberID);

            if (member !== undefined && socketID !== undefined) {

                member.joinMeeting(meeting);

                this.#io.to(socketID).emit('gotNewMeeting', meetingName, meetingID);
                this.#io.to(socketID).emit('newMeeting', meetingData);
            }
        });
    }

    /**
     * @private Handle ppant joining group meeting 
     * 
     * @method module:ServerController#handleJoinGroupMeeting
     * 
     * @param {String[]} memberIDList list of ppantIDs that join groupMeeting
     * @param {Meeting} meeting group meeting
     */
    #handleJoinGroupMeeting = function(memberIDList, meeting) {
        TypeChecker.isInstanceOf(memberIDList, Array);
        memberIDList.forEach(memberID => {
            TypeChecker.isString(memberID);
        })
        TypeChecker.isInstanceOf(meeting, Meeting);
      
        let meetingName = meeting.getName();
        let meetingID = meeting.getId();
        let meetingPassword = meeting.getPassword();
        let meetingDomain = Settings.DEFAULT_MEETINGDOMAIN;

        /* Meeting Data that will be sent to client */
        let meetingData = {
            id: meetingID,
            domain: meetingDomain,
            name: meetingName,
            password: meetingPassword,
        };
                
        memberIDList.forEach(memberID => {
            if (!meeting.includesMember(memberID)) {
                let member = this.#ppants.get(memberID);
                meeting.addMember(memberID);

                let socketID = this.getSocketId(memberID);
                if(member !== undefined && socketID !== undefined) {
                    member.joinMeeting(meeting);

                    this.#io.to(socketID).emit('gotNewMeeting', meetingName, meetingID);
                    this.#io.to(socketID).emit('newMeeting', meetingData);
                }
                MeetingService.addParticipant(meetingID, memberID, Settings.CONFERENCE_ID, this.#db);
            }
        });
    }

    /**
     * @private Handle ppant leaving group meeting 
     * 
     * @method module:ServerController#handleLeaveGroupMeeting
     * 
     * @param {String[]} memberIDList list of ppantIDs that leave groupMeeting
     * @param {Meeting} meetingID group meeting ID
     */
    #handleLeaveGroupMeeting = function(memberIDList, meetingID) {
        TypeChecker.isInstanceOf(memberIDList, Array);
        memberIDList.forEach(memberID => {
            TypeChecker.isString(memberID);
        })
        TypeChecker.isString(meetingID);
      
        memberIDList.forEach(memberID => {
            let member = this.#ppants.get(memberID);

            let socketID = this.getSocketId(memberID);
            if (member !== undefined && socketID !== undefined) {
                member.leaveMeeting(meetingID);

                this.#io.to(socketID).emit('leave meeting', meetingID);
            }
            MeetingService.removeParticipant(meetingID, memberID, Settings.CONFERENCE_ID, this.#db);
        })
    }

    /**
     * Deletes a specific meeting from the database.
     * @method module:ServerController#handleDeleteGroupMeeting
     * 
     * @param {Meeting} meeting meeting that should be deleted
     */
    #handleDeleteGroupMeeting = function(meeting) {
        TypeChecker.isInstanceOf(meeting, Meeting);

        let memberIDs = meeting.getMemberIdList();
        let meetingID = meeting.getId();

        memberIDs.forEach(memberID => {
            let member = this.#ppants.get(memberID);

            let socketID = this.getSocketId(memberID);
            if (member !== undefined && socketID !== undefined) {
                member.leaveMeeting(meetingID);

                this.#io.to(socketID).emit('leave meeting', meetingID);
            }
        })

        MeetingService.removeMeeting(meetingID, Settings.CONFERENCE_ID, this.#db);
    }

    
    /**
     * @private Handles group chat creation for all members that are not the owner
     * 
     * @method module:ServerController#handleGroupChatCreationWithoutOwner
     * 
     * @param {String[]} chatPartnerIDList list of ppantIDs that join groupChat
     * @param {GroupChat} chat group chat
     * @param {String} creatorUsername chatCreator username
     */
    #handleGroupChatCreationWithoutOwner = function(chatPartnerIDList, chat, creatorUsername) {
        TypeChecker.isInstanceOf(chatPartnerIDList, Array);
        chatPartnerIDList.forEach(partnerID => {
            TypeChecker.isString(partnerID);
        })
        TypeChecker.isInstanceOf(chat, GroupChat);
        TypeChecker.isString(creatorUsername);

        let chatId = chat.getId();
        let chatName = chat.getChatName();
        let creatorID = chat.getOwnerId();

        let inviteButton = true;
        let leaveButton = true;

        if (this.#isChatFromGroup(chatId)) {
            inviteButton = false;
            leaveButton = false;
        }

        /* Chat Data that will be sent to client */
        let chatData = {
            title: chatName,
            chatId: chatId,
            timestamp: '', //please dont change the timestamp here
            previewUsername: '',
            previewMessage: '',
            areFriends: true,
            friendRequestSent: true,
            partnerId: undefined,
            groupChat: true,
            inviteButton: inviteButton,
            leaveButton: leaveButton,
            messages: []
        };

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

                        this.#io.to(this.getSocketId(chatPartnerID)).emit('gotNewGroupChat', chatName, creatorUsername, loadedChat.getId());
                        this.#io.to(this.getSocketId(chatPartnerID)).emit('newChat', chatData, false);

                    });
                }
            }
        });
    }

    /**
     * @private Handle ppant joining group chat 
     * 
     * @method module:ServerController#handleJoinGroupChat
     * 
     * @param {String[]} chatPartnerIDList list of ppantIDs that join groupChat
     * @param {GroupChat} chat group chat
     * @param {String} creatorUsername chatCreator username
     */
    #handleJoinGroupChat = function(chatPartnerIDList, chat, creatorUsername) {
        TypeChecker.isInstanceOf(chatPartnerIDList, Array);
        chatPartnerIDList.forEach(partnerID => {
            TypeChecker.isString(partnerID);
        })
        TypeChecker.isInstanceOf(chat, GroupChat);
        TypeChecker.isString(creatorUsername);

        let chatId = chat.getId();
        let creatorID = chat.getOwnerId();
        let existingChatPartnerIDList = chat.getParticipantList();
        let existingChatPartnerLength = existingChatPartnerIDList.length;
                
        var limit = Settings.MAXGROUPPARTICIPANTS - existingChatPartnerLength;
                
        if (chatPartnerIDList.length > limit || chatPartnerIDList.length < 1) {
            return;
        }

        //Remove every ID that is already part of the chat from list
        chatPartnerIDList.forEach((newChatPartnerID, index) => {
            if (existingChatPartnerIDList.includes(newChatPartnerID)) {
                chatPartnerIDList.splice(index, 1);
            }
        });

        Promise.all(chatPartnerIDList.map(async newChatPartnerID => {
                
            if (newChatPartnerID !== creatorID && !existingChatPartnerIDList.includes(newChatPartnerID)) {


                ParticipantService.addChatID(newChatPartnerID, chatId, Settings.CONFERENCE_ID, this.#db);

                await ChatService.storeParticipant(chatId, newChatPartnerID, Settings.CONFERENCE_ID, this.#db);
        
                var newChatPartnerUsername = await ParticipantService.getUsername(newChatPartnerID, Settings.CONFERENCE_ID, this.#db);
                let msgText = "*VIMSU Bot* " + newChatPartnerUsername + " has joined the chat";
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
                        let inviteButton = true;
                        let leaveButton = false;

                        if (this.#isChatFromGroup(loadedChat.getId())) {
                            inviteButton = false;
                            leaveButton = false;
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
                            inviteButton: inviteButton,
                            leaveButton: leaveButton,
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
                            inviteButton: inviteButton,
                            leaveButton: leaveButton,
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
                                this.#io.to(this.getSocketId(existingChatParticipantID)).emit('addToChatParticipantList', chatId, newChatPartnerUsername);
        
                                if (existingChatParticipant.hasFriend(newChatPartnerID))
                                    this.#io.to(this.getSocketId(existingChatParticipantID)).emit('removeFromInviteFriends', newChatPartnerID, true);
                                else
                                    this.#io.to(this.getSocketId(existingChatParticipantID)).emit('removeFromInviteFriends', undefined, true);
                            }
                        }
                    }
                });
        
                var msgToEmit = {
                    senderUsername: msg.getUsername(),
                    msgId: msg.getMessageId(),
                    senderId: msg.getSenderId(),
                    timestamp: msg.getTimestamp(),
                    msgText: msg.getMessageText()
                };
        
                this.#io.to(chatId).emit('newChatMessage', chatId, msgToEmit);                
                            
            }
        }));
    

    }
       
    /**
     * @private Handle ppant leaving chat 
     * 
     * @method module:ServerController#handleLeaveChat
     * 
     * @param {String} memberID memberID
     * @param {String} chatID group chat ID
     */
    #handleLeaveChat = async function(memberID, chatID) {
        TypeChecker.isString(memberID);
        TypeChecker.isString(chatID);
    
        let socketID = this.getSocketId(memberID);
        let member = this.#ppants.get(memberID);
        let memberBusinessCard;
        let chatPartnerIDList;

        //participant is online
        if (member !== undefined && socketID !== undefined && member.isMemberOfChat(chatID)) {
            memberBusinessCard = member.getBusinessCard();
            var socket = this.getSocketObject(socketID);
            chatPartnerIDList = member.getChat(chatID).getParticipantList();

        //participant is not online and is forced to leave a chat
        } else {
            memberBusinessCard = await ParticipantService.getBusinessCard(memberID, Settings.CONFERENCE_ID, this.#db);
            chatPartnerIDList = await ChatService.loadMemberList(chatID, Settings.CONFERENCE_ID, this.#db);

            //participant does not exist or is not member of this chat, should not happen
            if (!memberBusinessCard || !chatPartnerIDList.includes(memberID)) {
                return;
            }
        }

        let memberUsername = memberBusinessCard.getUsername();
        let msgText = "*VIMSU Bot* " + memberUsername + " has left the chat";

        ChatService.createChatMessage(chatID, '', '', msgText, Settings.CONFERENCE_ID, this.#db).then(msg => {
            chatPartnerIDList.forEach(chatPartnerID => {
                let chatPartner = this.#ppants.get(chatPartnerID);

                //Checks if receiver of message is online
                if (chatPartnerID !== memberID && chatPartner !== undefined) {

                    let chatPartnerChat = chatPartner.getChat(chatID);

                    if (chatPartnerChat !== undefined) {
                        chatPartnerChat.addMessage(msg);
                        chatPartnerChat.removeParticipant(memberID);
                    }

                    if (chatPartnerChat instanceof GroupChat) {
                        this.#io.in(chatID).emit('removeFromChatParticipantList', chatID, memberUsername);

                        if (chatPartner.hasFriend(memberID)) {
                            var memberBusinessCardData = {
                                friendId: memberBusinessCard.getParticipantId(),
                                username: memberUsername,
                                title: memberBusinessCard.getTitle(),
                                surname: memberBusinessCard.getSurname(),
                                forename: memberBusinessCard.getForename(),
                                job: memberBusinessCard.getJob(),
                                company: memberBusinessCard.getCompany(),
                                email: memberBusinessCard.getEmail()
                            }
    
                            this.#io.to(this.getSocketId(chatPartnerID)).emit('addToInviteFriends', memberBusinessCardData, true)
                        } else
                            this.#io.to(this.getSocketId(chatPartnerID)).emit('addToInviteFriends', undefined, true)
                    }
                }
            });
            

            var msgToEmit = {
                senderUsername: msg.getUsername(),
                msgId: msg.getMessageId(),
                senderId: msg.getSenderId(),
                timestamp: msg.getTimestamp(),
                msgText: msg.getMessageText()
            };

            //distribute chat messages after leaving chat
            this.#io.in(chatID).emit('newChatMessage', chatID, msgToEmit);

        });

        if (socket !== undefined && member !== undefined) {
            socket.emit('leave chat', chatID);
            member.removeChat(chatID);
            socket.leave(chatID);
        }
        
        ChatService.removeParticipant(chatID, memberID, Settings.CONFERENCE_ID, this.#db);
    }

    /**
     * @private Handle ppant changing shirt color 
     * 
     * @method module:ServerController#handleChangeShirtColor
     * 
     * @param {Participant} ppant ppant instance
     * @param {ShirtColor} color new shirt color
     * @param {Socket.IO} socket socket of this client
     */
    #handleChangeShirtColor = function(ppant, color, socket) {
        let ppantID = ppant.getId();
        ppant.setShirtColor(color);

        //Notify all users that shirt color changed
        socket.emit('your shirt color changed', color);
        let currentRoomId = ppant.getPosition().getRoomId();
        socket.to(currentRoomId.toString()).emit('other shirt color changed', color, ppantID);
    }

    /**
     * @private Checks if chat with chatId is a chat from an existing group
     * 
     * @method module:ServerController#isChatFromGroup
     * 
     * @param {String} chatId chatId
     * 
     * @return {boolean} true if chat is a chat from an existing group, false otherwise
     */
    #isChatFromGroup = function(chatId) {
        for (const group of this.#groups.values()) {
            if (group.getGroupChat().getId() === chatId) {
                return true;
            }
        }
        return false;
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
     * Is called after a participant deleted his account, removes all references in all current instances
     * @method module:ServerController#deleteParticipantReferences
     * 
     * @param {String} ppantID id of ppant that deleted his account
     * @param {String} username username of ppant that deleted his account
     * 
     */
    deleteParticipantReferences(ppantID, username) {

        //remove all references from other ppant instances
        this.#ppants.forEach(ppant => {

            let socketID = this.getSocketId(ppant.getId());
            
            //All this methods have only an effect if this ppant was actually part of these lists
            if (ppant.hasFriend(ppantID)) {
                ppant.removeFriend(ppantID);
                this.#io.to(socketID).emit('removedFriend friendList', ppantID);
            }

            if (ppant.hasSentFriendRequest(ppantID)) {
                ppant.declineFriendRequest(ppantID);
                ppant.sentFriendRequestDeclined(ppantID);
                this.#io.to(socketID).emit('removeFriendRequest', ppantID);
            }

            let chatList = ppant.getChatList();
            chatList.forEach(chat => {
                if (chat.includesChatMember(ppantID)) {
                    let chatID = chat.getId();

                    //Gets chat with msg that a member deleted his account and is no longer part of it
                    ChatService.loadChat(chatID, Settings.CONFERENCE_ID, this.#db).then(updatedChat => {
                        ppant.updateChat(updatedChat);

                        //Get delete msg
                        let msgList = updatedChat.getMessageList();

                        let i = 1;
                        while (msgList[msgList.length - i].getMessageText() !== "*VIMSU Bot* " + username + " has deleted his/her account and is no longer part of the chat.") 
                            i--;
                        
                        let deleteMsg = msgList[msgList.length - i];

                        let msgToEmit = {
                            senderUsername: deleteMsg.getUsername(),
                            msgId: deleteMsg.getMessageId(),
                            senderId: deleteMsg.getSenderId(),
                            timestamp: deleteMsg.getTimestamp(),
                            msgText: deleteMsg.getMessageText()
                        };    

                        this.#io.to(socketID).emit('removeFromChatParticipantList', chatID, username);
                        this.#io.to(socketID).emit('newChatMessage', chatID, msgToEmit);
                    })
                }
            });
        });

        //remove all references from group instances
        this.#groups.forEach(group => {
            if (group.includesGroupMember(ppantID)) {
                group.removeGroupMember(ppantID);

                // Can be done here because every existing group is included in groupMap 
                GroupService.removeGroupMember(group.getName(), ppantID, Settings.CONFERENCE_ID, this.#db);
            }
        });
    }

    /**
     * @private Gets current lectures and emit to client
     * 
     * @method module:ServerController#getCurrentLectures
     * 
     * @param {Socket.IO} socket 
     */
    #getCurrentLectures = function (socket) {

        //if video storage is deactivated, there is nothing to do here 
        if (!Settings.VIDEOSTORAGE_ACTIVATED) {
            return;
        }

        let ppantID = socket.ppantID;
        let ppant = this.#ppants.get(ppantID);
        if (!ppant)
            return;

        let enterPosition = ppant.getPosition();
        let currentRoomId = enterPosition.getRoomId();
        let lectureDoor = this.getRoomById(currentRoomId).getLectureDoor();

        //check if participant is in right position to enter room
        if (!lectureDoor.isValidEnterPosition(enterPosition)) {
            return;
        }

        //check if lecture door is open for this participant
        if (!lectureDoor.isOpenFor(ppantID)) {
            this.sendNotification(socket.id, lectureDoor.getClosedMessage());
            return;
        } else if (!lectureDoor.isOpenFor(ppantID) && lectureDoor.hasCodeToOpen()) {
            socket.emit('enterCode', door.getId());
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

        //if video storage is deactivated, there is nothing to do here 
        if (!Settings.VIDEOSTORAGE_ACTIVATED) {
            return;
        }

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
        let currentRoom = this.getRoomById(currentRoomId);

        //prevents server to crash when client emits a non existing room ID
        if (!this.getRoomById(targetRoomId)) {
            console.log('Client emitted wrong Room-ID!');
            return;
        }

        let targetRoom = this.getRoomById(targetRoomId);
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

        //check if the door is open for this participant
        if (!door.isOpenFor(ppantID) && !door.hasCodeToOpen()) {
            this.sendNotification(socket.id, door.getClosedMessage());
            return;
        } else if (!door.isOpenFor(ppantID) && door.hasCodeToOpen()) {
            socket.emit('enterCode', door.getId());
            return;
        }

        let newPos = door.getTargetPosition();
        let d = door.getDirection();

        this.#changeParticipantPosition(ppant, newPos, d);

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
     * @method module:ServerController#getRoomById
     * 
     * @param {String} roomId 
     * @returns {Room} Returns the room with the passed id, if
     *                 the conference has such room. Returns
     *                 undefined otherwise.
     */
    getRoomById(roomId) {
        for (let i = 0; i < this.#rooms.length; i++) {
            const room = this.#rooms[i];
            if (room.getRoomId() == roomId) {
                return room;
            }
        }

        return undefined;
    }

    /**
     * @private Handles changing a ppants position
     * 
     * @method module:ServerController#changeParticipantPosition
     * 
     * @param {Participant} ppant
     * @param {Position} newPosition 
     * @param {direction} Direction
     */
    #changeParticipantPosition = function(ppant, newPos, direction)  {
        TypeChecker.isInstanceOf(ppant, Participant);
        TypeChecker.isInstanceOf(newPos, Position);
        TypeChecker.isEnumOf(direction, Direction);

        let ppantID = ppant.getId();

        let currentPosition = ppant.getPosition();
        let currentRoomId = currentPosition.getRoomId();
        let currentRoom = this.getRoomById(currentRoomId);

        let targetRoomId = newPos.getRoomId();
        let targetRoom = this.getRoomById(targetRoomId);
        let targetRoomType = targetRoom.getTypeOfRoom();

        currentRoom.exitParticipant(ppantID);
        targetRoom.enterParticipant(ppant);

        //Get asset paths of target room
        let assetPaths = AssetPaths;

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
                isClickable: mapElement.getClickable(),
                isIFrameObject: mapElement.getIFrameData() !== undefined,
                story: mapElement.getStory()
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
                isClickable: gameObject.getClickable(),
                isIFrameObject: gameObject.getIFrameData() !== undefined,
                story: gameObject.getStory()
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
                direction: npc.getDirection(),
                shirtColor: npc.getShirtColor()
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

        let socketID = this.getSocketId(ppantID);
        let socket = this.getSocketObject(socketID);

        //emit new room data to client
        this.#io.to(socketID).emit('currentGameStateYourRoom', targetRoomId, targetRoom.getRoomName(), targetRoomType,
            assetPaths, mapElementsData, gameObjectData, npcData, doorData, targetRoom.getWidth(), targetRoom.getLength(), targetRoom.getOccMap());

        //set new position in server model
        ppant.setPosition(newPos);
        ppant.setDirection(direction);

        //displayName, isModerator, isVisible, shirtColor
        let displayName = ppant.getBusinessCard()['get' + Settings.DISPLAY_NAME]();
        let isModerator = ppant.getIsModerator();
        let isVisible = ppant.getIsVisible();
        let shirtColor = ppant.getShirtColor();

        let x = newPos.getCordX();
        let y = newPos.getCordY();

        //Emit new position to participant
        this.#io.to(socketID).emit('currentGameStateYourPosition', { cordX: x, cordY: y, dir: direction });

        //Emit to all participants in old room, that participant is leaving
        socket.to(currentRoomId.toString()).emit('remove player', ppantID);

        //Emit to all participants in new room, that participant is joining
        socket.to(targetRoomId.toString()).emit('roomEnteredByParticipant', { id: ppantID, displayName: displayName, cordX: x, cordY: y, dir: direction, isVisible: isVisible, isModerator: isModerator, shirtColor: shirtColor });

        //Emit to participant all participant positions, that were in new room before him
        this.#ppants.forEach((ppant, id, map) => {
            if (id != ppantID && ppant.getPosition().getRoomId() === targetRoomId) {
                let displayName = ppant.getBusinessCard()['get' + Settings.DISPLAY_NAME]();
                let tempPos = ppant.getPosition();
                let tempX = tempPos.getCordX();
                let tempY = tempPos.getCordY();
                let tempDir = ppant.getDirection();
                let isVisible = ppant.getIsVisible();
                let isModerator = ppant.getIsModerator();
                let shirtColor = ppant.getShirtColor();
                this.#io.to(socketID).emit('roomEnteredByParticipant', { id: id, displayName: displayName, cordX: tempX, cordY: tempY, dir: tempDir, isVisible: isVisible, isModerator: isModerator, shirtColor: shirtColor });
            }
        });

        //switch socket channel
        if (currentRoomId !== targetRoomId) {
            socket.leave(currentRoomId.toString());
            socket.join(targetRoomId.toString());
        }

        this.#io.to(socketID).emit('initAllchat', this.getRoomById(targetRoomId).getMessages());

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

                //if this new achievement opens a door, open it for this ppant
                let opensDoorID = ach.getOpensDoorID();
                if (opensDoorID !== undefined && ach.getCurrentLevel() === ach.getMaxLevel()) {
                    let door = this.getDoorByID(opensDoorID);
                    if (door !== undefined) {
                        door.openDoorFor(participantId);
                    }
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
