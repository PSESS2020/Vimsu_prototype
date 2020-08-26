class InputGroupNameView extends WindowView {
    constructor(eventManager) {
        super();

        if (!!InputGroupNameView.instance) {
            return InputGroupNameView.instance;
        }

        InputGroupNameView.instance = this;

        $('#groupName').submit((event) => {
            event.preventDefault();
            let groupName = $('#groupNameInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (groupName.length > 20) {
                return false;
            }

            if (groupName !== '') {
                $('#inputGroupNameModal').modal('hide');
                eventManager.handleInviteFriendsClicked(groupName, "");
                $('#groupNameInput').val('');
            }
        });

        $('#groupName').on('keydown', (event) => {
            event.stopPropagation();
        });
    }
}