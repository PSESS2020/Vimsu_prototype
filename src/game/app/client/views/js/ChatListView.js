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
   * @param {json} languageData language data for chatlist view
   */
  constructor(eventManager, languageData) {
    super(languageData);

    if (!!ChatListView.instance) {
      return ChatListView.instance;
    }

    ChatListView.instance = this;

    this.eventManager = eventManager;

    $('#newGroupChat').off();
    $('#newGroupChat').on('click', (event) => {
      event.preventDefault();
      $('#inputGroupNameModal').modal('show');
      $('#groupNameInput').trigger('focus');
    });

    $('#yourChatsText').text(this.languageData.yourChats);
    $('#initGroupChatText').text(this.languageData.group);
    document.getElementById('newGroupChat').title = this.languageData.createGroupChat;
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

    this.ownUsername = ownUsername;

    chats.forEach((chat) => {
      if (chat.timestamp) {
        chat.timestamp = new Date(chat.timestamp);
      }
    });

    this.chats = chats.sort(
      (chatA, chatB) => chatA.timestamp - chatB.timestamp
    );

    this.chats.forEach((chat) => {
      this.prependNewChat(chat);
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
      timestamp = new DateParser().parse(chat.timestamp);
    } else {
      timestamp = this.languageData.noMessages;
    }

    if (previewMessage.includes('<br/>')) {
      previewMessage = previewMessage.replace(/<br\/>/g, ' ');
    }

    if (chat.previewUsername && chat.previewUsername !== this.ownUsername) {
      previewMessage = chat.previewUsername + ": " + previewMessage;
    }

    return { timestamp, previewMessage };
  }

  /**
   * Prepends new chat
   * 
   * @param {Object} chat 
   */
  prependNewChat(chat) {
    $("#nochat").empty();

    let { timestamp, previewMessage } = this.setChatPreview(chat);

    // Now we want to append each chat as a clickable element
    $("#chatListModal .modal-body .list-group").prepend(`
        <li class="list-group-item bg-transparent chatthread px-0" id="${"chatListEntry" + chat.chatId}">
            <a class="" id="${"chat" + chat.chatId}" title="${this.languageData.tooltips.openChat}" role="button" data-toggle="modal" href="">
                <div class="d-flex flex-row px-0">
                    <div class="col-2 pr-0 my-auto">
                        <div class="d-flex flex-row justify-content-center align-items-center my-auto">
                            <i class="fa fa-user fa-5x navbarIcons"></i>
                        </div>
                    </div>
                    <div class="col-10 pl-4">
                        <div class="d-flex flex-row justify-content-start align-items-center">
                          <label class="name lead text-truncate" title="${chat.title}" data-toggle="tooltip">${chat.title}</label>
                        </div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <span class="small text-truncate" style="opacity: 0.3">${timestamp}</span>
                        </div>
                        <div class="d-flex flex-row justify-content-start align-items-center">
                            <span class ="small text-truncate" style="opacity: 0.8" title="${previewMessage}" data-toggle="tooltip">${previewMessage}</span>
                        </div>
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
    for (let index = 0; index < this.chats.length; index++) {
      if (this.chats[index].chatId === chatId) {
        this.chats.splice(index, 1);
        break;
      }
    }

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
      $("#nochat").text(this.languageData.noChats);
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
      this.prependNewChat(chat);
    }
  }

  /**
   * Add new message to chat list window
   *
   * @param {String} chatID chat ID
   * @param {Object} message chat message
   */
  addNewMessage(chatID, message) {
    for (let index = 0; index < this.chats.length; index++) {
      const chat = this.chats[index];

      if (chat.chatId === chatID) {
        chat.previewUsername = message.senderUsername;
        chat.timestamp = message.timestamp;
        chat.previewMessage = message.msgText;
        break;
      }
    };
    this.draw(this.chats, this.ownUsername);
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
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id=${"chatThreadModalTitle" + chatID}></h5>
                        <div class="d-flex flex-row justify-content-end">
                            <div>
                                <button id=${"chatFriendRequestButton" + chatID} class="close btn" style="display: none" title="${this.languageData.tooltips.addFriend}">
                                    <i class="fa fa-user-plus navbarIcons" style="margin-top: 0.125rem;" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div>
                                <button id=${"chatMeetingButton" + chatID} class="close btn" style="display: none" title="${this.languageData.tooltips.videoCall}">
                                    <i class="fa fa-video navbarIcons" style="margin-top: 0.125rem;" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" style="display: none" title="${this.languageData.tooltips.showMembers}"
                                    role="button" id=${"chatParticipantListBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-info-circle navbarIcons"
                                        style="margin-top: 0.0625rem;"></i>
                                </a>
                            </div>
                            <div>
                                <a class="action_button nav-item nav-link close btn" style="display: none" title="${this.languageData.tooltips.inviteFriends}"
                                    role="button" id=${"inviteFriendsBtn" + chatID} data-toggle="modal">
                                    <i class="fa fa-plus-square navbarIcons"
                                        style="margin-top: 0.0625rem;"></i>
                                </a>
                            </div>
                            <div>
                                <button id=${"chatLeaveButton" + chatID} class="close btn" style="display: none" title="${this.languageData.tooltips.leaveChat}">
                                    <i class="fa fa-sign-out navbarIcons" style="margin-top: 0.125rem"></i>
                                </button>
                            </div>
                            <div>
                                <button type="button" class="close btn" data-dismiss="modal" aria-label="Close">
                                  <i class="fa fa-close" style="margin-top: 0.125rem;"></i>
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
                                
                                <button id=${"chatthreadEmojiTrigger" + chatID} class="mr-2" style="background: none" title="${this.languageData.tooltips.emojis}"><i class="fas fa-smile-beam"></i></button>
                                <textarea id=${"chatMessageInput" + chatID} type="text"
                                    class="form-control chatInputGroup" placeholder="${this.languageData.enterMessage}" autocomplete="off" rows="1"></textarea>
                                <div class="input-group-append">
                                    <button id=${"chatMessageButton" + chatID} class="btn btn-blue" type="button">${this.languageData.send}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="position: relative; width: 0; height: 0; display: none; z-index: 1070" id=${"chatthreadEmojiPicker" + chatID + "Div"}>
          <div style="position: fixed; top: calc(50% + 0.5rem); top: -moz-calc(50% + 0.5rem); top: -webkit-calc(50% + 0.5rem); top: -o-calc(50% + 0.5rem); left: calc(50% - 13.5rem); left: -moz-calc(50% - 13.5rem); left: -webkit-calc(50% - 13.5rem); left: -o-calc(50% - 13.5rem);">
              <emoji-picker class="dark" id=${"chatthreadEmojiPicker" + chatID}></emoji-picker>
          </div>
        </div>
      `);

      new EmojiPicker().draw('chatthreadEmojiTrigger' + chatID, 'chatthreadEmojiPicker' + chatID, `chatMessageInput${chatID}`);
    }

    $("#chatThreadModal" + chatID).modal("show");
  }
}