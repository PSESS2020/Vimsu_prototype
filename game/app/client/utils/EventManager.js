

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
        
    };
    
    /* One function to display the messages in a chat.
     * - (E) */
     handleChatThreadClicked() {
         
     };
     
    /* One function to create a new chat.
     * - (E) */
    handleChatNewClicked(participantId, isFriend) {
        this.#clientController.handleFromViewCreateNewChat(participantId, isFriend);
    }

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
