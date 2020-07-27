class BusinessCardView extends WindowView {
    #businessCard;
    #isFriend;
    #rank;

    constructor(businessCard, isFriend, rank) {
        super()
        this.#businessCard = businessCard;
        this.#isFriend = isFriend;
        this.#rank = rank;
    }

    draw() {

        $('#businessCardModal .modal-body').append(`
                <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 5px; text-align: center">${this.#businessCard.getTitle() + " " + this.#businessCard.getForename() + " " + this.#businessCard.getSurname() + " (@" + this.#businessCard.getUsername() + ")"}</h5>
                </br>
                <table id="profile" style = "color: antiquewhite; width:100%; margin-left: 0">
                    <tr>
                        <td style="border-right: 1pt solid antiquewhite; text-align: right; padding: 15px" >Profession</td>
                        <td style="padding: 15px">${this.#businessCard.getJob() + " at " + this.#businessCard.getCompany()}</td>
                    </tr>
        `)

        if(this.#isFriend) {
            $('#businessCardModal .modal-body #profile').append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Email</td>
                    <td style="padding: 15px">${this.#businessCard.getEmail()}</td>
                </tr>
            `)
        } else {
            $('#businessCardModal .modal-body #profile').append(`
                <tr>
                    <td style="border-right: 1pt solid antiquewhite ; text-align: right; padding: 15px">Rank</td>
                    <td style="padding: 15px">${this.#rank}</td>
                </tr>
            `)
        }
                    
        $('#businessCardModal .modal-body').append(`
            </table>
            </br>
            <button id="${"chatfriend" + this.#businessCard.getParticipantId()}" class="btn btn-lecture mx-auto d-block">Chat</button>
            </br>
            <script> 
                $('#chatfriend' + '${this.#businessCard.getParticipantId()}').on('click', function (event) {
                    $('#businessCardModal').modal('hide');
                    new EventManager().handleChatNowClicked('${this.#businessCard.getParticipantId()}', true);
                })
            </script>

        `)
    
        $('#businessCardModal').on('hidden.bs.modal', function (e) {
            $('#businessCardModal .modal-body').empty()
        })
    }
}