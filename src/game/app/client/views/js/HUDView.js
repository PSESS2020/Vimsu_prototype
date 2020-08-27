/**
 * The Head-Up Display View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class HUDView extends Views {

    /**
     * @constructor Creates an instance of HUDView
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
        $('#rankListButton').click(() => {
            eventManager.handleRankListClicked();
        })

        $('#scheduleListButton').off();
        $('#scheduleListButton').click(() => {
            eventManager.handleScheduleClicked();
        })

        $('#achievementListButton').off();
        $('#achievementListButton').click(() => {
            eventManager.handleAchievementsClicked();
        })

        $('#friendListButton').off();
        $('#friendListButton').click(() => {
            eventManager.handleFriendListClicked();
        })

        $('#chatListButton').off();
        $('#chatListButton').click(() => {
            eventManager.handleChatListClicked();
        })

        $('#profileButton').off();
        $('#profileButton').click(() => {
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