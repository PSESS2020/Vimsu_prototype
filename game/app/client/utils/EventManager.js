

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

    handleLectureLeft(lectureId) {
        this.#clientController.handleFromViewLectureLeft(lectureId);
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

    handleChatNowClicked(participantId, isFriend) {
        this.#clientController.handleFromViewCreateNewChat(participantId, isFriend);
    }

    handleFriendListClicked() {
        this.#clientController.handleFromViewShowFriendList();
    }

    handleFriendRequestListClicked() {
        this.#clientController.handleFromViewShowFriendRequestList();
    }

    handleAcceptRequestClicked(participantId) {
        this.#clientController.handleFromViewAcceptRequest(participantId);
    }

    handleRejectRequestClicked(participantId) {
        this.#clientController.handleFromViewRejectRequest(participantId);
    }

    handleRemoveFriend(friendId) {
        this.#clientController.handleFromViewRemoveFriend(friendId);
    }
}