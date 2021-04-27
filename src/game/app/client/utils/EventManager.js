/**
 * The Event Manager
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class EventManager {
    handlingPlaygroundClicked = false;
    clientController;

    /**
     * creates an instance of EventManager.
     * Handles Events from View and emits it to ClientController
     * 
     * @param {ClientController} clientController ClientController instance
     */
    constructor(clientController) {
        if (!!EventManager.instance) {
            return EventManager.instance;
        }

        EventManager.instance = this;

        TypeChecker.isInstanceOf(clientController, ClientController);
        this.clientController = clientController;
    }

    /**
     * called frow View when the tiles on the playground are clicked
     * 
     * @param {Object} startPos startingPosition Cords
     * @param {Number} startPos.x startingPosition CordX
     * @param {Number} startPos.y startingPosition CordY
     * @param {Object} goalPos goalPosition Cords
     * @param {Number} goalPos.x goalPosition CordX
     * @param {Number} goalPos.y goalPosition CordY
     * 
     * @returns {Number} Length of walk path
     * 
     */
    handlePlayGroundClicked(startPos, goalPos) {
        
        if(startPos.x == goalPos.x && startPos.y == goalPos.y)
            return;

        if (this.handlingPlaygroundClicked)
            return;
            
        this.handlingPlaygroundClicked = true;
       
        var currentRoom = this.clientController.getCurrentRoom();

        let occupationMap = JSON.parse(JSON.stringify(currentRoom.getOccupationMap()));

        occupationMap[goalPos.x][goalPos.y] = 3;
        occupationMap[startPos.x][startPos.y] = 2;

        var walkPath = AStar.astarSearch(occupationMap, "manhattan", false);

        if ( walkPath == null) {
            this.handlingPlaygroundClicked = false;
            return 0;
        } else
        {
            var prev = startPos;

            walkPath.forEach( (next, i, array) => {
                let xDiff = prev.x - next.x;
                let yDiff = prev.y - next.y;
                if ( xDiff < 0 ) {
                    setTimeout(()=>{
                    this.handleUpArrowDown();

                    }, i * Settings.TIMEOUT_PER_STEP);
                }
                else if ( xDiff > 0 ) {
                    setTimeout(()=>{
                    this.handleDownArrowDown();
                    }, i * Settings.TIMEOUT_PER_STEP);
                }
                else if ( yDiff < 0){
                    setTimeout(()=>{
                    this.handleRightArrowDown();
                    }, i * Settings.TIMEOUT_PER_STEP);
                }
                else if ( yDiff > 0 ){
                    setTimeout(()=>{
                        this.handleLeftArrowDown();
                    }, i * Settings.TIMEOUT_PER_STEP);
                }

                //wait till the animation for walk path has ended
                if ( i === array.length - 1) {
                    setTimeout(()=>{
                        this.handleArrowUp();
                    }, i * Settings.TIMEOUT_PER_STEP + 2 * Settings.TIMEOUT_PER_STEP);

                    setTimeout(()=>{
                        this.handlingPlaygroundClicked = false;
                    }, i * Settings.TIMEOUT_PER_STEP);
                }

                prev = next;

            })
            return walkPath.length;
        }
    }

    /**
     * called from View when lecture door tile is clicked
     */
    handleLectureDoorClick() {
        this.clientController.handleFromViewGetCurrentLectures();
    }

    /**
     * called from View when door tile is clicked
     *
     * @param {number} roomId room ID
     */
    handleDoorClick(roomId) {
        this.clientController.handleFromViewEnterNewRoom(roomId);
    }

    /**
     * called from View on allchat message input
     * 
     * @param {String} messageVal message value
     */
    handleAllchatMessageInput(messageVal) {
        if (messageVal[0] === '/') {
            this.clientController.sendToServerEvalInput(messageVal.slice(1));
        } else
            this.clientController.sendToServerAllchatMessage(messageVal);
    }

    /**
     * called from View on lecture chat message input
     * 
     * @param {String} messageVal message value
     */
    handleLectureChatMessageInput(messageVal) {
        this.clientController.sendToServerLectureChatMessage(messageVal);
    }

    /**
     * called from View on lecture click
     * 
     * @param {String} lectureId lecture ID
     */
    handleLectureClicked(lectureId) {
        this.clientController.handleFromViewEnterLecture(lectureId);
    }

    /**
     * called from View on lecture leave
     * 
     * @param {String} lectureId lectureID
     */
    handleLectureLeft(lectureId) {
        this.clientController.handleFromViewLectureLeft(lectureId);
    }

    /**
     * called from View to show video
     * 
     * @param {String} lectureId lecture ID
     */
    handleShowVideo(lectureId) {
        this.clientController.handleFromViewGetVideoUrl(lectureId);
    }

    /**
     * called from View on schedule click
     */
    handleScheduleClicked() {
        this.clientController.handleFromViewShowSchedule();
    }

    /**
     * called from View on avatar click
     * 
     * @param {String} participantId participant ID
     */
    handleAvatarClick(participantId) {
        this.clientController.handleFromViewShowBusinessCard(participantId);
    }

    /**
     * called from View on profile click
     */
    handleProfileClicked() {
        this.clientController.handleFromViewShowProfile();
    }

    /**
     * called from View on friend list click
     */
    handleFriendListClicked() {
        this.clientController.handleFromViewShowFriendList();
    }

    /**
     * called from view on chat list click
     */
    handleChatListClicked() {
        this.clientController.handleFromViewShowChatList();
    };

    /**
     * called from view on meeting list click
     */
    handleMeetingListClicked() {
        this.clientController.handleFromViewShowMeetingList();
    };

    /** 
     * called from view when an entry in the meeting list is clicked.
     * 
     * @param {Object} meeting joined meeting
     */
    handleMeetingJoined(meeting) {
        this.clientController.handleFromViewJoinMeeting(meeting);
    }

    /**
     * called from view when a meeting is minimized
     * 
     * @param {Object} meeting minimized meeting
     */
     handleAddMinimizedMeetingNotif(meeting) {
        this.clientController.handleFromViewAddMinimizedMeetingNotif(meeting);
    }

    /**
     * called from view when a meeting is no more minimized
     * 
     * @param {String} meetingId previous minimized meeting id
     */
    handleRemoveMinimizedMeetingNotif(meetingId) {
        this.clientController.handleFromViewRemoveMinimizedMeetingNotif(meetingId);
    }

    /**
     * called from view when a message is read
     * 
     * @param {String} senderUsername message sender username
     * @param {String} chatId chat ID
     */
    handleRemoveNewMessageNotif(senderUsername, chatId) {
        this.clientController.handleFromViewRemoveNewMessageNotif(senderUsername, chatId);
    }

    /**
     * called from view when a chat is read
     * 
     * @param {String} chatId chat ID
     */
     handleRemoveNewChatNotif(chatId) {
        this.clientController.handleFromViewRemoveNewChatNotif(chatId);
    }

    /**
     * called from view when a group chat is read
     * 
     * @param {String} chatId chat ID
     */
     handleRemoveNewGroupChatNotif(chatId) {
        this.clientController.handleFromViewRemoveNewGroupChatNotif(chatId);
    }

    /**
     * called from view when meeting list is shown
     * 
     * @param {String} meetingID meeting ID
     */
     handleRemoveNewMeetingNotif(meetingID) {
        this.clientController.handleFromViewRemoveNewMeetingNotif(meetingID);
    }

    /**
     * called from view when friend request is shown
     * 
     * @param {String} senderUsername requester username
     */
     handleRemoveNewFriendRequestNotif(senderUsername) {
        this.clientController.handleFromViewRemoveNewFriendRequestNotif(senderUsername);
    }

    /**
     * called from view when friend list is shown
     * 
     * @param {String} friendUsername friend username
     */
     handleRemoveNewFriendNotif(friendUsername) {
        this.clientController.handleFromViewRemoveNewFriendNotif(friendUsername);
    }
    
    /**
     * called from view when chat meeting button is clicked
     * @param {String} chatId chat id
     */
    handleChatMeetingButtonClicked(chatId) {
        this.clientController.handleFromViewChatMeeting(chatId);
    }

    /**
     * 
     * @param {String} chatId chat ID
     */
    handleChatThreadClicked(chatId) {
        this.clientController.handleFromViewShowChatThread(chatId);
    };

    /**
     * called from view on chat participant list click
     * 
     * @param {String} chatId chat ID
     */
    handleShowChatParticipantList(chatId) {
        this.clientController.handleFromViewShowChatParticipantList(chatId);
    }

    /**
     * called from View on chat now click
     * 
     * @param {String} participantId participant ID
     */
    handleChatNowClicked(participantId) {
        this.clientController.handleFromViewCreateNewChat(participantId);
    }

    /**
     * called from View on create new group chat
     * 
     * @param {String} chatName group chat name
     * @param {String[]} participantIdList group chat participant IDs
     * @param {String} chatId chat ID
     */
    handleCreateGroupChat(chatName, participantIdList, chatId) {
        this.clientController.handleFromViewCreateNewGroupChat(chatName, participantIdList, chatId)
    }

    /**
     * called from View on invite friends click
     * 
     * @param {String} groupName group chat name
     * @param {String} chatId chat ID
     */
    handleInviteFriendsClicked(groupName, chatId) {
        this.clientController.handleFromViewShowInviteFriends(groupName, chatId);
    }

    /**
     * called from View on chat message input
     * 
     * @param {String} chatId chat ID
     * @param {String} message message value
     */
    handleChatMessageInput(chatId, message) {
        this.clientController.handleFromViewSendNewMessage(chatId, message);
    };

    /**
     * called from View on friend request list click
     */
    handleFriendRequestListClicked() {
        this.clientController.handleFromViewShowFriendRequestList();
    }

    /**
     * called from View on achievement list click
     */
    handleAchievementsClicked() {
        this.clientController.handleFromViewShowAchievements();
    }
    
    /**
     * called from View on rank list click
     */
    handleRankListClicked() {
        this.clientController.handleFromViewShowRankList();
    }

    /**
     * called from View to load more rank list data
     * 
     * @param {Number} currentRankListLength current rank list length on rank list board
     * @param {Number} lastRank last rank on rank list board
     * @param {Number} lastPoints last points on rank list board
     * @param {Number} lastPointsLength number of participants with last points
     */
    handleLoadMoreRankList(currentRanklistLength, lastRank, lastPoints, lastPointsLength) {
        this.clientController.handleFromViewLoadMoreRankList(currentRanklistLength, lastRank, lastPoints, lastPointsLength);
    }

    /**
     * called from View on accepting friend request
     * 
     * @param {BusinessCardClient} businessCard accepted business card
     */
    handleAcceptRequestClicked(businessCard) {
        this.clientController.handleFromViewAcceptRequest(businessCard);
    }

    /**
     * called from View on rejecting friend request 
     * 
     * @param {String} participantId rejected participant ID
     */
    handleRejectRequestClicked(participantId) {
        this.clientController.handleFromViewRejectRequest(participantId);
    }

    /**
     * called from View on removing friend from friend list
     * 
     * @param {String} friendId old friend ID
     */
    handleRemoveFriend(friendId) {
        this.clientController.handleFromViewRemoveFriend(friendId);
    }

    /**
     * called from View on leaving chat
     * 
     * @param {String} chatId chat ID
     */
    handleLeaveChat(chatId) {
        this.clientController.handleFromViewLeaveChat(chatId);
    }

    /**
     * called from View on NPC click
     * 
     * @param {number} npcId NPC ID
     */
    handleNPCClick(npcId) {
        this.clientController.handleFromViewGetNPCStory(npcId);
    }

    /**
     * called from View on IFrame Object click
     * 
     * @param {number} gameObjectID 
     */
    handleIFrameObjectClick(gameObjectID) {
        this.clientController.handleFromViewShowExternalWebsiteView(gameObjectID);
    }

    /**
     * called from View on sending friend request
     * 
     * @param {String} participantRecipientId friend request recepient ID
     * @param {String} chatId chat ID
     */
    handleSendFriendRequest(participantRecipientId, chatId) {
        this.clientController.handleFromViewNewFriendRequest(participantRecipientId, chatId);
    }

    /**
     * called from View to clear interval
     */
    handleClearInterval() {
        this.clientController.handleFromViewClearInterval();
    }

    /**
     * called from View on arrow up
     */
    handleArrowUp() {
        this.clientController.handleArrowUp();
    }

    /**
     * called from View on up arrow down
     */
    handleUpArrowDown() {
        this.clientController.handleUpArrowDown();
    }

    /**
     * called from View on down arrow down
     */
    handleDownArrowDown() {
        this.clientController.handleDownArrowDown();
    }

    /**
     * called from View on left arrow down
     */
    handleLeftArrowDown() {
        this.clientController.handleLeftArrowDown();
    }

    /**
     * called from View on right arrow down
     */
    handleRightArrowDown() {
        this.clientController.handleRightArrowDown();
    }

    /**
     * called from View when user entered a door code on door with doorId
     * 
     * @param {String} doorId if of door for which user entered a code
     * @param {String} enteredCode code the user entered
     */
    handleCodeEntered(doorId, enteredCode) {
        this.clientController.handleFromViewCodeEntered(doorId, enteredCode);
    }

    /**
     * called from View when user clicked a clickable object
     * 
     * @param {GameObjectView} viewObject clickable object view
     */
    handleMoveToObjectAndClick(viewObject) {
        let startPos = this.clientController.getOwnParticipantPosition();
        let targetPos = viewObject.getGridPosition();

        let startCords = {x: startPos.getCordX(), y: startPos.getCordY() + Settings.MAP_BLANK_TILES_WIDTH};
        let targetCords = {x: targetPos.getCordX(), y: targetPos.getCordY()};

        let walkPathLength = this.handlePlayGroundClicked(startCords, targetCords);

        setTimeout(()=>{
            viewObject.onclick();;
        }, Settings.TIMEOUT_PER_STEP * walkPathLength);
    }
}