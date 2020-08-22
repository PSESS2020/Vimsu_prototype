class FriendListView extends WindowView {

    #businessCards;

    constructor() {
        super();
    }

    draw(businessCards) {
        $('#friendListModal .modal-body #nofriend').empty();
        $('#friendListModal .modal-body .list-group').empty();

        if (businessCards.length < 1) {
            $('#friendListModal .modal-body #nofriend').text("No friend is found. Chat with others and send some friend requests!")
        }

        const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()))
        this.#businessCards = sortedBusinessCards;

        this.#businessCards.forEach(businessCard => {
            $('#friendListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread" >
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
                                    <a class="action_button nav-item nav-link" href="" style="position: absolute; margin-top: -20px; margin-left: 15px" onclick = "" role="button" id="dropdownFriendOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-sort-desc fa-2x navbarIcons"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" style="min-width: 90px !important; background-color: rgba(34, 43, 46, 0) !important; border: 0px; margin-right: 15px; margin-top: -10px" aria-labelledby="dropdownFriendOption">
                                    <button class="dropdown-item btn btn-lecture" id="${"chatfriend" + businessCard.getParticipantId()}" title="Close friend list and chat now" type="button">Chat</button>
                                    <button class="dropdown-item btn btn-reject" style=" width: auto" id="${"delete" + businessCard.getParticipantId()}" title="Remove from friend list" type="button">Unfriend</button>
                                </div>
                        </div>    
                    </div>
                </li>
            `)

            $('#chatfriend' + businessCard.getParticipantId()).off();
            $('#chatfriend' + businessCard.getParticipantId()).click((event) => {
                if ($('#notifFriendDiv' + businessCard.getUsername()).length)
                    $('#notifFriendDiv' + businessCard.getUsername()).hide();
                new EventManager().handleChatNowClicked(businessCard.getParticipantId());
            })

            $('#delete' + businessCard.getParticipantId()).off();
            $('#delete' + businessCard.getParticipantId()).click((event) => {
                if ($('#notifFriendDiv' + businessCard.getUsername()).length)
                    $('#notifFriendDiv' + businessCard.getUsername()).hide();

                var result = confirm('Are you sure you want to remove ' + businessCard.getUsername() + ' from your friend list?');
                if(result)
                    new EventManager().handleRemoveFriend(businessCard.getParticipantId());
                else
                    event.stopImmediatePropagation();
            })
        })

        $('#friendListModal').modal('show');
    }

    deleteFriend(participantId) {
        this.#businessCards.forEach(businessCard => {

            if (businessCard.getParticipantId() === participantId) {
                let index = this.#businessCards.indexOf(businessCard);
                this.#businessCards.splice(index, 1);
            }
        });

        this.draw(this.#businessCards);
    }

    addToFriendList(businessCard) {
        this.#businessCards.push(businessCard);
        this.draw(this.#businessCards);
    }

    onclick() {
        return new EventManager().handleFriendListClicked();
    }
}