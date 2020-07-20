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
            
                <li class="list-group-item bg-transparent">
                    <div class="row w-100">
                        <div class="col-12 col-sm-2 px-0">
                            <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                        </div>
                        <div class="col-12 col-md-8 text-center text-sm-left">
                            <label class="name lead">${businessCard.getTitle() + " " + businessCard.getForename() + " " + businessCard.getSurname() + " (@" + businessCard.getUsername() + ")"}</label>
                            <br> 
                            <span class="fa fa-briefcase fa-fw" data-toggle="tooltip" title="" data-original-title="5842 Hillcrest Rd"></span>
                            <span >${businessCard.getJob() + " at " + businessCard.getCompany()}</span>
                            <br>
                            <span class="fa fa-envelope fa-fw" data-toggle="tooltip" data-original-title="" title=""></span>
                            <span class="small">${businessCard.getEmail()}</span>
                        </div>
                        <div class="col-12 col-sm-2 col-md-2">
                            <button id=('${businessCard.getParticipantId()}') class="btn btn-lecture " onclick="onClick()">Chat</button>
                        </div>
                                
                    </div>
                </li>

                <script> 
                    function onClick() { 
                        $('#businessCardModal').modal('hide');
                        new EventManager().handleChatNowClicked(${businessCard.getParticipantId()});
                    } 
                </script>
            `)
        })

        $('#friendListModal').on('hidden.bs.modal', function (e) {
            $('#friendListModal .modal-body .list-group').empty()
        })
    }

    onclick() {
        return new EventManager().handleFriendListClicked();
    }
}