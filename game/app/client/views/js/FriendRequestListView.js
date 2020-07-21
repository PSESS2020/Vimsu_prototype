class FriendRequestListView extends WindowView {

    #businessCards;

    constructor() {
        super()
    }

    draw(businessCards) {
        $('#friendListModal .modal-header .dropdown .dropdown-menu .list-group').empty()
        $('#friendListModal .modal-header .modal-title').empty()

        $('#friendListModal .modal-header .modal-title').append(`Friend Request List`)

        this.#businessCards = businessCards;
        this.#businessCards.forEach(businessCard => {
            $('#friendListModal .modal-header .dropdown .dropdown-menu .list-group').append(`
            
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
                            <button id=${"accept" + businessCard.getParticipantId()} class="btn btn-lecture ">Accept</button>
                            <button id=${"reject" + businessCard.getParticipantId()} class="btn btn-reject" style="margin-top: 10px">Reject</button>
                            <h6 style="margin-top: 9px; display: none;" id=${"accepted" + businessCard.getParticipantId()}>Accepted</h6>
                            <button id=${"rejectdisable" + businessCard.getParticipantId()} class="btn btn-reject" type ="button" style="margin-top: 10px; cursor: not-allowed; display:none;" disabled>Reject</button>
                            <button id=${"acceptdisable" + businessCard.getParticipantId()} class="btn btn-lecture" type ="button" style="cursor: not-allowed; display: none;" disabled>Accept</button>
                            <h6 style="margin-top: 20px; margin-left: 4px; display:none" id=${"rejected" + businessCard.getParticipantId()}>Rejected</h6>
                        </div>
                    </div>
                </li>

                <script> 
                    $('#accept' + ${businessCard.getParticipantId()}).on('click', function (event) {
                        event.stopPropagation();
                        new EventManager().handleAcceptRequestClicked(${businessCard.getParticipantId()});
                    })

                    $('#reject' + ${businessCard.getParticipantId()}).on('click', function (event) {
                        event.stopPropagation();
                        new EventManager().handleRejectRequestClicked(${businessCard.getParticipantId()});
                })
                </script>
            `)
        })
        $('#dropdownFriendRequestList').on('hidden.bs.dropdown', function () {
            $('#friendListModal .modal-header .modal-title').empty()
            $('#friendListModal .modal-header .modal-title').append(`Friend List`)
        })

        
    }

    update(participantId, isAccepted) {
        $('#accept' + participantId).hide()
        $('#reject' + participantId).hide()

        if(isAccepted) {
            $('#accepted' + participantId).show()
            $('#rejectdisable' + participantId).show()
        } else {
            $('#acceptdisable' + participantId).show()
            $('#rejected' + participantId).show()
        }
    }

    onclick() {
        return new EventManager().handleFriendRequestListClicked();
    }
}