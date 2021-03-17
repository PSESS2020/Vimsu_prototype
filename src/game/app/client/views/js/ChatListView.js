/**
 * The Chat List Window View
 *
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ChatListView extends WindowView {

  chats;
  eventManager;
  ownUsername;

  /**
   * Creates an instance of ChatListView
   *
   * @param {EventManager} eventManager event manager
   */
  constructor(eventManager) {
    super();

    if (!!ChatListView.instance) {
      return ChatListView.instance;
    }

    ChatListView.instance = this;

    this.eventManager = eventManager;
  }

  /**
   * Draws chat list window
   *
   * @param {Object[]} chats chats
   * @param {String} ownUsername current participant's username
   */
  draw(chats, ownUsername) {
    $("#chatListWait").hide();
    $("#nochat").empty();
    $("#chatListModal .modal-body .list-group").empty();

    if (chats.length < 1) {
      $("#nochat").text(
        "No chats found. Let's connect with others!"
      );
      return;
    }

    this.ownUsername = ownUsername

    chats.forEach((chat) => {
      if (chat.timestamp) {
        chat.timestamp = new Date(chat.timestamp);
      }
    });

    this.chats = chats.sort(
      (chatA, chatB) => chatB.timestamp - chatA.timestamp
    );

    this.chats.forEach((chat) => {
      var timestamp, previewMessage;

      if (chat.timestamp && chat.timestamp instanceof Date) {
        timestamp = new DateParser(chat.timestamp).parse();
      } else {
        timestamp = "no messages";
      }

      if (chat.previewUsername && chat.previewUsername !== this.ownUsername) {
        previewMessage = chat.previewUsername + ": " + chat.previewMessage;
      } else {
        previewMessage = chat.previewMessage;
      }

      // Now we want to append each chat as a clickable element
      $("#chatListModal .modal-body .list-group").append(`
        <li class="list-group-item bg-transparent chatthread">
          <a class="" style="color: antiquewhite" title="Open chat" id="${"chat" + chat.chatId}" role="button" data-toggle="modal" href="">
            <div class="row w-100">
              <div class="col-12 col-sm-2 px-0">
                <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
              </div>
              <div class="col-12 col-md-10 text-center text-sm-left">
                <label class="name lead">${chat.title}</label>
                <br>
                <span class="small p-0" style="opacity: 0.3">${timestamp}</span>
                <br>
                <span class ="small p-0 wrapword" style="opacity: 0.8">${previewMessage}</span>                                
              </div>  
            </div>
          </a>
        </li>
      `);

      $("#chat" + chat.chatId).off();
      $("#chat" + chat.chatId).on("click", () => {
        this.eventManager.handleChatThreadClicked(chat.chatId);
      });
    });
  }

  /**
   * Deletes chat from chat list window
   *
   * @param {String} chatId chat ID
   */
  deleteChat(chatId) {
    this.chats.forEach((chat) => {
      if (chat.chatId === chatId) {
        let index = this.chats.indexOf(chat);
        this.chats.splice(index, 1);
      }
    });

    this.draw(this.chats, this.ownUsername);
  }

  /**
   * Add chat to chat list window
   *
   * @param {Object} chat chat
   */
  addNewChat(chat) {
    if (!this.chats.includes(chat)) {
      this.chats.push(chat);
      this.draw(this.chats, this.ownUsername);
    }
  }

  /**
   * Add new message to chat list window
   *
   * @param {String} chatID chat ID
   * @param {Object} message chat message
   */
  addNewMessage(chatID, message) {
    this.chats.forEach((chat) => {
      if (chat.chatId === chatID) {
        if (message.msgText.length > 35) {
          var msgText = message.msgText.slice(0, 35) + "...";
        } else {
          var msgText = message.msgText;
        }
        chat.timestamp = message.timestamp;
        chat.previewUsername = message.senderUsername;
        chat.previewMessage = msgText;
        this.draw(this.chats, this.ownUsername);
      }
    });
  }

  addNewChatThreadWindow(chatID) {
    if (!($('#chatThreadModal' + chatID).length)) {
      $("#chatThreadModalCollection").append(`
          <div class="modal" id=${"chatThreadModal" + chatID} role="dialog" aria-labelledby=${"chatThreadModalTitle" + chatID}
          aria-hidden="true" data-focus-on="input:first">
            <div class="modal-dialog modal-dialog-centered mw-50 w-50" role="document">
                <div class="modal-content" style="background-color:rgba(34, 43, 46, 1) !important;">
                    <div class="modal-header">
                        <h5 class="modal-title" id=${"chatThreadModalTitle" + chatID}></h5>
                        <div class="d-flex flex-row justify-content-end">
                            <div>
                                <button id=${"chatLeaveButton" + chatID} class="close btn" title="Leave chat">
                                    <i class="fa fa-sign-out navbarIcons" style="margin-top: 2px"></i>
                                </button>
                            </div>
                            <div>
                                <button id=${"chatFriendRequestButton" + chatID} class="close btn">
                                    <i class="fa fa-user-plus navbarIcons" style="margin-top: 2px;" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" title="Show chat participant list"
                                    role="button" id=${"chatParticipantListBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-info-circle navbarIcons"
                                        style="transform: scale(0.8); margin-top: 1px;"></i>
                                </a>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" title="Invite friends to group chat"
                                    role="button" id=${"inviteFriendsBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-plus-square navbarIcons"
                                        style="transform: scale(0.8); margin-top: 1px;"></i>
                                </a>
                            </div>
                            <div>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body d-flex flex-column modal-body-large">
                        <div id=${"chatThreadWait" + chatID} style="text-align: center;">
                          <i class="fas fa-circle-notch fa-spin fa-2x"></i>
                        </div>
                        <div id=${"chatThreadModalList" + chatID} class="mb-3"
                            style="width: 100%; height: 100%; overflow-y: scroll; overflow-x: hidden">
                        </div>
                        <div class="d-flex">
                            <form id=${"chatMessageInputGroup" + chatID} class="input-group mb-3 mr-2 ml-2 mt-auto flex-align-bottom">
                                <button id="chatthread-emoji-trigger" class="mr-2" style="background: none" title="Pick emojis"><i class="fas fa-smile-beam"></i></button>
                                <input id=${"chatMessageInput" + chatID} type="text"
                                    style="background-color: #1b1e24; color: antiquewhite; border-color: antiquewhite; border-radius: 5px 0px 0px 5px;"
                                    class="form-control" placeholder="Enter message ..." autocomplete="off">
                                <div class="input-group-append">
                                    <button id=${"chatMessageButton" + chatID} class="btn btn-blue" type="button">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);
    }

    $("#chatThreadModal" + chatID).modal("show");
  }
}