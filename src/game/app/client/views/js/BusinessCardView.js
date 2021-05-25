/**
 * The Business Card Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class BusinessCardView extends WindowView {
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
        $('#businessCardText').text(this.languageData.businessCard);
        
        let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                       (businessCard.getForename() + " ") + 
                       (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                       (" (@" + businessCard.getUsername() + ")");

        $('#businessCardWait' + businessCard.getParticipantId()).remove();

        $('#businessCardModal .modal-body').append(`
                
            <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 5px; text-align: center">
            <i class="fa fa-user-circle pr-2 navbarIcons" style="transform: scale(1)"></i>
            ${fullname}</h5>
            </br>
            <table id="${"profile" + businessCard.getParticipantId()}" style = "color: antiquewhite; width:100%; margin-left: 0">
                ${businessCard.getJob() || businessCard.getCompany() ?
                    `<tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >${this.languageData.profession}</td>
                        <td style="padding: 15px">${(businessCard.getJob() ? businessCard.getJob() : this.languageData.unknown) + 
                            " " + this.languageData.at + " " + (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.unknown)}</td>
                    </tr>`
                : 
                    ``
                }
                ${isFriend || !isModerator ?
                    `<tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">${isFriend ? this.languageData.email : this.languageData.rank}</td>
                        <td style="padding: 15px">${isFriend ? businessCard.getEmail() : rank}</td>
                    </tr>`
                : 
                    ``
                }
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">${this.languageData.role}</td>
                    <td style="padding: 15px">${isModerator ? this.languageData.roles.moderator : this.languageData.roles.participant}</td>
                </tr>
            </table>
            </br>
            <button id="${"chatnow" + businessCard.getParticipantId()}" title ="${this.languageData.tooltips.chatNow}" class="btn btn-blue mx-auto d-block">Chat</button>
            </br>
        `)

        $('#chatnow' + businessCard.getParticipantId()).off();
        $('#chatnow' + businessCard.getParticipantId()).on('click', () => {
            $('#businessCardModal').modal('hide');
            this.eventManager.handleChatNowClicked(businessCard.getParticipantId());
        })

    }
}