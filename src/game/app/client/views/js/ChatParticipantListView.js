/**
 * The Group Chat Participant List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatParticipantListView extends AbstractView {

    usernames;

    /**
     * Creates an instance of ChatParticipantListView
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
     * 
     * @param {String} chatId chat id
     * @param {String[]} usernames usernames
     */
    draw(chatId, usernames) {
        const chatParticipantList = $(`#chatParticipantListModal${chatId} .modal-body .list-group`);

        $('#chatParticipantListWait' + chatId).hide();
        chatParticipantList.empty();

        const sortedUsernames = usernames.sort((a, b) => a.localeCompare(b));
        this.usernames = sortedUsernames;

        this.usernames.forEach(username => {
            chatParticipantList.append(`
                <li class="list-group-item bg-transparent chatthread" id="${"chatParticipantEntry" + username}">
                <div class="row w-100">
                        <div class="col-1 px-0">
                            <i class="fa fa-user fa-2x navbarIcons" style="margin-left: 0.3125rem" ></i>
                        </div>
                        <div class="d-flex col-11 align-items-center text-left">
                            <span class="name lead text-truncate" title="${username}" data-toggle="tooltip">${username}</span>
                        </div>
                    </div>
                </li>
            `);
        });
    }

    /**
     * Adds username to chat participant list window
     * 
     * @param {String} chatId chat id
     * @param {String} username username
     */
    addToChatParticipantList(chatId, username) {
        if (!this.usernames.includes(username)) {
            this.usernames.push(username);
            this.draw(chatId, this.usernames);
        }
    }

    /**
     * Removes username from chat participant list window
     * 
     * @param {String} username username
     */
    removeFromChatParticipantList(username) {
        for (let index = 0; index < this.usernames.length; index++) {
            if (this.usernames[index] === username) {
                this.usernames.splice(index, 1);
                break;
            }
        }

        $("#chatParticipantEntry" + username).remove();
    }

}