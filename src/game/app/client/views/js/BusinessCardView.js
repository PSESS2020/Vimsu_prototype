/**
 * The Business Card Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class BusinessCardView extends WindowView {
    businessCard;
    isFriend;
    rank;
    isModerator;
    eventManager;

    /**
     * Creates an instance of BusinessCardView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!BusinessCardView.instance) {
            return BusinessCardView.instance;
        }

        BusinessCardView.instance = this;

        this.eventManager = eventManager;

        $('#businessCardModal').on('hidden.bs.modal', function (e) {
            $('#businessCardModal .modal-body').empty()
        })
    }

    /**
     * Draws business card window
     * 
     * @param {BusinessCardClient} businessCard business card
     * @param {boolean} isFriend true if friend, otherwise false
     * @param {?number} rank rank
     * @param {boolean} isModerator true if moderator, otherwise false
     */
    draw(businessCard, isFriend, rank, isModerator) {
        this.businessCard = businessCard;
        this.isFriend = isFriend;
        this.rank = rank;
        this.isModerator = isModerator;

        $('#businessCardWait' + this.businessCard.getParticipantId()).remove();

        $('#businessCardModal .modal-body').append(`
                
            <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 0.3125rem; text-align: center">
            <i class="fa fa-user-circle pr-2 navbarIcons" style="transform: scale(1)"></i>
            ${this.businessCard.getTitle() + " " + this.businessCard.getForename() + " " + this.businessCard.getSurname() + " (@" + this.businessCard.getUsername() + ")"}</h5>
            </br>
            <table id="${"profile" + this.businessCard.getParticipantId()}" style = "width:100%; margin-left: 0">
                <tr>
                    <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 0.9375rem" >Profession</td>
                    <td style="padding: 0.9375rem">${this.businessCard.getJob() + " at " + this.businessCard.getCompany()}</td>
                </tr>
                ${this.isFriend || !this.isModerator ?
                `<tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">${this.isFriend ? "Email" : "Rank"}</td>
                    <td style="padding: 0.9375rem">${this.isFriend ? this.businessCard.getEmail() : this.rank}</td>
                </tr>`
                : ``
                }
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">Role</td>
                    <td style="padding: 0.9375rem">${this.isModerator ? "Moderator" : "Participant"}</td>
                </tr>
            </table>
            </br>
            <button id="${"chatnow" + this.businessCard.getParticipantId()}" title ="Close business card and chat now" class="btn btn-blue mx-auto d-block">Chat</button>
            </br>
        `)

        $('#chatnow' + this.businessCard.getParticipantId()).off();
        $('#chatnow' + this.businessCard.getParticipantId()).on('click', (event) => {
            $('#businessCardModal').modal('hide');
            this.eventManager.handleChatNowClicked(this.businessCard.getParticipantId());
        })

    }
}