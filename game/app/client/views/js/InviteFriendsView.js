class InviteFriendsView extends WindowView {

    #businessCards;

    constructor() {
        super()
    }

    draw(businessCards, groupName, limit, chatId) {
        $('#inviteFriendsModal .modal-body .list-group').empty()
        $('#inviteFriendsModal .modal-body #nofriendtoinvite').empty()
        $('#createGroupChat').show();

        if (businessCards) {
            if (businessCards.length < 1) {
                $('#inviteFriendsModal .modal-body #nofriendtoinvite').text("No friends to invite.");
                $('#createGroupChat').hide();
            }

            const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()))
            this.#businessCards = sortedBusinessCards;

            $('#noinvitedfriends').hide();
            $('#toomanyinvitedfriends').hide();
            $('#toomanyinvitedfriends').empty();

            this.#businessCards.forEach(businessCard => {
                $('#inviteFriendsModal .modal-body .list-group').append(`
                <ul id="${"invitefriend" + businessCard.getParticipantId()}">
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
                                <button id="${"invite" + businessCard.getParticipantId()}" style="position: absolute; margin-top: -7px; margin-left: 5px" class="btn">
                                    <i class="fa fa-plus-circle fa-2x navbarIcons"></i>
                                </button>
                                <button id="${"selected" + businessCard.getParticipantId()}" style="position: absolute; display: none; margin-top: -7px; margin-left: 5px" class="btn">
                                    <i class="fa fa-check-circle fa-2x navbarIcons"></i>
                                </button>
                            </div>    
                        </div>
                    </li>
                </ul>

                    <script> 
                        var invitedFriends = [];

                        $('#invite' + '${businessCard.getParticipantId()}').on('click', function (event) {
                            invitedFriends.push('${businessCard.getParticipantId()}');
                            $('#invite' + '${businessCard.getParticipantId()}').hide();
                            $('#selected' + '${businessCard.getParticipantId()}').show();
                        })

                        $('#selected' + '${businessCard.getParticipantId()}').on('click', function (event) {
                            let index = invitedFriends.indexOf('${businessCard.getParticipantId()}');
                            invitedFriends.splice(index, 1);
                            $('#selected' + '${businessCard.getParticipantId()}').hide();
                            $('#invite' + '${businessCard.getParticipantId()}').show();
                        })

                        $('#createGroupChat').off();
                        $('#createGroupChat').on('click', function (event) {
                            if(invitedFriends.length > 0 && invitedFriends.length < ${limit} + 1) {
                                $('#inviteFriendsModal').modal('hide');
                                new EventManager().handleCreateGroupChat('${groupName}', invitedFriends, '${chatId}');
                            } else if (invitedFriends.length < 1) {
                                $('#noinvitedfriends').show();
                            } else {
                                var diff = invitedFriends.length - ${limit};
                                $('#toomanyinvitedfriends').text("You may only invite " + ${limit} + " friend(s)! Please unselect " + diff + " friend(s).");
                                $('#toomanyinvitedfriends').show()
                            }

                        })
                    </script>
                `)
            });

        } else {
            $('#inviteFriendsModal .modal-body').text("Group name was empty!")
        }


    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = InviteFriendsView;
}