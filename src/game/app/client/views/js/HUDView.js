/**
 * The Head-Up Display View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class HUDView extends ViewWithLanguageData {

    /**
     * Creates an instance of HUDView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!HUDView.instance) {
            return HUDView.instance;
        }

        HUDView.instance = this;

        $('[data-toggle="tooltip"]').tooltip()

        $('#rankListButton').off();
        $('#rankListButton').on('click', () => {
            $('#rankListModal').modal('show');
            eventManager.handleRankListClicked();
        })

        $('#scheduleListButton').off();
        $('#scheduleListButton').on('click', () => {
            $('#noschedule').empty();
            $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();
            $('#scheduleModal').modal('show');
            $('#scheduleWait').show()
            eventManager.handleScheduleClicked();
        })

        $('#achievementListButton').off();
        $('#achievementListButton').on('click', () => {
            $('#achievementsModal').modal('show');
            eventManager.handleAchievementsClicked();
        })

        $('#friendListButton').off();
        $('#friendListButton').on('click', () => {
            $('#friendListModal').modal('show');
            eventManager.handleFriendListClicked();
        })

        $('#meetingListButton').off();
        $('#meetingListButton').on('click', () => {
            $('#meetingListModal').modal('show');
            eventManager.handleMeetingListClicked();
        })


        $('#chatListButton').off();
        $('#chatListButton').on('click', () => {
            $('#chatListModal').modal('show');
            eventManager.handleChatListClicked();
        })

        $('#profileButton').off();
        $('#profileButton').on('click', () => {
            $('#profileModal').modal('show');
            eventManager.handleProfileClicked();
        })
    }

    /**
     * Draws HUD with passed username
     * 
     * @param {String} username username
     */
    draw(username) {
        $('#profilePlaceholder').empty();
        $('#profilePlaceholder').text(username);
        $('#ranklistText').text(this.languageData.ranklist);
        $('#achievementsText').text(this.languageData.achievements);
        $('#scheduleText').text(this.languageData.schedule);
        $('#meetingsText').text(this.languageData.meetings);
        $('#friendListText').text(this.languageData.friendlist);
        $('#chatsText').text(this.languageData.chats);
        $('#leaveText').text(this.languageData.leave);
        $('#showNotificationText').text(this.languageData.showNotification);
        $('#hideNotificationText').text(this.languageData.hideNotification);
    }

    /**
     * Removes Schedule Button from HUD
     */
    removeScheduleButton() {
        document.getElementById('scheduleListButton').style.display = 'none';
    }
}