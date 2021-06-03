/**
 * The Input Group Name Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class InputGroupNameView extends WindowView {

    /**
     * Creates an instance of InputGroupNameView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for inputGroupName view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!InputGroupNameView.instance) {
            return InputGroupNameView.instance;
        }

        InputGroupNameView.instance = this;

        $('#createGroupChatText').text(this.languageData.createGroupChat);
        $('#createGroupChatInviteText').text(this.languageData.inviteFriends);
        document.getElementById('inviteFriendsBtn').title = this.languageData.tooltips.inviteFriends;
        document.getElementById('groupNameInput').placeholder = this.languageData.enterGroupName;

        $('#groupName').on('submit', (event) => {
            event.preventDefault();
            let groupName = $('#groupNameInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (groupName.length > 64) {
                return false;
            }

            if (groupName !== '') {
                $('#inputGroupNameModal').modal('hide');
                $('#inviteFriendsModal').modal('show');
                eventManager.handleInviteFriendsClicked(groupName, "");
                $('#groupNameInput').val('');
            }
        });

        $('#groupName').on('keydown', (event) => {
            event.stopPropagation();
        });
    }
}