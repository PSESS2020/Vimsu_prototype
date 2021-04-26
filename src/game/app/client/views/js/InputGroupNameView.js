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
     */
    constructor(eventManager) {
        super();

        if (!!InputGroupNameView.instance) {
            return InputGroupNameView.instance;
        }

        InputGroupNameView.instance = this;

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