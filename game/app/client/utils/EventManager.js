class EventManager {

    #clientController;

    /**
     * Handles Events from View and emits it to ClientController
     * 
     * @author Philipp
     * 
     */
    constructor() {
        if (!!EventManager.instance) {
            return EventManager.instance;
        }

        EventManager.instance = this;

        //works because ClientController is singleton
        this.#clientController = new ClientController();
    }

    /**
     * called from View when lecture door tile is clicked
     */
    handleLectureDoorClick() {
        this.#clientController.handleFromViewGetCurrentLectures();
    }

    /**
     * called from View when door tile is clicked
     *
     * @param {number} roomId
     */
    handleDoorClick(roomId) {
        this.#clientController.handleFromViewEnterNewRoom(roomId);
    }

    /**
     * 
     * @param {String} messageVal 
     */
    handleAllchatMessageInput(messageVal) {
        if (messageVal[0] === '/') {
            this.#clientController.sendToServerEvalInput(messageVal.slice(1));
        } else
            this.#clientController.sendToServerAllchatMessage(messageVal);
    }

    /**
     * 
     * @param {String} messageVal 
     */
    handleLectureChatMessageInput(messageVal) {
        this.#clientController.sendToServerLectureChatMessage(messageVal);
    }

    /**
     * 
     * @param {String} lectureId 
     */
    handleLectureClicked(lectureId) {
        this.#clientController.handleFromViewEnterLecture(lectureId);
    }

    /**
     * 
     * @param {String} lectureId 
     * @param {boolean} lectureEnded 
     */
    handleLectureLeft(lectureId, lectureEnded) {
        this.#clientController.handleFromViewLectureLeft(lectureId, lectureEnded);
    }

    handleScheduleClicked() {
        this.#clientController.handleFromViewShowSchedule();
    }

    /**
     * 
     * @param {String} participantId 
     */
    handleAvatarClick(participantId) {
        this.#clientController.handleFromViewShowBusinessCard(participantId);
    }

    handleProfileClicked() {
        this.#clientController.handleFromViewShowProfile();
    }

    handleFriendListClicked() {
        this.#clientController.handleFromViewShowFriendList();
    }

    handleChatListClicked() {
        this.#clientController.handleFromViewShowChatList();
    };

    /**
     * 
     * @param {String} chatId 
     */
    handleChatThreadClicked(chatId) {
        this.#clientController.handleFromViewShowChatThread(chatId);
    };

    /**
     * 
     * @param {String} chatId 
     */
    handleShowChatParticipantList(chatId) {
        this.#clientController.handleFromViewShowChatParticipantList(chatId);
    }

    /**
     * 
     * @param {String} participantId 
     */
    handleChatNowClicked(participantId) {
        this.#clientController.handleFromViewCreateNewChat(participantId);
    }

    /**
     * 
     * @param {String} chatName 
     * @param {String[]} participantIdList 
     * @param {String} chatId 
     */
    handleCreateGroupChat(chatName, participantIdList, chatId) {
        this.#clientController.handleFromViewCreateNewGroupChat(chatName, participantIdList, chatId)
    }

    /**
     * 
     * @param {String} groupName 
     * @param {String} chatId 
     */
    handleInviteFriendsClicked(groupName, chatId) {
        this.#clientController.handleFromViewShowInviteFriends(groupName, chatId);
    }

    /**
     * 
     * @param {String} chatId 
     * @param {String} message 
     */
    handleChatMessageInput(chatId, message) {
        this.#clientController.handleFromViewSendNewMessage(chatId, message);
    };

    handleFriendRequestListClicked() {
        this.#clientController.handleFromViewShowFriendRequestList();
    }

    handleAchievementsClicked() {
        this.#clientController.handleFromViewShowAchievements();
    }

    handleRankListClicked() {
        this.#clientController.handleFromViewShowRankList();
    }

    /**
     * 
     * @param {BusinessCardClient} businessCard 
     */
    handleAcceptRequestClicked(businessCard) {
        this.#clientController.handleFromViewAcceptRequest(businessCard);
    }

    /**
     * 
     * @param {String} participantId 
     */
    handleRejectRequestClicked(participantId) {
        this.#clientController.handleFromViewRejectRequest(participantId);
    }

    /**
     * 
     * @param {String} friendId 
     */
    handleRemoveFriend(friendId) {
        this.#clientController.handleFromViewRemoveFriend(friendId);
    }

    /**
     * 
     * @param {String} chatId 
     */
    handleLeaveChat(chatId) {
        this.#clientController.handleFromViewLeaveChat(chatId);
    }

    /**
     * 
     * @param {number} npcId 
     */
    handleNPCClick(npcId) {
        this.#clientController.handleFromViewGetNPCStory(npcId);
    }

    /**
     * 
     * @param {String} participantRecipientId 
     * @param {String} chatId 
     */
    handleSendFriendRequest(participantRecipientId, chatId) {
        this.#clientController.handleFromViewNewFriendRequest(participantRecipientId, chatId);
    }

    handleClearInterval() {
        this.#clientController.handleFromViewClearInterval();
    }

    handleArrowUp() {
        this.#clientController.handleArrowUp();
    }

    handleUpArrowDown() {
        this.#clientController.handleUpArrowDown();
    }

    handleDownArrowDown() {
        this.#clientController.handleDownArrowDown();
    }

    handleLeftArrowDown() {
        this.#clientController.handleLeftArrowDown();
    }

    handleRightArrowDown() {
        this.#clientController.handleRightArrowDown();
    }
}