/**
 * The Friend List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class FriendListView extends WindowView {

    businessCards;
    eventManager;

    /**
     * Creates an instance of FriendListView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for friendList view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!FriendListView.instance) {
            return FriendListView.instance;
        }

        FriendListView.instance = this;

        this.eventManager = eventManager;

        $('#friendRequestList').off();
        $('#friendRequestList').on('click', () => {
            $('#nofriendrequest').empty();
            $('#friendRequestListModal .modal-body .list-group').empty();
            $('#friendRequestListModal').modal('show');
            $('#friendRequestListWait').show();
            this.eventManager.handleFriendRequestListClicked();
        });

        $('#yourFriendListText').text(this.languageData.friendList.friendList);
        $('#requestsText').text(this.languageData.friendList.requests);
        document.getElementById('friendRequestList').title = this.languageData.friendList.tooltips.receivedRequests;
    }

    /**
     * Draws friend list window
     * 
     * @param {BusinessCardClient[]} businessCards friends' business card
     */
    draw(businessCards) {
        $('#friendlistWait').hide();
        $('#nofriend').empty();
        $('#friendListModal .modal-body .list-group').empty();

        if (!this.handleEmptyFriendlist(businessCards)) return;

        const sortedBusinessCards = businessCards.sort((a, b) => a.getForename().localeCompare(b.getForename()));
        this.businessCards = sortedBusinessCards;

        this.businessCards.forEach(businessCard => {
            let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                           (businessCard.getForename() + " ") + 
                           (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                           (" (@" + businessCard.getUsername() + ")");

            $('#friendListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread px-0" id="${"friend" + businessCard.getParticipantId()}">
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
                                                " " + this.languageData.businessCard.at + " " + (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.businessCard.unknown)}
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
                            <div class="col-1 p-0 ml-1 mt-n1">
                                <div class="d-flex flex-row mt-n3">
                                    <a class="action_button nav-item nav-link" href="" onclick = "" role="button" id="dropdownFriendOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa fa-sort-desc fa-2x navbarIcons"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right" style="min-width: 0.3125rem; background-color: transparent; border: 0rem;" aria-labelledby="dropdownFriendOption">
                                        <button class="dropdown-item btn btn-blue" id="${"chatfriend" + businessCard.getParticipantId()}" title="${this.languageData.friendList.tooltips.chatNow}" type="button">
                                            ${this.languageData.friendList.chat}
                                        </button>
                                        <button class="dropdown-item btn btn-white" id="${"delete" + businessCard.getParticipantId()}" title="${this.languageData.friendList.tooltips.removeFriend}" type="button">
                                            ${this.languageData.friendList.unfriend}
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </li>
            `);

            $('[title="' + fullname + '"]').tooltip(Settings.TOOLTIP_TOP);

            $('#chatfriend' + businessCard.getParticipantId()).off();
            $('#chatfriend' + businessCard.getParticipantId()).on('click', () => {
                this.eventManager.handleRemoveNewFriendNotif(businessCard.getUsername());
                this.eventManager.handleChatNowClicked(businessCard.getParticipantId());
            });

            $('#delete' + businessCard.getParticipantId()).off();
            $('#delete' + businessCard.getParticipantId()).on('click', (event) => {
                this.eventManager.handleRemoveNewFriendNotif(businessCard.getUsername());

                var result = confirm(this.languageData.friendList.sureToRemove.replace('usernamePlaceholder', businessCard.getUsername()));
                if (result)
                    this.eventManager.handleRemoveFriend(businessCard.getParticipantId());
                else
                    event.stopImmediatePropagation();
            });
        });
    }

    /**
     * Deletes friend from friend list window
     * 
     * @param {String} participantId participant ID
     */
    deleteFriend(participantId) {
        for (let index = 0; index < this.businessCards.length; index++) {
            if (this.businessCards[index].getParticipantId() === participantId) {
                this.businessCards.splice(index, 1);
                break;
            }
        }

        $("#friend" + participantId).remove();
        if (!this.handleEmptyFriendlist(this.businessCards)) return;
    }

    /**
     * Adds friend to friend list window
     * 
     * @param {BusinessCardClient} businessCard friend's business card
     */
    addToFriendList(businessCard) {
        if (!this.businessCards.includes(businessCard)) {
            this.businessCards.push(businessCard);
            this.draw(this.businessCards);
        }
    }

    /**
     * Displays no friend if there's no friend
     * 
     * @param {Object[]} businessCards business cards
     * @returns false if no friend
     */
    handleEmptyFriendlist(businessCards) {
        if (businessCards && businessCards.length < 1) {
            $('#nofriend').text(this.languageData.friendList.noFriends);
            return false;
        }

        return true;
    }
}