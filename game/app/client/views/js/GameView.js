if (typeof module === 'object' && typeof exports === 'object') {
    StatusBar = require('./StatusBar');
    NotificationBar = require('./NotificationBar')
}

class GameView {

    #updateList = [];
    #currentLecturesView;
    #lectureView;
    #chatListView;
    #chatThreadView;
    #statusBar;
    #friendListView;
    #inviteFriendsView;
    #friendRequestListView;
    #currentMap;
    #ownAvatarView;
    #anotherParticipantAvatarViews = [];
    #gameViewInit;
    #npcAvatarViews = [];
    #notifBar;

    constructor() {
        this.#statusBar = new StatusBar();
        this.#notifBar = new NotificationBar();

        //bool to check, if game view is already initialized. If not, draw is not possible
        this.#gameViewInit = false;
    }

    getOwnAvatarView() {
        return this.#ownAvatarView;
    }

    getAnotherParticipantAvatarViews() {
        return this.#anotherParticipantAvatarViews;
    }

    setGameViewInit(bool) {
        TypeChecker.isBoolean(bool);
        this.#gameViewInit = bool;
    }

    initCanvasEvents() {

        if (this.#currentMap === null || this.#currentMap === undefined)
            return;

        var canvas = document.getElementById('avatarCanvas');

        var self = this;

        //Handle mouse movement on canvas
        $('#avatarCanvas').on('mousemove', function (e) {

            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = self.getMousePos(canvas, e);

            var selectedTileCords = self.#currentMap.translateMouseToTileCord(newPosition);

            if (self.#currentMap.isCursorOnMap(selectedTileCords.x, selectedTileCords.y)) {

                /*let alpha = ctx_avatar.getImageData(newPosition.x, newPosition.y, 1, 1).data[3];
                
                if(alpha !== 0)
                    canvas.style.cursor = "pointer";
                else
                    canvas.style.cursor = "default";*/

                self.#currentMap.selectionOnMap = true;
            } else
                self.#currentMap.selectionOnMap = false;

            self.#currentMap.updateSelectedTile(selectedTileCords);

        });

        //Handles mouse click on canvas
        $('#avatarCanvas').on('click', function (e) {

            //Translates the current mouse position to the mouse position on the canvas.
            var newPosition = self.getMousePos(canvas, e);

            var selectedTileCords = self.#currentMap.translateMouseToTileCord(newPosition);

            if (self.#currentMap.isCursorOnMap(selectedTileCords.x, selectedTileCords.y)) {

                //first check if click is on door or clickable object in room (not existing at this point)
                self.#currentMap.findClickedTile(selectedTileCords);

                //then, check if there is an avatar at this position
                self.getAnotherParticipantAvatarViews().forEach(ppantView => {

                    /*
                    console.log("avatar screen x: " + ppantView.getScreenX());
                    console.log("mouse screen x: " + newPosition.x);
                    console.log("avatar screen width: " + ppantView.getAvatarWidth());
                    */

                    /*
                   if ( newPosition.x > ppantView.getScreenX() && newPosition.x < ppantView.getScreenX() + ppantView.getAvatarWidth() 
                   && newPosition.y > ppantView.getScreenY() && newPosition.y < ppantView.getScreenY() + ppantView.getAvatarHeight()) {
                   ppantView.onclick(newPosition);
                   */

                    if (ppantView.getPosition().getCordX() === selectedTileCords.x
                        && ppantView.getPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        ppantView.onClick();
                    }
                });

                //then, check if there is an NPC at this position
                self.#npcAvatarViews.forEach(npcView => {
                    if (npcView.getPosition().getCordX() === selectedTileCords.x
                        && npcView.getPosition().getCordY() === selectedTileCords.y - Settings.MAP_BLANK_TILES_LENGTH) {
                        npcView.onClick();
                    }
                })

            }
        });
    }

    getMousePos(canvas, e) {

        //gets the absolute size of canvas and calculates the scaling factor
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        //Apply scaling factor to cursor position
        return {
            x: (e.pageX - rect.left) * scaleX,
            y: (e.pageY - rect.top) * scaleY,

        }
    }

    addToUpdateList(viewInstance) {
        if (viewInstance instanceof Array) {
            var i;
            for (i = 0; i < viewInstance.length; i++) {
                TypeChecker.isInstanceOf(viewInstance[i], Views);
            }
        }
        else {
            TypeChecker.isInstanceOf(viewInstance, Views);
        }

        if (!this.#updateList.includes(viewInstance)) {
            this.#updateList.push(viewInstance);
        }
    }

    removeFromUpdateList(viewInstance) {
        if (!this.#updateList.includes(viewInstance)) {
            throw new Error(viewInstance + " is not in update list")
        }

        let index = this.#updateList.indexOf(viewInstance);
        this.#updateList.splice(index, 1)
    }

    getUpdateList() {
        return this.#updateList;
    }

    drawStatusBar() {
        this.#statusBar.draw();
    }

    drawProfileBox(username) {
        this.#statusBar.drawProfile(username);
    }

    draw() {
        //check if game view is already initalized
        if (this.#gameViewInit) {
            if (this.#currentMap.selectionOnMap) {
                this.#currentMap.drawSelectedTile();
            }

            //put all AvatarViews in one list
            var allAvatars = [this.#ownAvatarView].concat(this.#anotherParticipantAvatarViews).concat(this.#npcAvatarViews);


            //sort all Avatars in CordX
            allAvatars.sort(function (a, b) {
                return b.getPosition().getCordX() - a.getPosition().getCordX();
            });

            //draw all avatars
            for (var i = 0; i < allAvatars.length; i++) {
                allAvatars[i].draw();
            }
        }
    }


    update() {
        for (var i = 0; i < this.#updateList.length; i++) {

            if (this.#updateList[i] instanceof Array) {
                for (var j = 0; j < this.#updateList[i].length; j++) {
                    this.#updateList[i][j].update();
                }
            }
            else {
                this.#updateList[i].update();
            }
        }
    }

    updateConnectionStatus(status) {
        this.#statusBar.updateConnectionStatus(status);
    }

    //Is called when participant enters Room
    initRoomView(map, objectMap, listOfNPCs, typeOfRoom) {
        ctx_map.clearRect(0, 0, GameConfig.CTX_WIDTH, GameConfig.CTX_HEIGHT);
        $('#avatarCanvas').off();

        this.#npcAvatarViews = [];
        listOfNPCs.forEach(npc => {
            this.#npcAvatarViews.push(new NPCAvatarView(npc.getId(), npc.getName(), npc.getPosition(), npc.getDirection(), typeOfRoom));
        });

        this.#currentMap = new RoomView(map, objectMap);
    }

    /**
     * 
     * @param {ParticipantClient} participant array of another participants / an participant instance excluding the current client
     */
    initAnotherAvatarViews(participant, typeOfRoom) {
        if (!(this.#ownAvatarView instanceof ParticipantAvatarView)) {
            throw new Error("Please initialize the current client's avatar view first using initOwnAvatarView(participant)");
        }

        TypeChecker.isInstanceOf(participant, ParticipantClient);

        if (this.#anotherParticipantAvatarViews.includes(participant)) {
            throw new Error(participant + " is already in list of participants")
        }

        if (participant !== this.#ownAvatarView) {
            console.log("other avatarView init: " + participant.getId());
            this.#anotherParticipantAvatarViews.push(new ParticipantAvatarView(
                participant.getPosition(),
                participant.getDirection(),
                participant.getId(),
                typeOfRoom,
                participant.getUsername()
            ));
        }
        this.addToUpdateList(this.#anotherParticipantAvatarViews);
    }

    updateAnotherAvatarPosition(participantId, newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setPosition(newPosition);
    }

    updateAnotherAvatarDirection(participantId, direction) {
        TypeChecker.isEnumOf(direction, Direction);

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].setDirection(direction);
    }

    updateAnotherAvatarWalking(participantId, isMoving) {

        let index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantId + " is not in list of participants")
        }

        this.#anotherParticipantAvatarViews[index].updateWalking(isMoving);
        this.#anotherParticipantAvatarViews[index].updateCurrentAnimation();
        this.#anotherParticipantAvatarViews[index].draw();
    }

    /**
     * 
     * @param {ParticipantClient} participants array of another participants / an participant instance excluding the current client
     */
    removeAnotherAvatarViews(participantId) {
        TypeChecker.isString(participantId);

        //Searches in Array of other Avatars for participant with this ID
        var index = this.#anotherParticipantAvatarViews.findIndex(participant => participant.getId() === participantId);

        if (index < 0) {
            throw new Error(participantsId + " is not in list of participants")
        }

        //Removes disconnected Avatar from participant avatar views
        this.#anotherParticipantAvatarViews.splice(index, 1);

    }

    resetAnotherAvatarViews() {
        this.#anotherParticipantAvatarViews.length = 0;
    }

    //inits ownAvatarView with information from ownParticipant model instance in a room of typeOfRoom
    initOwnAvatarView(ownParticipant, typeOfRoom) {
        TypeChecker.isInstanceOf(ownParticipant, ParticipantClient);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);

        let startingPos = ownParticipant.getPosition();
        let startingDir = ownParticipant.getDirection();
        let id = ownParticipant.getId();
        let username = ownParticipant.getUsername();
        this.#statusBar.updateLocation(typeOfRoom);

        this.#ownAvatarView = new ParticipantAvatarView(startingPos, startingDir, id, typeOfRoom, username);
        this.addToUpdateList(this.#ownAvatarView);



        //Game View is now fully initialized (Is now set by ClientController in initGameView())
        //this.#gameViewInit = true;
    }

    updateOwnAvatarPosition(newPosition) {
        TypeChecker.isInstanceOf(newPosition, PositionClient);
        this.#ownAvatarView.setPosition(newPosition);
    }

    updateOwnAvatarDirection(direction) {
        TypeChecker.isEnumOf(direction, Direction);
        this.#ownAvatarView.setDirection(direction);

    }

    updateOwnAvatarWalking(isMoving) {
        this.#ownAvatarView.updateWalking(isMoving);
        this.#ownAvatarView.updateCurrentAnimation();
    }


    initCurrentLectures(lectures) {
        this.#currentLecturesView = new CurrentLecturesView()
        this.#currentLecturesView.draw(lectures);
    }

    updateCurrentLectures(lectureId) {
        this.#currentLecturesView.drawLectureFull(lectureId);
    }

    initCurrentSchedule(lectures) {
        new ScheduleListView().draw(lectures);
    }

    updateCurrentLecture(lecture, hasToken, lectureChat) {
        this.#lectureView = new LectureView()
        this.#lectureView.draw(lecture, hasToken, lectureChat);
    }

    initGlobalChatView(messageHeader, messageText) {
        new GlobalChatView().draw(messageHeader, messageText);
    };

    initProfileView(businessCard, rank) {
        new ProfileView().draw(businessCard, rank);
    }

    initBusinessCardView(businessCard, isFriend, rank) {
        new BusinessCardView(businessCard, isFriend, rank).draw();
    }

    initFriendListView(businessCards) {
        this.#friendListView = new FriendListView();
        this.#friendListView.draw(businessCards)
    }

    initInviteFriendsView(businessCards, groupName, limit, chatId) {
        this.#inviteFriendsView = new InviteFriendsView();
        this.#inviteFriendsView.draw(businessCards, groupName, limit, chatId);
    }

    initCurrentAchievementsView(achievements) {
        new AchievementView().draw(achievements);
    }

    handleNewAchievement(achievement) {
        new NewAchievementView().draw(achievement);
    }

    initNPCStoryView(name, story) {
        new NPCStoryView().draw(name, story);
    }

    initRankListView(rankList) {
        new RankListView().draw(rankList);
    }

    initChatListView(chats) {

        this.#chatListView = new ChatListView();
        this.#chatListView.draw(chats);
    };

    initChatThreadView(chat, openNow) {
        this.#chatThreadView = new ChatThreadView();
        this.#chatThreadView.draw(chat);

        if (openNow) {
            if (!$('#chatThreadModal').is(':visible')) {
                $('#chatThreadModal').modal('show');
            }
        }
    };

    getChatThreadView() {
        return this.#chatThreadView;
    }

    addNewChat(chat, openNow) {
        if ($('#chatListModal').is(':visible') && this.#chatListView) {
            this.#chatListView.addNewChat(chat);
        }
        this.initChatThreadView(chat, openNow);
    };

    updateChatThread(chatId, areFriends, friendRequestSent) {
        if ($('#chatThreadModal').is(':visible') && this.#chatThreadView) {
            this.#chatThreadView.updateFriendRequestButton(chatId, areFriends, friendRequestSent);
        }
    }

    addNewChatMessage(chatId, message) {

        if (this.#chatListView) {
            this.#chatListView.addNewMessage(chatId, message); // TODO
        }

        if (this.#chatThreadView) {
            this.#chatThreadView.addNewMessage(chatId, message);
        }
    };

    updateSuccessesBar(points, rank) {
        new SuccessesBar().update(points, rank);
    }

    removeFriend(participantId) {
        if (this.#friendListView) {
            this.#friendListView.deleteFriend(participantId)
        }
    }

    removeChat(chatId) {
        this.#chatListView.deleteChat(chatId);
    }

    addFriend(businessCard) {
        if (this.#friendListView) {
            this.#friendListView.addToFriendList(businessCard);
        }
    }

    drawChatParticipantList(usernames) {
        new ChatParticipantListView().draw(usernames);
    }

    drawNewChat(senderUsername) {
        this.#notifBar.drawNewChat(senderUsername);
    }

    drawNewGroupChat(groupName, creatorUsername) {
        this.#notifBar.drawNewGroupChat(groupName, creatorUsername);
    }

    drawNewMessage(senderUsername) {
        this.#notifBar.drawNewMessage(senderUsername);
    }

    drawNewFriendRequest(senderUsername) {
        this.#notifBar.drawNewFriendRequest(senderUsername);
    }

    drawNewFriend(friendUsername) {
        this.#notifBar.drawNewFriend(friendUsername);
    }

    initFriendRequestListView(businessCards) {
        this.#friendRequestListView = new FriendRequestListView()
        this.#friendRequestListView.draw(businessCards);
    }

    updateFriendRequestListView(participantId, isAccepted) {
        if ($('#friendRequestListModal').is(':visible') && this.#friendRequestListView) {
            this.#friendRequestListView.update(participantId, isAccepted);
        }
    }

    addFriendRequest(businessCard) {
        if ($('#friendRequestListModal').is(':visible') && this.#friendRequestListView) {
            this.#friendRequestListView.addToFriendRequestList(businessCard);
        }
    }

    updateOwnAvatarRoom(typeOfRoom) {
        this.#ownAvatarView.setTypeOfRoom(typeOfRoom);
        this.#statusBar.updateLocation(typeOfRoom);
    }

    removeOwnAvatarView() {
        this.#ownAvatarView = undefined;
    }

    //used to hide an avatar without destroying the avatarView instance
    hideAvatar(participantId) {
        for (var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            console.log(avatar.getId());
            if (avatar.getId() === participantId) {
                avatar.setVisibility(false);
            }
        }
    }

    showAvatar(participantId) {
        for (var i = 0; i < this.#anotherParticipantAvatarViews.length; i++) {
            var avatar = this.#anotherParticipantAvatarViews[i];
            if (avatar.getId() === participantId) {
                avatar.setVisibility(true);
            }
        }
    }

    updateLectureChat(lectureChat) {
        /*
        console.log("update message test 1");
        // This if statement evaluates as false and prevents
        // the lectureView from updating properly after a
        // message has been deleted
        //if(this.#lectureView) {
            console.log("update message test 2");
            this.#lectureView.drawChat(messages); // as the lectureView is undefined, this does nothing
        //}
        * */
        $('#lectureChatMessages').empty();
        console.log("emptied messages");
        if (lectureChat.length > 0) {
            for (var i = 0; i < lectureChat.length; i++) {
                console.log("drawing message " + i);
                var message = lectureChat[i];
                var messageHeader = message.username + ", " + message.timestamp + ":";
                var $newMessageHeader = $("<div style='font-size: small;'></div>");
                var $newMessageBody = $("<div style='font-size: medium;'></div>");
                $newMessageHeader.text(messageHeader);
                $newMessageBody.text(message.messageText);
                $('#lectureChatMessages').append($newMessageHeader);
                $('#lectureChatMessages').append($newMessageBody);
                console.log("finished drawing message " + i);
            }
        }
    };

    updateLectureToken(hasToken) {
        /*
        // see above
        //if(this.#lectureView) {
            this.#lectureView.updateToken(hasToken);
        //}
        * */
        if (hasToken) {
            if ($('#lectureChatInputGroup').is(':empty')) {
                $('#lectureChatInputGroup').append(`
            <input id="lectureChatInput" type="text" style="background-color: #1b1e24; color: antiquewhite" class="form-control" placeholder="Enter message ...">
            <div class="input-group-append">
                <button id="lectureChatButton" class="btn btn-lecture mr-3" type="button">Send</button>
            </div>
            `)
            }
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-question-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You obtained a question token!')

            // the input field is emptied if the user does not have a valid token
        } else {
            $('#lectureChatInputGroup').empty();
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-times-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append("Your token was revoked by either the orator or a moderator. Therefore, you are no longer able to ask questions in the lecture chat. " +
                "Please remember to follow chat etiquette.");
        }
    };

    closeLectureView() {
        /*
        // see above
        //if(this.#lectureView) {
            this.#lectureView.close();
        //}
        * */
    };
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameView;
}