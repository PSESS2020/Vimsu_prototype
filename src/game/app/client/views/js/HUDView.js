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
     * @param {json} languageData language data for HUD view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!HUDView.instance) {
            return HUDView.instance;
        }

        HUDView.instance = this;

        $('#ranklistText').text(this.languageData.ranklist);
        $('#achievementsText').text(this.languageData.achievements);
        $('#scheduleText').text(this.languageData.schedule);
        $('#meetingsText').text(this.languageData.meetings);
        $('#friendListText').text(this.languageData.friendlist);
        $('#chatsText').text(this.languageData.chats);
        $('#leaveText').text(this.languageData.leave);
        $('#showNotificationText').text(this.languageData.showNotification);
        $('#hideNotificationText').text(this.languageData.hideNotification);
        document.getElementById("points").title = this.languageData.tooltips.points;
        document.getElementById("rank").title = this.languageData.tooltips.rank;
        document.getElementById("profileButton").title = this.languageData.tooltips.profile;
        document.getElementById("rankListButton").title = this.languageData.tooltips.ranklist;
        document.getElementById("achievementListButton").title = this.languageData.tooltips.achievements;
        document.getElementById("scheduleListButton").title = this.languageData.tooltips.schedule;
        document.getElementById("meetingListButton").title = this.languageData.tooltips.meetings;
        document.getElementById("friendListButton").title = this.languageData.tooltips.friendlist;
        document.getElementById("chatListButton").title = this.languageData.tooltips.chats;
        document.getElementById("nav_leave_button").title = this.languageData.tooltips.leave;

        $('[data-toggle="tooltip"]').tooltip();

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

        $('#nav_leave_button').on('click', () => {
            return confirm(this.languageData.confirmLeave);
        })
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