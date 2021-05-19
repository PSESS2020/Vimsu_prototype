/**
 * The Head-Up Display View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class HUDView extends Views {

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
     * Draws text of whole HUD in passed language
     * 
     * @param {json} hudLanguageData language data for HUD
     */
    setLanguageData(hudLanguageData) {
        $('#ranklistText').text(hudLanguageData.ranklist);
        $('#achievementsText').text(hudLanguageData.achievements);
        $('#scheduleText').text(hudLanguageData.schedule);
        $('#meetingsText').text(hudLanguageData.meetings);
        $('#friendListText').text(hudLanguageData.friendlist);
        $('#chatsText').text(hudLanguageData.chats);
        $('#leaveText').text(hudLanguageData.leave);
        $('#showNotificationText').text(hudLanguageData.showNotification);
        $('#hideNotificationText').text(hudLanguageData.hideNotification);
    }

    /**
     * Draws profile username
     * 
     * @param {String} username username
     */
    drawProfile(username) {
        $('#profilePlaceholder').empty();
        $('#profilePlaceholder').text(username);
    }

    /**
     * Removes Schedule Button from HUD
     */
    removeScheduleButton() {
        document.getElementById('scheduleListButton').style.display = 'none';
    }
}