/**
 * The Friend Request List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class FriendRequestListView extends WindowView {

    #businessCards;
    #eventManager;

    /**
     * @constructor Creates an instance of FriendRequestListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!FriendRequestListView.instance) {
            return FriendRequestListView.instance;
        }

        FriendRequestListView.instance = this;

        this.#eventManager = eventManager;
    }

    /**
     * Draws friend request list window
     * 
     * @param {BusinessCardClient[]} businessCards requesters' business card
     */
    draw(businessCards) {
        $('#friendRequestListModal .modal-body #nofriendrequest').empty();
        $('#friendRequestListModal .modal-body .list-group').empty()

        if (businessCards.length < 1) {
            $('#friendRequestListModal .modal-body #nofriendrequest').text("No friend request received.")
        }

        this.#businessCards = businessCards;
        this.#businessCards.forEach(businessCard => {
            $('#friendRequestListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent">
                    <div class="row w-100">
                        <div class="col-12 col-sm-2 px-0">
                            <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                        </div>
                        <div class="col-12 col-md-8 text-center text-sm-left">
                            <label class="name lead">${businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")"}</label>
                            <br> 
                            <span class="fa fa-briefcase fa-fw" data-toggle="tooltip" title="" data-original-title=""></span>
                            <span >${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                            <br>
                        </div>
                        <div class="col-12 col-sm-2 col-md-2")>
                            <button id="${"accept" + businessCard.getParticipantId()}" title="Remove from friend request and add to friend list" class="btn btn-lecture ">Accept</button>
                            <button id="${"reject" + businessCard.getParticipantId()}" title="Remove from friend request and reject" class="btn btn-reject" style="margin-top: 10px">Reject</button>
                            <h6 style="margin-top: 9px; display: none;" id="${"accepted" + businessCard.getParticipantId()}">Accepted</h6>
                            <button id="${"rejectdisable" + businessCard.getParticipantId()}" class="btn btn-reject" type ="button" style="margin-top: 10px; cursor: not-allowed; display:none;" disabled>Reject</button>
                            <button id="${"acceptdisable" + businessCard.getParticipantId()}" class="btn btn-lecture" type ="button" style="cursor: not-allowed; display: none;" disabled>Accept</button>
                            <h6 style="margin-top: 20px; margin-left: 4px; display:none" id="${"rejected" + businessCard.getParticipantId()}">Rejected</h6>
                        </div>
                    </div>
                </li>
            `)

            $('#accept' + businessCard.getParticipantId()).off();
            $('#accept' + businessCard.getParticipantId()).click((event) => {
                if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                    $('#notifFriendRequestDiv' + businessCard.getUsername()).hide();

                event.stopPropagation();
                this.#eventManager.handleAcceptRequestClicked(businessCard);
            })

            $('#reject' + businessCard.getParticipantId()).off();
            $('#reject' + businessCard.getParticipantId()).click((event) => {
                if ($('#notifFriendRequestDiv' + businessCard.getUsername()).length)
                    $('#notifFriendRequestDiv' + businessCard.getUsername()).hide();

                event.stopPropagation();
                this.#eventManager.handleRejectRequestClicked(businessCard.getParticipantId());
            })
        })

        $('#friendRequestListModal').modal('show');
    }

    /**
     * Deletes request from friend request list window
     * 
     * @param {String} participantId participant ID
     */
    deleteFriendRequest(participantId) {
        this.#businessCards.forEach(businessCard => {

            if (businessCard.getParticipantId() === participantId) {
                let index = this.#businessCards.indexOf(businessCard);
                this.#businessCards.splice(index, 1);
            }
        });

        this.draw(this.#businessCards);
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
        this.#businessCards.push(businessCard);
        this.draw(this.#businessCards);
    }
}