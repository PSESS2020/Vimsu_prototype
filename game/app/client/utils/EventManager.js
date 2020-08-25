if (typeof module === 'object' && typeof exports === 'object') {
    ClientController = require('../controller/ClientController')
}

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
     *
     */
    handleLectureDoorClick() {

        this.#clientController.handleFromViewGetCurrentLectures();

    }

    /**
     * called from View when door tile is clicked
     *
     */
    handleDoorClick(roomId) {

        this.#clientController.handleFromViewEnterNewRoom(roomId);

    }

    handleLectureChatMessageInput(messageVal) {
        this.#clientController.sendToServerLectureChatMessage(messageVal);
    }

    handleLectureClicked(lectureId) {
        this.#clientController.handleFromViewEnterLecture(lectureId);
    }

    handleLectureLeft(lectureId, lectureEnded) {
        this.#clientController.handleFromViewLectureLeft(lectureId, lectureEnded);
    }

    handleScheduleClicked() {
        this.#clientController.handleFromViewShowSchedule();
    }

    handleAvatarClick(participantId) {
        this.#clientController.handleFromViewShowBusinessCard(participantId);
    }

    handleProfileClicked() {
        this.#clientController.handleFromViewShowProfile();
    }

    handleFriendListClicked() {
        this.#clientController.handleFromViewShowFriendList();
    }

    /* One function to display the list of all chats.
     * - (E) */
    handleChatListClicked() {
        this.#clientController.handleFromViewShowChatList();
    };

    /* One function to display the messages in a chat.
     * - (E) */
    handleChatThreadClicked(chatId) {
        this.#clientController.handleFromViewShowChatThread(chatId);
    };

    handleShowChatParticipantList(chatId) {
        this.#clientController.handleFromViewShowChatParticipantList(chatId);
    }

    /* One function to create a new chat.
     * - (E) */
    handleChatNowClicked(participantId) {
        this.#clientController.handleFromViewCreateNewChat(participantId);
    }

    /* One function to create a new group chat
     * - (E) */
    handleCreateGroupChat(chatName, participantIdList, chatId) {
        this.#clientController.handleFromViewCreateNewGroupChat(chatName, participantIdList, chatId)
    }

    handleInviteFriendsClicked(groupName, chatId) {
        this.#clientController.handleFromViewShowInviteFriends(groupName, chatId);
    }

    /* One function to send a new message in a chat.
     * - (E) */
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

    handleSendFriendRequest(chatId) {
        this.#clientController.handleSendFriendRequest();
    };

    handleAcceptRequestClicked(businessCard) {
        this.#clientController.handleFromViewAcceptRequest(businessCard);
    }

    handleRejectRequestClicked(participantId) {
        this.#clientController.handleFromViewRejectRequest(participantId);
    }

    handleRemoveFriend(friendId) {
        this.#clientController.handleFromViewRemoveFriend(friendId);
    }

    handleLeaveChat(chatId) {
        this.#clientController.handleFromViewLeaveChat(chatId);
    }

    handleNPCClick(npcId) {
        this.#clientController.handleFromViewGetNPCStory(npcId);
    }

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

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = EventManager;
}