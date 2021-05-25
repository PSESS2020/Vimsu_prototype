/**
 * The Profile Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ProfileView extends WindowView {
    /**
     * Creates an instance of ProfileView
     */
    constructor() {
        super();

        if (!!ProfileView.instance) {
            return ProfileView.instance;
        }

        ProfileView.instance = this;
    }

    /**
     * Draws profile window
     * 
     * @param {BusinessCardClient} businessCard own business card
     * @param {boolean} isModerator true if moderator, otherwise false
     */
    draw(businessCard, isModerator) {
        $('#profileWait').hide();
        $('#profileModal .modal-header').empty()
        $('#profileModal .modal-body').empty()

        let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                       (businessCard.getForename() + " ") + 
                       (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                       (" (@" + businessCard.getUsername() + ")");

        $('#profileModal .modal-header').append(`
            <h5 class="modal-title d-inline-block" id="profileModalTitle">
            <i class="fa fa-user-circle pr-2 navbarIcons mr-1" style="transform: scale(1)"></i>${fullname}</h5>
            <button type="button" class="close btn" data-dismiss="modal" aria-label="Close">
                <i class="fa fa-close"></i>
            </button>
        `)

        $('#profileModal .modal-body').append(`
            <div class="d-flex" style="overflow-x: auto">
                <table id="profile" class="center ml-auto mr-auto" style = "color: antiquewhite;">
                    ${businessCard.getJob() || businessCard.getCompany() ?
                        `<tr>
                            <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >${this.languageData.profession}</td>
                            <td style="padding: 15px">${(businessCard.getJob() ? businessCard.getJob() : this.languageData.unknown) + 
                                " " + this.languageData.at + " "  + (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.unknown)}</td>
                        </tr>`
                    : 
                        ``
                    }
                    ${businessCard.getEmail() ?
                        `<tr>
                            <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">${this.languageData.email}</td>
                            <td style="padding: 15px">${businessCard.getEmail()}</td>
                        </tr>`
                    : 
                        ``
                    }
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">${this.languageData.role}</td>
                        <td style="padding: 15px">${isModerator ? this.languageData.roles.moderator : this.languageData.roles.participant}</td>
                    </tr>
                </table>
            </div>
        `)
    }
}