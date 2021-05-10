/**
 * The Profile Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ProfileView extends WindowView {
    businessCard;
    isModerator;

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

        this.businessCard = businessCard;
        this.isModerator = isModerator;

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
                            <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                            <td style="padding: 15px">${(this.businessCard.getJob() ? this.businessCard.getJob() : "Unknown") + 
                                " at " + (this.businessCard.getCompany() ? this.businessCard.getCompany() : "Unknown")}</td>
                        </tr>`
                    : 
                        ``
                    }
                    ${businessCard.getEmail() ?
                        `<tr>
                            <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Email</td>
                            <td style="padding: 15px">${this.businessCard.getEmail()}</td>
                        </tr>`
                    : 
                        ``
                    }
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Role</td>
                        <td style="padding: 15px">${this.isModerator ? "Moderator" : "Participant"}</td>
                    </tr>
                </table>
            </div>
        `)
    }
}