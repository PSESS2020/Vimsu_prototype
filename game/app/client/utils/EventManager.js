

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



    handleFriendListClicked(isInviteFriends) {
        this.#clientController.handleFromViewShowFriendList(isInviteFriends, "");
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
     
    /* One function to create a new chat.
     * - (E) */
    handleChatNowClicked(participantId) {
        this.#clientController.handleFromViewCreateNewChat(participantId);
    }
    
    /* One function to create a new group chat
     * - (E) */
    handleCreateGroupChat(participantIdList, groupName) {
        this.#clientController.handleFromViewCreateNewGroupChat(participantIdList, groupName)
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

    handleNPCClick(npcId) {
        this.#clientController.handleFromViewGetNPCStory(npcId);
    }
}
