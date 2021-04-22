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

    $('#newGroupChat').off();
    $('#newGroupChat').on('click', (event) => {
      event.preventDefault();
      $('#inputGroupNameModal').modal('show')
      $('#groupNameInput').trigger('focus') 
    });
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

    if (!this.handleEmptyChats(chats)) return;

    this.ownUsername = ownUsername

    chats.forEach((chat) => {
      if (chat.timestamp) {
        chat.timestamp = new Date(chat.timestamp);
      }
    });

    this.chats = chats.sort(
      (chatA, chatB) => chatA.timestamp - chatB.timestamp
    );

    this.chats.forEach((chat) => {
      this.appendNewChat(chat);
    });
  }

  /**
   * Sets timestamp and preview message for the preview
   * 
   * @param {Object} chat 
   * @returns parsed timestamp and preview message
   */
  setChatPreview(chat) {
    let timestamp = "";
    let previewMessage = chat.previewMessage;

    if (chat.timestamp && chat.timestamp instanceof Date) {
      timestamp = new DateParser(chat.timestamp).parse();
    } else {
      timestamp = "no messages";
    }

    if (chat.previewUsername && chat.previewUsername !== this.ownUsername) {
      previewMessage = chat.previewUsername + ": " + chat.previewMessage;
    }

    return { timestamp, previewMessage }
  }

  /**
   * Appends new chat
   * 
   * @param {Object} chat 
   */
  appendNewChat(chat) {
    $("#nochat").empty();

    let { timestamp, previewMessage } = this.setChatPreview(chat);

    // Now we want to append each chat as a clickable element
    $("#chatListModal .modal-body .list-group").prepend(`
        <li class="list-group-item bg-transparent chatthread" id="${"chatListEntry" + chat.chatId}">
          <a class="" style="color: antiquewhite" title="Open chat" id="${"chat" + chat.chatId}" role="button" data-toggle="modal" href="">
            <div class="row w-100">
              <div class="col-2 px-0">
                <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
              </div>
              <div class="col-10 text-left">
                <label class="name lead">${chat.title}</label>
                <br>
                <span class="small p-0" style="opacity: 0.3" id="${"chatTimestamp" + chat.chatId}">${timestamp}</span>
                <br>
                <span class ="small p-0 wrapword" style="opacity: 0.8" id="${"chatPreviewMessage" + chat.chatId}">${previewMessage}</span>                                
              </div>  
            </div>
          </a>
        </li>
      `);

    $("#chat" + chat.chatId).off();
    $("#chat" + chat.chatId).on("click", () => {
      this.eventManager.handleChatThreadClicked(chat.chatId);
    });
  }

  /**
   * Deletes chat from chat list window
   *
   * @param {String} chatId chat ID
   */
  deleteChat(chatId) {
    this.chats.forEach((chat, index) => {
      if (chat.chatId === chatId) {
        this.chats.splice(index, 1);
      }
    });

    $("#chatListEntry" + chatId).remove();
    if (!this.handleEmptyChats(this.chats)) return;
  }

  /**
   * Displays no chat message if there's no chat
   * 
   * @param {Object[]} chats chats
   * @returns false if no chat
   */
  handleEmptyChats(chats) {
    if (chats && chats.length < 1) {
      $("#nochat").text("No chats found. Let's connect with others!");
      return false;
    }

    return true;
  }

  /**
   * Add chat to chat list window
   *
   * @param {Object} chat chat
   */
  addNewChat(chat) {
    if (!this.chats.includes(chat)) {
      this.chats.push(chat);
      this.appendNewChat(chat)
    }
  }

  /**
   * Add new message to chat list window
   *
   * @param {String} chatID chat ID
   * @param {Object} message chat message
   */
  addNewMessage(chatID, message) {
    this.chats.forEach(chat => {
      if (chat.chatId === chatID) {
        if (message.msgText.length > 35) {
          var msgText = message.msgText.slice(0, 35) + "...";
        } else {
          var msgText = message.msgText;
        }

        chat.timestamp = message.timestamp;

        if (chat.timestamp) {
          chat.timestamp = new Date(chat.timestamp);
        }

        chat.previewUsername = message.senderUsername;
        chat.previewMessage = msgText;

        let { timestamp, previewMessage } = this.setChatPreview(chat);

        $("#chatTimestamp" + chatID).empty();
        $("#chatTimestamp" + chatID).text(timestamp);
        $("#chatPreviewMessage" + chatID).empty();
        $("#chatPreviewMessage" + chatID).text(previewMessage);
      }
    });

    this.draw(this.chats, this.ownUsername)
  }

  /**
   * Adds new chat thread window for new chat
   * 
   * @param {String} chatID chat ID
   */
  addNewChatThreadWindow(chatID) {
    if (!($('#chatThreadModal' + chatID).length)) {
      $("#chatThreadModalCollection").append(`
          <div class="modal" id=${"chatThreadModal" + chatID} role="dialog" aria-labelledby=${"chatThreadModalTitle" + chatID}
          aria-hidden="true" data-focus-on="input:first">
            <div class="modal-dialog modal-dialog-centered mw-50" role="document">
                <div class="modal-content" style="background-color:rgba(34, 43, 46, 1) !important;">
                    <div class="modal-header">
                        <h5 class="modal-title" id=${"chatThreadModalTitle" + chatID}></h5>
                        <div class="d-flex flex-row justify-content-end">
                            <div>
                                <button id=${"chatFriendRequestButton" + chatID} class="close btn" style="display: none" title="Add friend">
                                    <i class="fa fa-user-plus navbarIcons" style="margin-top: 2px;" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div>
                                <button id=${"chatMeetingButton" + chatID} class="close btn" style="display: none" title="(Video) call with chat participants">
                                    <i class="fa fa-video navbarIcons" style="margin-top: 2px;" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" style="display: none" title="Show chat participant list"
                                    role="button" id=${"chatParticipantListBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-info-circle navbarIcons"
                                        style="transform: scale(0.8); margin-top: 1px;"></i>
                                </a>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" style="display: none" title="Invite friends to group chat"
                                    role="button" id=${"inviteFriendsBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-plus-square navbarIcons"
                                        style="transform: scale(0.8); margin-top: 1px;"></i>
                                </a>
                            </div>
                            <div>
                                <button id=${"chatLeaveButton" + chatID} class="close btn" style="display: none" title="Leave chat">
                                    <i class="fa fa-sign-out navbarIcons" style="margin-top: 2px"></i>
                                </button>
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
                          <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
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