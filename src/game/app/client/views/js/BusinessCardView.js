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
     * @param {json} languageData language data for businesscard view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!BusinessCardView.instance) {
            return BusinessCardView.instance;
        }

        BusinessCardView.instance = this;

        this.eventManager = eventManager;

        $('#businessCardModal').on('hidden.bs.modal', function (e) {
            $('#businessCardModal .modal-body').empty()
        })
        $('#businessCardText').text(this.languageData.businessCard);
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
        let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                       (businessCard.getForename() + " ") + 
                       (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                       (" (@" + businessCard.getUsername() + ")");

        $('#businessCardWait' + businessCard.getParticipantId()).remove();

        $('#businessCardModal .modal-body').append(`
                
            <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 0.3125rem; text-align: center" title="${fullname}">
            <i class="fa fa-user-circle pr-2 navbarIcons" style="transform: scale(1)"></i>
            ${fullname}</h5>
            </br>
            <table id="${"profile" + businessCard.getParticipantId()}" style = "width:100%; margin-left: 0">
                ${businessCard.getJob() || businessCard.getCompany() ?
                    `<tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 0.9375rem" >${this.languageData.profession}</td>
                        <td style="padding: 0.9375rem">${(businessCard.getJob() ? businessCard.getJob() : this.languageData.unknown) + 
                            " " + this.languageData.at + " " + (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.unknown)}</td>
                    </tr>`
                : 
                    ``
                }
                ${isFriend || !isModerator ?
                    `<tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">${isFriend ? this.languageData.email : this.languageData.rank}</td>
                        <td style="padding: 0.9375rem">${isFriend ? businessCard.getEmail() : rank}</td>
                    </tr>`
                : 
                    ``
                }
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">${this.languageData.role}</td>
                    <td style="padding: 0.9375rem">${isModerator ? this.languageData.roles.moderator : this.languageData.roles.participant}</td>
                </tr>
            </table>
            </br>
            <button id="${"chatnow" + businessCard.getParticipantId()}" title ="${this.languageData.tooltips.chatNow}" class="btn btn-blue mx-auto d-block">Chat</button>
            </br>
        `);

        $('[title="' + fullname + '"]').tooltip(Settings.TOOLTIP_TOP);

        $('#chatnow' + businessCard.getParticipantId()).off();
        $('#chatnow' + businessCard.getParticipantId()).on('click', () => {
            $('#businessCardModal').modal('hide');
            this.eventManager.handleChatNowClicked(businessCard.getParticipantId());
        })

    }
}