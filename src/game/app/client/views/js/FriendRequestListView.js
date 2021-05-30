/**
 * The Friend Request List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class FriendRequestListView extends WindowView {

    businessCards;
    eventManager;

    /**
     * Creates an instance of FriendRequestListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!FriendRequestListView.instance) {
            return FriendRequestListView.instance;
        }

        FriendRequestListView.instance = this;

        this.eventManager = eventManager;
    }

    /**
     * Draws friend request list window
     * 
     * @param {BusinessCardClient[]} businessCards requesters' business card
     */
    draw(businessCards) {
        $('#friendRequestListWait').hide();
        $('#nofriendrequest').empty();
        $('#friendRequestListModal .modal-body .list-group').empty();

        if (!this.handleEmptyFriendRequestList(businessCards)) return;

        this.businessCards = businessCards;
        this.businessCards.forEach(businessCard => {
            this.appendFriendRequest(businessCard);
        });
    }

    /**
     * Appends new friend request
     * 
     * @param {BusinessCardClient} businessCard 
     */
    appendFriendRequest(businessCard) {
        $('#nofriendrequest').empty();

        let userTitle = businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")";

        $('#friendRequestListModal .modal-body .list-group').prepend(`
            <li class="list-group-item bg-transparent px-0" id="${"friendRequest" + businessCard.getParticipantId()}">
                <div class="d-flex flex-row">
                    <div class="col-2 pr-0 my-auto">
                        <div class="d-flex flex-row justify-content-center align-items-center">
                            <i class="fa fa-user fa-5x navbarIcons"></i>
                        </div>
                    </div>
                    <div class="col-8 pr-0 pl-4">
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <label class="name lead text-truncate" title="${userTitle}" data-toggle="tooltip">${userTitle}</label>
                        </div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <span class="fa fa-briefcase fa-fw mr-2"></span>
                            <span class="small text-truncate">${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                        </div>
                    </div>
                    <div class="col-2 p-0 my-auto">
                        <div class="d-flex flex-column align-items-center">
                            <h6 style="display: none;" id="${"accepted" + businessCard.getParticipantId()}">Accepted</h6>
                            <button id="${"accept" + businessCard.getParticipantId()}" title="Remove from friend request and add to friend list" class="btn btn-blue" style="width: 100%;">Accept</button>
                            <button id="${"reject" + businessCard.getParticipantId()}" title="Remove from friend request and reject" class="btn btn-white" style="margin-top: 0.625rem; width: 100%;">Reject</button>
                            <button id="${"rejectdisable" + businessCard.getParticipantId()}" class="btn btn-white" type ="button" style="margin-top: 0.625rem; cursor: not-allowed; display:none;" disabled>Reject</button>
                            <button id="${"acceptdisable" + businessCard.getParticipantId()}" class="btn btn-blue" type ="button" style="cursor: not-allowed; display: none;" disabled>Accept</button>
                            <h6 class="mt-2 mb-0" style="display:none" id="${"rejected" + businessCard.getParticipantId()}">Rejected</h6>
                        </div>
                    </div>
                </div>
            </li>
        `);

        $('#accept' + businessCard.getParticipantId()).off();
        $('#accept' + businessCard.getParticipantId()).on('click', (event) => {
            if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                $('#notifFriendRequestDiv' + businessCard.getUsername()).remove();

            event.stopPropagation();
            this.eventManager.handleAcceptRequestClicked(businessCard);
        });

        $('#reject' + businessCard.getParticipantId()).off();
        $('#reject' + businessCard.getParticipantId()).on('click', (event) => {
            if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                $('#notifFriendRequestDiv' + businessCard.getUsername()).remove();

            event.stopPropagation();
            this.eventManager.handleRejectRequestClicked(businessCard.getParticipantId());
        });
    }

    /**
     * Deletes request from friend request list window
     * 
     * @param {String} participantId participant ID
     */
    deleteFriendRequest(participantId) {
        this.businessCards.forEach((businessCard, index) => {

            if (businessCard.getParticipantId() === participantId) {
                this.businessCards.splice(index, 1);
            }
        });

        $("#friendRequest" + participantId).remove();
        if (!this.handleEmptyFriendRequestList(this.businessCards)) return;
    }

    /**
     * Updates friend request list window if accept/request button is clicked
     * 
     * @param {String} participantId participant ID
     * @param {boolean} isAccepted true if request accepted, otherwise false
     */
    update(participantId, isAccepted) {
        $('#accept' + participantId).hide();
        $('#reject' + participantId).hide();

        if (isAccepted) {
            $('#accepted' + participantId).show();
            $('#rejectdisable' + participantId).show();

        } else {
            $('#rejected' + participantId).show();
            $('#acceptdisable' + participantId).show();
        }

        setTimeout(() => {
            this.deleteFriendRequest(participantId);
        }, 300);
    }

    /**
     * Adds request to friend request list window
     * 
     * @param {BusinessCardClient} businessCard requester's business card
     */
    addToFriendRequestList(businessCard) {
        if (!this.businessCards.includes(businessCard)) {
            this.businessCards.unshift(businessCard);
            this.appendFriendRequest(businessCard);
        }
    }

    /**
     * Displays no friend request if there's no friend request
     * 
     * @param {Object[]} businessCards business cards
     * @returns false if no friend request
     */
    handleEmptyFriendRequestList(businessCards) {
        if (businessCards && businessCards.length < 1) {
            $('#nofriendrequest').text("No friend request received.");
            return false;
        }

        return true;
    }
}