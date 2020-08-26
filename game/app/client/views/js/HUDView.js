class HUDView extends Views {

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

    drawProfile(username) {
        $('#profilePlaceholder').empty();
        $('#profilePlaceholder').text(username);
    }
}