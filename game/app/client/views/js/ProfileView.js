class ProfileView extends WindowView {
    #businessCard;

    constructor() {
        super()
    }

    draw(businessCard) {
        this.#businessCard = businessCard;

        $('#profileModal .modal-header').append(`
            <h5 class="modal-title col-12 text-center" id="profileModalTitle">${this.#businessCard.getTitle() + " " + this.#businessCard.getForename() + " " + this.#businessCard.getSurname() + " (@" + this.#businessCard.getUsername() + ")"}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
            </button>
        `)
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
        `)

        $('#profileModal').on('hidden.bs.modal', function (e) {
            $('#profileModal .modal-head').empty()
            $('#profileModal .modal-body').empty()
        })
    }

    onclick() {
        return new EventManager().handleProfileClicked();
    }
}