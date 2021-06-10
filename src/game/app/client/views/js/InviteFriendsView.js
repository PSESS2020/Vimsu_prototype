/**
 * The Invite Friends Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class InviteFriendsView extends WindowView {

    businessCards;
    groupName;
    limit;
    chatId;
    invitedFriends = [];
    eventManager;

    /**
     * Creates an instance of InviteFriendsView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for inviteFriends view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!InviteFriendsView.instance) {
            return InviteFriendsView.instance;
        }

        InviteFriendsView.instance = this;

        this.eventManager = eventManager;

        $('#inviteFriendsText').text(this.languageData.chats.inviteFriends);
        $('#selectAtLeastOneText').text(this.languageData.chats.selectAtLeastOne);
        $('#inviteFriendsToChatText').text(this.languageData.chats.tooltips.inviteFriends);
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
        $('#inviteFriendsModal .modal-body .list-group').empty();
        $('#nofriendtoinvite').empty();
        $('#noinvitedfriends').hide();
        $('#toomanyinvitedfriends').hide();
        $('#toomanyinvitedfriends').empty();
        $('#createGroupChat').hide();

        this.invitedFriends = [];

        if (businessCards) {
            if (!this.handleEmptyInviteFriends(businessCards)) return;

            const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()));
            this.businessCards = sortedBusinessCards;
            this.groupName = groupName;
            this.limit = limit;
            this.chatId = chatId;

            this.businessCards.forEach(businessCard => {
                let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                               (businessCard.getForename() + " ") + 
                               (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                               (" (@" + businessCard.getUsername() + ")");
                $('#inviteFriendsModal .modal-body .list-group').append(`
                    <ul id="${"invitefriend" + businessCard.getParticipantId()}">
                        <li class="list-group-item bg-transparent px-0" >
                            <div class="d-flex flex-row">
                                <div class="col-2 pr-0 my-auto">
                                    <div class="d-flex flex-row justify-content-center align-items-center">
                                        <i class="fa fa-user fa-5x navbarIcons"></i>
                                    </div>
                                </div>
                                <div class="col-9 pr-0 pl-4">
                                    <div class="d-flex flex-row justify-content-start align-items-center">
                                        <label class="name lead text-truncate" title="${fullname}">${fullname}</label>
                                    </div>
                                    <div class="d-flex flex-row justify-content-start align-items-center">
                                        ${businessCard.getJob() || businessCard.getCompany() ?
                                            `<div>
                                                <i class="fa fa-briefcase fa-fw mr-2"></i>${(businessCard.getJob() ? businessCard.getJob() : this.languageData.businessCard.unknown) + 
                                                    " " + this.languageData.businessCard.at + " " + 
                                                    (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.businessCard.unknown)}
                                            </div>`
                                        : 
                                            ``
                                        }
                                    </div>
                                    <div class="d-flex flex-row justify-content-start align-items-center">
                                        ${businessCard.getEmail() ?
                                            `<div>
                                                <i class="fa fa-envelope fa-fw mr-2"></i>${businessCard.getEmail()}
                                            </div>`
                                        : 
                                            ``
                                        }
                                    </div>
                                </div>
                                <div class="col-1 p-0 ml-n1">
                                    <div class="d-flex flex-row mt-n2">
                                        <button id="${"invite" + businessCard.getParticipantId()}" style="outline: none; box-shadow: none;" class="btn">
                                            <i class="fa fa-plus-circle fa-2x navbarIcons"></i>
                                        </button>
                                        <button id="${"selected" + businessCard.getParticipantId()}" style="outline: none; box-shadow: none" class="btn">
                                            <i class="fa fa-check-circle fa-2x navbarIcons"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                `);

                $('[title="' + fullname + '"]').tooltip(Settings.TOOLTIP_TOP);

                $('#invite' + businessCard.getParticipantId()).on('click', () => {
                    this.invitedFriends.push(businessCard.getParticipantId());
                    $('#invite' + businessCard.getParticipantId()).hide();
                    $('#selected' + businessCard.getParticipantId()).show();
                });

                $('#selected' + businessCard.getParticipantId()).on('click', () => {
                    let index = this.invitedFriends.indexOf(businessCard.getParticipantId());
                    this.invitedFriends.splice(index, 1);
                    $('#selected' + businessCard.getParticipantId()).hide();
                    $('#invite' + businessCard.getParticipantId()).show();
                });

                $('#createGroupChat').off();
                $('#createGroupChat').on('click', () => {
                    if (this.invitedFriends.length > 0 && this.invitedFriends.length < this.limit + 1) {
                        $('#noinvitedfriends').hide();
                        $('#toomanyinvitedfriends').hide();
                        $('#inviteFriendsModal').modal('hide');
                        this.eventManager.handleCreateGroupChat(this.groupName, this.invitedFriends, this.chatId);
                        this.invitedFriends = [];
                    } else if (this.invitedFriends.length < 1) {
                        $('#toomanyinvitedfriends').hide();
                        $('#noinvitedfriends').show();
                    } else {
                        $('#noinvitedfriends').hide();
                        $('#toomanyinvitedfriends').empty();
                        var diff = this.invitedFriends.length - this.limit;
                        $('#toomanyinvitedfriends').text(this.languageData.chats.tooManyFriends.replace('limit', this.limit).replace('diff', diff));
                        $('#toomanyinvitedfriends').show();
                    }
                });
            });

            $('#createGroupChat').show();
        } else {
            $('#inviteFriendsModal .modal-body').text(this.languageData.chats.emptyGroupName);
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
            this.limit = this.limit + 1;
        }

        if (businessCard) {
            if (!this.businessCards.includes(businessCard)) {
                this.businessCards.push(businessCard);
                this.draw(this.businessCards, this.groupName, this.limit, this.chatId);
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
            this.limit = this.limit - 1;
        }

        if (participantId) {
            var found = false;
            for (let index = 0; index < this.businessCards.length; index++) {
                if (this.businessCards[index].getParticipantId() === participantId) {
                    this.businessCards.splice(index, 1);
                    found = true;
                    break;
                }
            }

            if (found) {
                $("#invitefriend" + participantId).remove();
                if (!this.handleEmptyInviteFriends(this.businessCards)) return;
            }
        }
    }

    /**
   * Displays no friend if there's no friend to invite
   * 
   * @param {Object[]} businessCards business cards
   * @returns false if no friend to invite
   */
    handleEmptyInviteFriends(businessCards) {
        if (businessCards && businessCards.length < 1) {
            $('#nofriendtoinvite').text(this.languageData.chats.noFriends);
            return false;
        }

        return true;
    }
}