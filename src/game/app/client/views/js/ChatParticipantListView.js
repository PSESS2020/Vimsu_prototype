/**
 * The Group Chat Participant List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatParticipantListView extends Views {

    #usernames;

    /**
     * @constructor Creates an instance of ChatParticipantListView
     */
    constructor() {
        super();

        if (!!ChatParticipantListView.instance) {
            return ChatParticipantListView.instance;
        }

        ChatParticipantListView.instance = this;
    }

    /**
     * Draws chat participant list window
     * @param {String[]} usernames usernames
     */
    draw(usernames) {
        $('#chatParticipantListModal .modal-body .list-group').empty()

        const sortedUsernames = usernames.sort((a, b) => a.localeCompare(b));
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

        $('#chatParticipantListModal').modal('show');
    }

    /**
     * Adds username to chat participant list window
     * 
     * @param {String} username username
     */
    addToChatParticipantList(username) {
        this.#usernames.push(username);
        this.draw(this.#usernames);
    }

    /**
     * Removes username from chat participant list window
     * 
     * @param {String} username username
     */
    removeFromChatParticipantList(username) {
        this.#usernames.forEach(parUsername => {
            if (parUsername === username) {
                let index = this.#usernames.indexOf(parUsername);
                this.#usernames.splice(index, 1);
            }
        });

        this.draw(this.#usernames);
    }

}