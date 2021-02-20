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

        $('#rankListButton').off();
        $('#rankListButton').on('click', (event) => {
            eventManager.handleRankListClicked();
        })

        $('#scheduleListButton').off();
        $('#scheduleListButton').on('click', (event) => {
            eventManager.handleScheduleClicked();
        })

        $('#achievementListButton').off();
        $('#achievementListButton').on('click', (event) => {
            eventManager.handleAchievementsClicked();
        })

        $('#friendListButton').off();
        $('#friendListButton').on('click', (event) => {
            eventManager.handleFriendListClicked();
        })

<<<<<<< HEAD
=======
        $('#meetingListButton').off();
        $('#meetingListButton').on('click', (event) => {
            eventManager.handleMeetingListClicked();
        })


>>>>>>> 62e25351... .click() deprecated
        $('#chatListButton').off();
        $('#chatListButton').on('click', (event) => {
            eventManager.handleChatListClicked();
        })

        $('#profileButton').off();
        $('#profileButton').on('click', (event) => {
            eventManager.handleProfileClicked();
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
}