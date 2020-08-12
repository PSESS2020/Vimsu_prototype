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
     * called from View when lecture door tile is clicked
     *
     */
    handleFoodCourtDoorClick() {
        
        this.#clientController.handleFromViewEnterFoodCourt();
        
    }

       /**
     * called from View when lecture door tile is clicked
     *
     */
    handleReceptionDoorClick() {
        
        this.#clientController.handleFromViewEnterReception();
        
    }

    /**
     * called from View when lecture door tile is clicked
     *
     */
    handleFoyerDoorClick() {
        
        this.#clientController.handleFromViewEnterFoyer();
        
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
    handleChatNowClicked(participantId, username) {
        this.#clientController.handleFromViewCreateNewChat(participantId, username);
    }
    
    /* One function to create a new group chat
     * - (E) */
    handleCreateGroupChat(chatName, participantIdList, limit, chatId) {
        this.#clientController.handleFromViewCreateNewGroupChat(chatName, participantIdList, limit, chatId)
    }

    handleInviteFriendsClicked(groupName, chatId) {
        console.log("myChatId" + chatId)
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
    
    handleAcceptRequestClicked(participantId, username, title, surname, forename, job, company, email) {
        var businessCard = {
            participantId: participantId,
            username: username,
            title: title,
            surname: surname,
            forename: forename,
            job: job,
            company: company, 
            email: email
        }
        
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
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = EventManager;
}