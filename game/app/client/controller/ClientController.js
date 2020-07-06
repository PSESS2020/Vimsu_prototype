//TODO: Vielleicht alle Events in einer Utildatei? Müssen Server und Client gleichermaßen bekannt sein.
class ClientController {

    #port;
    #socket;
    #gameView;
    #currentRoom;
    #participantId;

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

    getSocket() {
        return this.#socket;
    }

    setCurrentRoom(currentRoom) {
        this.#currentRoom = currentRoom;
    }

    getCurrentRoom() {
        return this.#currentRoom;
    }

    /*opens a new socket connection between the client and the server and initializes the events to be handled.
    Throws an error if there is already an existing socket */
    openSocketConnection() {
        if (this.#port && !this.#socket) {
            this.#socket = io('http://localhost:' + this.#port); // TODO: set socket server
            this.#socket.on('connected', (socket) => {
                this.#socket.on('roomEnteredByParticipant', this.handleFromServerRoomEnteredByParticipant);
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
    // Is this still needed with handleArrowDown and handleArrowUp? (E)?
    handleFromViewMovementInput(position) {
        this.socketReady;
        //TODO: Clientseitige Kollisionserkennung
        this.#socket.emit('collisionDetection', position);
    }
    
    /* So the idea here is that on every frame (see index.js), the client sends
     * his own position to the server (you could also just send this on movement,
     * I am not a hundred percent sure if that would guarantee a smooth gameplay-
     * experience). I am, however, incapable of understanding where to find the
     * up-to-date position of the client atm (E) */
    sendMovementToServer() {
        this.socketReady;
        this.#socket.emit('movement', /* this.getPosition() */);
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
    
    // Wird das noch gebraucht, wenn die collisionDetection nur client-seitig existiert? (E)
    handleFromServerCollisionDetectionAnswer(isOccupied) {
        if (isOccupied) {
            //TODO: Bewegung wird nicht zugelassen
        } else {
            //TODO: Avatar wird bewegt
        }
    }

    handleLeftArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() - 32, currPos.getCordY() - 16));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleRightArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() + 32, currPos.getCordY() + 16));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleUpArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.UPRIGHT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() + 32, currPos.getCordY() - 16));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleDownArrowDown() {
        this.#gameView.updateOwnAvatarDirection(DirectionClient.DOWNLEFT);
        //TODO: Collision Check
        let currPos = this.#gameView.getOwnAvatarView().getPosition();
        this.#gameView.updateOwnAvatarPosition(new PositionClient(currPos.getCordX() - 32, currPos.getCordY() + 16));
        this.#gameView.updateOwnAvatarWalking(true);
    }

    handleArrowUp() {
        this.#gameView.updateOwnAvatarWalking(false);
    }




    //checks if there is an existing socket. Throws an error if there is no socket.
    socketReady() {
        if (!this.#socket) {
            //TODO: exception
        }
    }
}

