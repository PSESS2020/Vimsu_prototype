class BusinessCardView extends WindowView {
    #businessCard;
    #isFriend;

    constructor(businessCard, isFriend) {
        super()
        this.#businessCard = businessCard;
        this.#isFriend = isFriend;
    }

    draw() {
        $('#profileModal .modal-header').append(`
            <h5 class="modal-title col-12 text-center" id="profileModalTitle">${this.#businessCard.getTitle() + " " + this.#businessCard.getForename() + " " + this.#businessCard.getSurname() + " (@" + this.#businessCard.getUsername() + ")"}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `)

        if(this.#isFriend) {
            $('#profileModal .modal-body').append(`
                <table id="profile" style = "color: antiquewhite; width:100%; margin-left: 0">
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                        <td style="padding: 15px">${this.#businessCard.getJob() + " at " + this.#businessCard.getCompany()}</td>
                    </tr>
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Email</td>
                        <td style="padding: 15px">${this.#businessCard.getEmail()}</td>
                    </tr>
            </table>
            </br>
            <button id=('${this.#businessCard.getParticipantId()}') class="btn btn-lecture mx-auto d-block" onclick="">Chat</button>
        `)
        } else {
            $('#profileModal .modal-body').append(`
                <table id="profile" style = "color: antiquewhite; width:100%; margin-left: 0">
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                        <td style="padding: 15px">${this.#businessCard.getJob() + " at " + this.#businessCard.getCompany()}</td>
                    </tr>
                </table>
                </br>
                <button id=('${this.#businessCard.getParticipantId()}') class="btn btn-lecture mx-auto d-block" onclick="(this).onclick()">Chat</button>
            `)
        }

        $('#profileModal').on('hidden.bs.modal', function (e) {
            $('#profileModal .modal-head').empty()
            $('#profileModal .modal-body').empty()
        })
    }

    onclick() {
        
    }
}