class BusinessCardView extends WindowView {
    #businessCard;
    #isFriend;

    constructor(businessCard, isFriend) {
        super()
        this.#businessCard = businessCard;
        this.#isFriend = isFriend;
    }

    draw() {
        $('#businessCardModal .modal-header').append(`
            <h5 class="modal-title d-inline-block" id="businessCardModalTitle">${this.#businessCard.getTitle() + " " + this.#businessCard.getForename() + " " + this.#businessCard.getSurname() + " (@" + this.#businessCard.getUsername() + ")"}</h5>
            <button type="button" class="close" style= "position: absolute; right: 1rem;" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>

            <script> 
                function onClick() { 
                    $('#businessCardModal').modal('hide');
                    new EventManager().handleChatNowClicked(${this.#businessCard.getParticipantId()});
                } 
            </script>
        `)

        if(this.#isFriend) {
            $('#businessCardModal .modal-body').append(`
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
            <button id=('${this.#businessCard.getParticipantId()}') class="btn btn-lecture mx-auto d-block" onclick="onClick()">Chat</button>
        `)
        } else {
            $('#businessCardModal .modal-body').append(`
                <table id="profile" style = "color: antiquewhite; width:100%; margin-left: 0">
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                        <td style="padding: 15px">${this.#businessCard.getJob() + " at " + this.#businessCard.getCompany()}</td>
                    </tr>
                </table>
                </br>
                <button id=('${this.#businessCard.getParticipantId()}') class="btn btn-lecture mx-auto d-block" onclick="onClick()">Chat</button>
            `)
        }

        $('#businessCardModal').on('hidden.bs.modal', function (e) {
            $('#businessCardModal .modal-header').empty()
            $('#businessCardModal .modal-body').empty()
        })
    }
}