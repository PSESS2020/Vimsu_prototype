/**
 * The Invite Friends Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class InviteFriendsView extends WindowView {

    #businessCards;
    #groupName;
    #limit;
    #chatId;
    #invitedFriends = [];
    #eventManager;

    /**
     * Creates an instance of InviteFriendsView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!InviteFriendsView.instance) {
            return InviteFriendsView.instance;
        }

        InviteFriendsView.instance = this;

        this.#eventManager = eventManager;
    }

    /**
     * Draws invite friends window
     * 
     * @param {?BusinessCardClient[]} businessCards friends' business card
     * @param {String} groupName group chat name
     * @param {?number} limit group chat limit
     * @param {?String} chatId group chat ID
     */
    draw(businessCards, groupName, limit, chatId) {
        $('#inviteFriendsWait').hide();
        this.#invitedFriends = [];

        if (businessCards) {
            if (businessCards.length < 1) {
                $('#inviteFriendsModal .modal-body #nofriendtoinvite').text("No friends to invite.");
                return;
            }

            const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()))
            this.#businessCards = sortedBusinessCards;
            this.#groupName = groupName;
            this.#limit = limit;
            this.#chatId = chatId;

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
                                    <button id="${"invite" + businessCard.getParticipantId()}" style="position: absolute; margin-top: -7px; margin-left: 5px; outline: none; box-shadow: none;" class="btn">
                                        <i class="fa fa-plus-circle fa-2x navbarIcons"></i>
                                    </button>
                                    <button id="${"selected" + businessCard.getParticipantId()}" style="position: absolute; display: none; margin-top: -7px; margin-left: 5px; outline: none; box-shadow: none" class="btn">
                                        <i class="fa fa-check-circle fa-2x navbarIcons"></i>
                                    </button>
                                </div>    
                            </div>
                        </li>
                    </ul>
                `)

                $('#invite' + businessCard.getParticipantId()).on('click', (event) => {
                    this.#invitedFriends.push(businessCard.getParticipantId());
                    $('#invite' + businessCard.getParticipantId()).hide();
                    $('#selected' + businessCard.getParticipantId()).show();
                })

                $('#selected' + businessCard.getParticipantId()).on('click', (event) => {
                    let index = this.#invitedFriends.indexOf(businessCard.getParticipantId());
                    this.#invitedFriends.splice(index, 1);
                    $('#selected' + businessCard.getParticipantId()).hide();
                    $('#invite' + businessCard.getParticipantId()).show();
                })

                $('#createGroupChat').off();
                $('#createGroupChat').on('click', (event) => {
                    if (this.#invitedFriends.length > 0 && this.#invitedFriends.length < this.#limit + 1) {
                        $('#noinvitedfriends').hide();
                        $('#toomanyinvitedfriends').hide();
                        $('#inviteFriendsModal').modal('hide');
                        this.#eventManager.handleCreateGroupChat(this.#groupName, this.#invitedFriends, this.#chatId);
                        this.#invitedFriends = [];
                    } else if (this.#invitedFriends.length < 1) {
                        $('#toomanyinvitedfriends').hide();
                        $('#noinvitedfriends').show();
                    } else {
                        $('#noinvitedfriends').hide();
                        $('#toomanyinvitedfriends').empty();
                        var diff = this.#invitedFriends.length - this.#limit;
                        $('#toomanyinvitedfriends').text("You may only invite " + this.#limit + " friend(s)! Please unselect " + diff + " friend(s).");
                        $('#toomanyinvitedfriends').show();
                    }
                })
            });

            $('#createGroupChat').show();
        } else {
            $('#inviteFriendsModal .modal-body').text("Group name was empty!")
        }
    }

    /**
     * Adds friend to invite friends window
     * 
     * @param {?BusinessCardClient} businessCard friend's business card
     * @param {boolean} hasLeftChat true if friend has left chat, otherwise false
     */
    addToInviteFriends(businessCard, hasLeftChat) {
        if (hasLeftChat) {
            this.#limit = this.#limit + 1;
        }

        if (businessCard) {
            if (!this.#businessCards.includes(businessCard)) {
                this.#businessCards.push(businessCard);
                this.draw(this.#businessCards, this.#groupName, this.#limit, this.#chatId);
            }
        }
    }

    /**
     * Removes participant from invite friends window
     * 
     * @param {?String} participantId participant ID
     * @param {boolean} isMemberOfChat true if participant is member of this chat
     */
    removeFromInviteFriends(participantId, isMemberOfChat) {
        if (isMemberOfChat) {
            this.#limit = this.#limit - 1;
        }

        if (participantId) {
            var found = false;
            this.#businessCards.forEach(businessCard => {
                if (businessCard.getParticipantId() === participantId) {
                    let index = this.#businessCards.indexOf(businessCard);
                    this.#businessCards.splice(index, 1);
                    found = true;
                }
            });

            if (found) {
                this.draw(this.#businessCards, this.#groupName, this.#limit, this.#chatId);
            }
        }
    }
}