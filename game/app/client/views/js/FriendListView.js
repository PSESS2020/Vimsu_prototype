class FriendListView extends WindowView {

    #businessCards;

    constructor() {
        super()
    }

    draw(businessCards) {

        const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()))
        this.#businessCards = sortedBusinessCards;

        this.#businessCards.forEach(businessCard => {
            $('#friendListModal .modal-body .list-group').append(`
            <ul id=${"friend" + businessCard.getParticipantId()}>
                <li class="list-group-item bg-transparent" >
                    <div class="row w-100">
                        <div class="col-12 col-sm-2 px-0">
                            <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                        </div>
                        <div class="col-12 col-md-9 text-center text-sm-left">
                            <label class="name lead">${businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")"}</label>
                            <br> 
                            <span class="fa fa-briefcase fa-fw" data-toggle="tooltip" title="" data-original-title=""></span>
                            <span >${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                            <br>
                            <span class="fa fa-envelope fa-fw" data-toggle="tooltip" data-original-title="" title=""></span>
                            <span class="small">${businessCard.getEmail()}</span>
                        </div>
                        <div class="col-12 col-md-1">
                            <!--<button id=('${businessCard.getParticipantId()}') class="btn btn-lecture " onclick="onClick()">Chat</button>-->
                        
                                <a class="action_button nav-item nav-link" href="" style="position: absolute; margin-top: -20px; margin-left: 15px" onclick = "" role="button" id="dropdownFriendOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-sort-desc fa-2x navbarIcons"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" style="min-width: 90px !important; background-color: rgba(34, 43, 46, 0) !important; border: 0px; margin-right: 15px; margin-top: -10px" aria-labelledby="dropdownFriendOption">
                                    <button class="dropdown-item btn btn-lecture" id=${"chat" + businessCard.getParticipantId()} type="button">Chat</button>
                                    <button class="dropdown-item btn btn-reject" style=" width: auto" id=${"delete" + businessCard.getParticipantId()} type="button">Delete</button>
                                </div>
                        </div>    
                    </div>
                </li>
            </ul>

                <script> 
                    $('#chat' + ${businessCard.getParticipantId()}).on('click', function (event) {
                        $('#friendListModal').modal('hide');
                        new EventManager().handleChatNowClicked(${businessCard.getParticipantId()});
                    })

                    $('#delete' + ${businessCard.getParticipantId()}).on('click', function (event) {
                        new EventManager().handleRemoveFriend(${businessCard.getParticipantId()});
                    })
                </script>
            `)
        })

        $('#friendListModal').on('hidden.bs.modal', function (e) {
            $('#friendListModal .modal-body .list-group').empty()
        })
    }

    deleteFriend(participantId) {
        $('#friend' + participantId).empty()
    }

    onclick() {
        return new EventManager().handleFriendListClicked();
    }
}