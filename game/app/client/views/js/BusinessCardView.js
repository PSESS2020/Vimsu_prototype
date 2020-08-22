if (typeof module === 'object' && typeof exports === 'object') {
    WindowView = require('./WindowView')
}

class BusinessCardView extends WindowView {
    #businessCard;
    #isFriend;
    #rank;
    #isModerator;

    constructor(businessCard, isFriend, rank, isModerator) {
        super()
        this.#businessCard = businessCard;
        this.#isFriend = isFriend;
        this.#rank = rank;
        this.#isModerator = isModerator;

        $('#businessCardModal').on('hidden.bs.modal', function (e) {
            $('#businessCardModal .modal-body').empty()
        })
    }

    draw() {

        $('#businessCardModal .modal-body').append(`
                
                <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 5px; text-align: center">
                <i class="fa fa-user-circle pr-2 navbarIcons" style="transform: scale(1)"></i>
                ${this.#businessCard.getTitle() + " " + this.#businessCard.getForename() + " " + this.#businessCard.getSurname() + " (@" + this.#businessCard.getUsername() + ")"}</h5>
                </br>
                <table id="${"profile" + this.#businessCard.getParticipantId()}" style = "color: antiquewhite; width:100%; margin-left: 0">
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                        <td style="padding: 15px">${this.#businessCard.getJob() + " at " + this.#businessCard.getCompany()}</td>
                    </tr>
        `)

        if (this.#isFriend) {
            $('#businessCardModal .modal-body #profile' + this.#businessCard.getParticipantId()).append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Email</td>
                    <td style="padding: 15px">${this.#businessCard.getEmail()}</td>
                </tr>
            `)
        } else {
            $('#businessCardModal .modal-body #profile' + this.#businessCard.getParticipantId()).append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Rank</td>
                    <td style="padding: 15px">${this.#rank}</td>
                </tr>
            `)
        }

        if (this.#isModerator) {
            $('#businessCardModal .modal-body #profile' + this.#businessCard.getParticipantId()).append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Role</td>
                    <td style="padding: 15px">Moderator</td>
                </tr>
            `)
        } else {
            $('#businessCardModal .modal-body #profile' + this.#businessCard.getParticipantId()).append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Role</td>
                    <td style="padding: 15px">Participant</td>
                </tr>
            `)
        }

        $('#businessCardModal .modal-body').append(`
            </table>
            </br>
            <button id="${"chatnow" + this.#businessCard.getParticipantId()}" title ="Close business card and chat now" class="btn btn-lecture mx-auto d-block">Chat</button>
            </br>
        `)

        $('#chatnow' + this.#businessCard.getParticipantId()).off();
        $('#chatnow' + this.#businessCard.getParticipantId()).click((event) => {
            $('#businessCardModal').modal('hide');
            new EventManager().handleChatNowClicked(this.#businessCard.getParticipantId());
        })

    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = BusinessCardView;
}