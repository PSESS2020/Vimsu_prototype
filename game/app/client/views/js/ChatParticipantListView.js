class ChatParticipantListView extends Views {

    #usernames;

    constructor() {
        super();
    }

    draw(usernames) {
        $('#chatParticipantListModal .modal-body .list-group').empty()
        const sortedUsernames = usernames.sort((a, b) => a.localeCompare(b))
        this.#usernames = sortedUsernames;

        this.#usernames.forEach(username => {
            $('#chatParticipantListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent chatthread" >
                    <div class="row w-100">
                        <div class="col-12 col-sm-1 px-0">
                            <i class="fa fa-user fa-2x navbarIcons" style="margin-left: 5px" ></i>
                        </div>
                        <div class="col-12 col-md-11 text-center text-sm-left">
                            <label class="name lead">${username}</label>
                        </div>
                    </div>
                </li>

            `)
        })
    }

}