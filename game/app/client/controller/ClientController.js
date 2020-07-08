//TODO: Vielleicht alle Events in einer Utildatei? Müssen Server und Client gleichermaßen bekannt sein.
class ClientController {

    #port;
    #socket;
    #gameView;
    #currentRoom;
    #participantId;
    #roomClient;

    /**
     * creates an instance of ClientController only if there is not an instance already.
     * Otherwise the existing instance will be returned.
     * 
     * @author Laura, Eric
     * 
     * @param {GameView} gameView 
     * @param {ParticipantClient} participant
     * @param {currentRoom} currentRoom
     * @param {WebSocket} socket
     * @param {number} port
     */


    constructor(gameView, participantId) { //TODO: instanciate ParticipantClient
        if (!!ClientController.instance) {
            return ClientController.instance;
        }

        ClientController.instance = this;

        this.#gameView = gameView;
        this.#participantId = participantId;
        

        return this;
    }


    getPort() {
        return this.#port;
    }
 
    setPort(port) {
        this.#port = port;
    }

    setCurrentRoom(currentRoom) {
        this.#currentRoom = currentRoom;
    }

    getCurrentRoom() {
        return this.#currentRoom;
    }

    /*Initializes a copy from the game state of the server . 
    Includes the initialization of an room model for the client.*/
    initializeGameState() {
        this.#roomClient = new RoomClient(1, TypeOfRoomClient.FOYER, 25, 25, [], []);
    }

    /*Initializes the initial view for the player*/
    initGameView() {
        var map = this.#roomClient.getMap();

        if (map !== null)
        this.#gameView.initFoyerView(map);
        //TODO this.#gameView.initOwnAvatarView(participant);
        //TODO this.#gameView.initAnotherAvatarViews(participants);
    }

    /*opens a new socket connection between the client and the server and initializes the events to be handled.
    Throws an error if there is already an existing socket */
    openSocketConnection() {
        if (this.#port && !this.#socket) {
            this.#socket = io('http://localhost:' + this.#port); // TODO: set socket server
            this.#socket.on('connected', (socket) => {
                this.#socket.on('roomEnterecByParticipant', this.handleFromServerRoomEnteredByParticipant);
                this.#socket.on('collisionDetetcionAnswer', this.handleFromServerCollisionDetectionAnswer);
                //other events handled from the server
            });
        }
        else {
            // TODO: error state
        }
    }

    //asks the server for an update of the current game state
    requestGameStateUpdate() {
        this.socketReady;
        this.#socket.emit('requestGameStateUpdate');
    }

    /*Handles the user input for moving the avatar. Triggers the collisionDetection event and emits 
    the new position to server.*/
    handleFromViewMovementInput(position) {
        this.socketReady;
        //TODO: Clientseitige Kollisionserkennung
        this.#socket.emit('collisionDetection', position);
    }

    handleFromViewEnterDoor(doorId) {
        this.socketReady;
        this.#socket.emit('enterDoor', doorId);
        //update currentRoom;
        //update View
    }

    /*Triggers the createNewChat event and emits the id of the participant that created the chat and 
    the id of the other chat participant to the server.*/
    handleFromViewCreateNewChat(creatorId, participantId) {
        this.socketReady
        this.#socket.emit('createNewChat', {creatorId, participantId})
    }

    handleFromViewCreateNewGroupChat(creatorId, participantIdList) {
        this.socketReady
        this.#socket.emit('createNewGroupChat', {creatorId, participantIdList})
    }

    handleFromViewNewMessage(sendDateTime, chatId, messageText) {
        this.socketReady
        var senderId = this.participant.getId;
        this.#socket.emit('newMessage', {sendDateTime, senderId, chatId, messageText});
    }

    handleFromViewLectureDownload(lectureId) {
        this.socketReady
        this.#socket.emit('lectureVideoDownload', lectureId);
    }

    handleFromViewGetCurrentLectures() {
        this.socketReady
        this.#socket.emit('getCurrentLectures');
    }

    handleFromViewNewFriendRequest(participantRepicientId) {
        this.socketReady
        var senderId = this.participant.getId;
        this.#socket.emit('newFriendRequest', {senderId, participantRepicientId});
    }

    handleFromViewRespondFriendRequest(senderId) {
        this.socketReady
        var responderId = this.participant.getId;
        this.#socket.emit('newFriendRequest', {senderId, responderId});
    }

    handleFromServerRoomEnteredByParticipant(participantId) {
        var entrancePosition = this.#currentRoom; //TODO .getEntrancePosition
        var entranceDirection = this.#currentRoom;//TODO .getEntranceDirection
        participant = new ParticipantClient(participantId, entrancePosition, entranceDirection);
        // this.#currentRoom.addParticipant(participant);
        this.#gameView.initAnotherAvatarViews(participant);

    }

    handleFromServerCollisionDetectionAnswer(isOccupied) {
        if (isOccupied) {
            //TODO: Bewegung wird nicht zugelassen
        } else {
            //TODO: Avatar wird bewegt
        }
    }

    //checks if there is a existing socket. Throws an error if there is no socket.
    socketReady() {
        if (!this.#socket) {
            //TODO: exception
        }
    }
}

