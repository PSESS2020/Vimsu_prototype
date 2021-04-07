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
        $('#friendRequestListModal .modal-body .list-group').empty()

        if (!this.handleEmptyFriendRequestList(businessCards)) return

        this.businessCards = businessCards;
        this.businessCards.forEach(businessCard => {
            this.appendFriendRequest(businessCard);
        })
    }

    /**
     * Appends new friend request
     * 
     * @param {BusinessCardClient} businessCard 
     */
    appendFriendRequest(businessCard) {
        $('#nofriendrequest').empty();

        $('#friendRequestListModal .modal-body .list-group').prepend(`
            <li class="list-group-item bg-transparent" id="${"friendRequest" + businessCard.getParticipantId()}">
                <div class="row w-100">
                    <div class="col-2 px-0">
                        <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                    </div>
                    <div class="col-8 text-left">
                        <label class="name lead">${businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")"}</label>
                        <br> 
                        <span class="fa fa-briefcase fa-fw" data-toggle="tooltip" title="" data-original-title=""></span>
                        <span >${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                        <br>
                    </div>
                    <div class="col-2")>
                        <button id="${"accept" + businessCard.getParticipantId()}" title="Remove from friend request and add to friend list" class="btn btn-blue " style="width: 75px;">Accept</button>
                        <button id="${"reject" + businessCard.getParticipantId()}" title="Remove from friend request and reject" class="btn btn-white" style="margin-top: 10px; width: 75px;">Reject</button>
                        <h6 style="margin-top: 9px; display: none;" id="${"accepted" + businessCard.getParticipantId()}">Accepted</h6>
                        <button id="${"rejectdisable" + businessCard.getParticipantId()}" class="btn btn-white" type ="button" style="margin-top: 10px; cursor: not-allowed; display:none;" disabled>Reject</button>
                        <button id="${"acceptdisable" + businessCard.getParticipantId()}" class="btn btn-blue" type ="button" style="cursor: not-allowed; display: none;" disabled>Accept</button>
                        <h6 style="margin-top: 20px; margin-left: 4px; display:none" id="${"rejected" + businessCard.getParticipantId()}">Rejected</h6>
                    </div>
                </div>
            </li>
        `)

        $('#accept' + businessCard.getParticipantId()).off();
        $('#accept' + businessCard.getParticipantId()).on('click', (event) => {
            if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                $('#notifFriendRequestDiv' + businessCard.getUsername()).remove();

            event.stopPropagation();
            this.eventManager.handleAcceptRequestClicked(businessCard);
        })

        $('#reject' + businessCard.getParticipantId()).off();
        $('#reject' + businessCard.getParticipantId()).on('click', (event) => {
            if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                $('#notifFriendRequestDiv' + businessCard.getUsername()).remove();

            event.stopPropagation();
            this.eventManager.handleRejectRequestClicked(businessCard.getParticipantId());
        })
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

        $("#friendRequest" + participantId).remove()
        if (!this.handleEmptyFriendRequestList(this.businessCards)) return;
    }

    /**
     * Updates friend request list window if accept/request button is clicked
     * 
     * @param {String} participantId participant ID
     * @param {boolean} isAccepted true if request accepted, otherwise false
     */
    update(participantId, isAccepted) {
        $('#accept' + participantId).hide()
        $('#reject' + participantId).hide()

        if (isAccepted) {
            $('#accepted' + participantId).show()
            $('#rejectdisable' + participantId).show()

        } else {
            $('#rejected' + participantId).show()
            $('#acceptdisable' + participantId).show()
        }

        setTimeout(() => {
            this.deleteFriendRequest(participantId);
        }, 300)
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
            $('#nofriendrequest').text("No friend request received.")
            return false;
        }

        return true;
    }
}