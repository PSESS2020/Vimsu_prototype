/**
 * The Friend List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class FriendListView extends WindowView {

    businessCards;
    eventManager;

    /**
     * Creates an instance of FriendListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!FriendListView.instance) {
            return FriendListView.instance;
        }

        FriendListView.instance = this;

        this.eventManager = eventManager;

        $('#friendRequestList').off();
        $('#friendRequestList').on('click', (event) => {
            $('#nofriendrequest').empty();
            $('#friendRequestListModal .modal-body .list-group').empty();
            $('#friendRequestListModal').modal('show');
            $('#friendRequestListWait').show();
            this.eventManager.handleFriendRequestListClicked();
        });
    }

    /**
     * Draws friend list window
     * 
     * @param {BusinessCardClient[]} businessCards friends' business card
     */
    draw(businessCards) {
        $('#friendlistWait').hide();
        $('#nofriend').empty();
        $('#friendListModal .modal-body .list-group').empty();

        if (!this.handleEmptyFriendlist(businessCards)) return;

        const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()));
        this.businessCards = sortedBusinessCards;

        this.businessCards.forEach(businessCard => {
            let userTitle = businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")";

            $('#friendListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread px-0" id="${"friend" + businessCard.getParticipantId()}">
                    <div class="d-flex flex-row">
                            <div class="col-2 pr-0 my-auto">
                                <div class="d-flex flex-row justify-content-center align-items-center">
                                    <i class="fa fa-user fa-5x navbarIcons"></i>
                                </div>
                            </div>
                            <div class="col-9 pr-0 pl-4">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <label class="name lead text-truncate" title="${userTitle}" data-toggle="tooltip">${userTitle}</label>
                                </div>
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="fa fa-briefcase fa-fw mr-2"></span>
                                    <span class"text-truncate">${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                                </div>
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="fa fa-envelope fa-fw mr-2"></span>
                                    <span class="small text-truncate">${businessCard.getEmail()}</span>
                                </div>
                            </div>
                            <div class="col-1 p-0 ml-1 mt-n1">
                                <div class="d-flex flex-row mt-n3">
                                        <a class="action_button nav-item nav-link" href="" onclick = "" role="button" id="dropdownFriendOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa fa-sort-desc fa-2x navbarIcons"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right" style="min-width: 0.3125rem; background-color: rgba(34, 43, 46, 0) !important; border: 0rem;" aria-labelledby="dropdownFriendOption">
                                            <button class="dropdown-item btn btn-blue" id="${"chatfriend" + businessCard.getParticipantId()}" title="Close friend list and chat now" type="button">Chat</button>
                                            <button class="dropdown-item btn btn-white" id="${"delete" + businessCard.getParticipantId()}" title="Remove from friend list" type="button">Unfriend</button>
                                        </div>
                                </div>
                            </div>
                    </div>
                </li>
            `);

            $('#chatfriend' + businessCard.getParticipantId()).off();
            $('#chatfriend' + businessCard.getParticipantId()).on('click', (event) => {
                if ($('#notifFriendDiv' + businessCard.getUsername()).length)
                    $('#notifFriendDiv' + businessCard.getUsername()).remove();
                this.eventManager.handleChatNowClicked(businessCard.getParticipantId());
            });

            $('#delete' + businessCard.getParticipantId()).off();
            $('#delete' + businessCard.getParticipantId()).on('click', (event) => {
                if ($('#notifFriendDiv' + businessCard.getUsername()).length)
                    $('#notifFriendDiv' + businessCard.getUsername()).remove();

                var result = confirm('Are you sure you want to remove ' + businessCard.getUsername() + ' from your friend list?');
                if (result)
                    this.eventManager.handleRemoveFriend(businessCard.getParticipantId());
                else
                    event.stopImmediatePropagation();
            });
        });
    }

    /**
     * Deletes friend from friend list window
     * 
     * @param {String} participantId participant ID
     */
    deleteFriend(participantId) {
        this.businessCards.forEach((businessCard, index) => {

            if (businessCard.getParticipantId() === participantId) {
                this.businessCards.splice(index, 1);
            }
        });

        $("#friend" + participantId).remove();
        if (!this.handleEmptyFriendlist(this.businessCards)) return;
    }

    /**
     * Adds friend to friend list window
     * 
     * @param {BusinessCardClient} businessCard friend's business card
     */
    addToFriendList(businessCard) {
        if (!this.businessCards.includes(businessCard)) {
            this.businessCards.push(businessCard);
            this.draw(this.businessCards);
        }
    }

    /**
     * Displays no friend if there's no friend
     * 
     * @param {Object[]} businessCards business cards
     * @returns false if no friend
     */
    handleEmptyFriendlist(businessCards) {
        if (businessCards && businessCards.length < 1) {
            $('#nofriend').text("No friend is found. Chat with others and send some friend requests!");
            return false;
        }

        return true;
    }
}