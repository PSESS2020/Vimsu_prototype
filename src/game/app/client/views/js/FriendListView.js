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
        $('#friendRequestList').on('click', () => {
            $('#nofriendrequest').empty();
            $('#friendRequestListModal .modal-body .list-group').empty()
            $('#friendRequestListModal').modal('show');
            $('#friendRequestListWait').show();
            this.eventManager.handleFriendRequestListClicked();
        })
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

        const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()))
        this.businessCards = sortedBusinessCards;

        this.businessCards.forEach(businessCard => {
            $('#friendListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread" id="${"friend" + businessCard.getParticipantId()}">
                    <div class="d-flex justify-content-between">
                        <div class="row w-100">
                            <div class="col-2 px-0 my-auto">
                                <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                            </div>
                            <div class="col-9 text-left">
                                <label class="name lead">${businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")"}</label>
                                <div>
                                    <i class="fa fa-briefcase fa-fw mr-1"></i>${businessCard.getJob() + " at " + businessCard.getCompany()}
                                </div>
                                <div>
                                    <i class="fa fa-envelope fa-fw mr-1"></i>${businessCard.getEmail()}
                                </div>
                            </div>
                        </div>
                    
                        <span class="mr-4 mt-n3">
                            <a class="action_button nav-item nav-link" href="" style="position: absolute;" onclick = "" role="button" id="dropdownFriendOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-sort-desc fa-2x navbarIcons"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right" style="min-width: 5px; background-color: rgba(34, 43, 46, 0) !important; border: 0px;" aria-labelledby="dropdownFriendOption">
                                <button class="dropdown-item btn btn-blue" id="${"chatfriend" + businessCard.getParticipantId()}" title="Close friend list and chat now" type="button">Chat</button>
                                <button class="dropdown-item btn btn-white" id="${"delete" + businessCard.getParticipantId()}" title="Remove from friend list" type="button">Unfriend</button>
                            </div>
                        </span>
                    </div>  
                </li>
            `)

            $('#chatfriend' + businessCard.getParticipantId()).off();
            $('#chatfriend' + businessCard.getParticipantId()).on('click', () => {
                this.eventManager.handleRemoveNewFriendNotif(businessCard.getUsername());
                this.eventManager.handleChatNowClicked(businessCard.getParticipantId());
            })

            $('#delete' + businessCard.getParticipantId()).off();
            $('#delete' + businessCard.getParticipantId()).on('click', (event) => {
                this.eventManager.handleRemoveNewFriendNotif(businessCard.getUsername());

                var result = confirm('Are you sure you want to remove ' + businessCard.getUsername() + ' from your friend list?');
                if (result)
                    this.eventManager.handleRemoveFriend(businessCard.getParticipantId());
                else
                    event.stopImmediatePropagation();
            })
        })
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

        $("#friend" + participantId).remove()
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