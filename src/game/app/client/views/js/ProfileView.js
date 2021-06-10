/**
 * The Profile Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ProfileView extends WindowView {
    /**
     * Creates an instance of ProfileView
     * 
     * @param {json} languageData language data for profile view
     */
    constructor(languageData) {
        super(languageData);

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
        $('#profileModal .modal-header').empty();
        $('#profileModal .modal-body').empty();

        let fullname = (businessCard.getTitle() ? businessCard.getTitle() + " " : "") + 
                       (businessCard.getForename() + " ") + 
                       (businessCard.getSurname() ? businessCard.getSurname() + " " : "") + 
                       (" (@" + businessCard.getUsername() + ")");

        $('#profileModal .modal-header').append(`
            <h5 class="modal-title d-inline-block" id="profileModalTitle" title="${fullname}">
            <i class="fa fa-user-circle pr-2 navbarIcons mr-1" style="transform: scale(1)"></i>${fullname}</h5>
            <button type="button" class="close btn" data-dismiss="modal" aria-label="Close">
                <i class="fa fa-close"></i>
            </button>
        `);

        $('[title="' + fullname + '"]').tooltip(Settings.TOOLTIP_TOP);

        $('#profileModal .modal-body').append(`
            <div class="d-flex" style="overflow-x: auto">
                <table id="profile" class="center ml-auto mr-auto">
                    ${businessCard.getJob() || businessCard.getCompany() ?
                        `<tr>
                            <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 0.9375rem" >${this.languageData.profession}</td>
                            <td style="padding: 0.9375rem">${(businessCard.getJob() ? businessCard.getJob() : this.languageData.unknown) + 
                                " " + this.languageData.at + " "  + (businessCard.getCompany() ? businessCard.getCompany() : this.languageData.unknown)}</td>
                        </tr>`
                    : 
                        ``
                    }
                    ${businessCard.getEmail() ?
                        `<tr>
                            <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">${this.languageData.email}</td>
                            <td style="padding: 0.9375rem">${businessCard.getEmail()}</td>
                        </tr>`
                    : 
                        ``
                    }
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 0.9375rem">${this.languageData.role}</td>
                        <td style="padding: 0.9375rem">${isModerator ? this.languageData.roles.moderator : this.languageData.roles.participant}</td>
                    </tr>
                </table>
            </div>
        `);
    }
}