/**
 * The Lecture Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class LectureView extends WindowView {

    timerIntervalId;
    lectureStatus;
    hasToken;
    isOrator;
    isModerator;
    lectureId;
    lectureDuration;
    currentTimeDifference;
    video;
    timeLeft;
    eventManager;
    timeOffset;

    /**
     * Creates an instance of LectureView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for lecture view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!LectureView.instance) {
            return LectureView.instance;
        }

        LectureView.instance = this;

        this.eventManager = eventManager;
        this.lectureStatus = LectureStatus.PENDING;
        $('#lectureChatText').text(this.languageData.lectureChat);

        /* sets functions when document is ready, without this it is not possible to assign functions to
          appended buttons */
        $(() => {
            $(document).on('click', '#lectureChatButton', (e) => {
                this.sendMessage(e);
            });

            $(document).on('keydown', (e) => {
                if (document.activeElement === $("#lectureChatInput")[0]) {
                    e.stopPropagation();

                    if (e.key === 'Enter' && !e.shiftKey)
                        this.sendMessage(e);
                }
            });

            $(document).off('click', ".closeButton");

            $(document).on('click', ".closeButton", () => {
                this.leaveLecture();
            });

        });

    }

    /**
     * called if participant inputs a lecturemessage
     * 
     * @param {Event} event event
     */
    sendMessage = function (event) {
        event.preventDefault();

        let messageVal = $('#lectureChatInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (messageVal !== '') {
            this.eventManager.handleLectureChatMessageInput(messageVal);
            $('#lectureChatInput').val('');
            $('#lectureChatInput').trigger('focus');
        }
    }

    /**
     * draws video
     * 
     * @param {String} videoUrl video URL
     */
    drawVideo(videoUrl) {
        $('#lectureVideo').empty();

        $('#lectureVideo').append(`
            <video id="${"lectureVideo" + this.lectureId}" width="100%" height = "100%" controls preload controlsList="nodownload" src="${videoUrl}"></video>
        `);
        this.video = $(`#lectureVideo${this.lectureId}`)[0]; // get the first element otherwise the video is wrapped as jquery object

        // set default controls
        this.video.disablePictureInPicture = true;

        this.video.addEventListener('loadeddata', () => {
            this.video.pause();

            if (this.lectureStatus == LectureStatus.RUNNING && this.video.paused) {
                $('#lecturePending').hide();

                this.video.currentTime = this.currentTimeDifference / 1000;
                this.video.play();
            }

            this.video.addEventListener('pause', () => {
                if (this.lectureStatus === LectureStatus.RUNNING)
                    this.video.play();
            });

            this.video.addEventListener('play', () => {
                if (this.lectureStatus === LectureStatus.OVER)
                    this.video.pause();
            });
        });
    }

    /**
     * Draws lecture window
     * 
     * @param {Object} lecture lecture
     * @param {boolean} hasToken true if has token, otherwise false
     * @param {Object} lectureChat lecture chat
     * @param {boolean} isOrator true if is orator, otherwise false
     * @param {boolean} isModerator true if is moderator of the conference, otherwise false
     * @param {number} timeOffset offset if client has different local time than the server
     */
    draw(lecture, hasToken, lectureChat, isOrator, isModerator, timeOffset) {
        this.hasToken = hasToken;
        this.isOrator = isOrator;
        this.isModerator = isModerator;
        this.lectureId = lecture.id;
        this.video = undefined;
        this.timeOffset = timeOffset;

        // hide the overview of current lectures
        $('#currentLectures').hide();

        this.drawChat(lectureChat);

        //empties chat input to disable lecture chat
        $('#lectureChatInputGroup').empty();
        $('#pendingLectureChatMessage').empty();
        $('#closeButton').empty();

        $('#closeButton').append(`
            <button id="${this.lectureId}" class="ml-auto pl-1 pr-1 closeButton" style="background-color: transparent !important; border-color: transparent !important; box-shadow: 0rem 0rem 0rem transparent;" name="closeLectureVideoButton" type="button"><i class="fa fa-close"></i></button>
        `);

        //participant with token
        if (this.hasToken && !this.isOrator && !this.isModerator) {
            $('#lectureChatMessages').append(`
                <div id="pendingLectureChatMessage">
                    <p style="text-align: center">${this.languageData.questionsAfterLecture}</p>
                </div>
            `);
        }

        //participant without token
        else if (!this.hasToken && !this.isOrator && !this.isModerator) {
            $('#lectureChatMessages').append(`
                <div id="pendingLectureChatMessage">
                    <p style="text-align: center">${this.languageData.chatAfterLecture}</p>
                </div>
            `);
        }

        //orator or moderator
        else {
            $('#lectureChatMessages').append(`
                <div id="pendingLectureChatMessage">
                    <p style="text-align: center">${this.languageData.moderatorRights}</p>
                </div>
            `);
        }

        $('#lectureTitleLabel').text(lecture.title);
        $('#lectureSpeakerLabel').text(lecture.oratorName);

        $('#tokenIcon').empty();
        $('#tokenLabel').empty();

        $('#lectureVideo').empty();

        //opens lecture video window
        $('#lectureVideoWindow').show();

        var lectureStartingTime = new Date(lecture.startingTime).getTime();
        this.lectureDuration = lecture.duration * 1000;

        this.timerIntervalId = setInterval(() => {
            this.currentTimeDifference = Date.now() - lectureStartingTime - this.timeOffset;
            this.update();
        }, 1000);
    }

    /**
     * updates lecture view
     */
    update = function () {
        if (this.currentTimeDifference < 0) {
            $('#lecturePending').remove();
            $('#lectureVideo').append(`
                <div id="lecturePending" style="top: 0; left: 0; position: absolute; width: 100%; height: 100%; background: black; z-index: 1080; padding: 15%;" class="text-center">
                    <div id="countdown"></div>
                    <div>${this.languageData.secondsTill}</div>
                    <div>${this.languageData.presentationStarts}</div>
                </div>
            `);

            this.lectureStatus = LectureStatus.PENDING;

            var newTimeLeft = (-1) * Math.round(this.currentTimeDifference / 1000);
            if (this.timeLeft !== newTimeLeft) {
                this.timeLeft = newTimeLeft;
                $('#countdown').empty();
                $('#countdown').append(`<div style="font-size: 2.5rem;" class="animate__animated animate__bounceIn"><b>${this.timeLeft}</b></div>`);
            }
        }

        else if (this.currentTimeDifference >= 0 && this.currentTimeDifference <= this.lectureDuration) {
            $('#lecturePending').hide();

            this.lectureStatus = LectureStatus.RUNNING;

            if (this.video === undefined)
                this.eventManager.handleShowVideo(this.lectureId);
        }

        else if (this.video !== undefined && this.currentTimeDifference >= 0 && this.currentTimeDifference > this.lectureDuration) {
            clearInterval(this.timerIntervalId);

            $('#lecturePending').hide();
            $('#pendingLectureChatMessage').empty();

            this.lectureStatus = LectureStatus.OVER;

            this.drawToken(this.hasToken, this.languageData.tokenMessages[TokenMessages.TIMEOUT]);

            this.video.controlsList.remove('nodownload');
            this.video.pause();
        }
    }

    /**
     * called if participant clicks close button
     */
    leaveLecture = function () {
        if (this.lectureStatus === LectureStatus.RUNNING) {
            var shouldLeave = false;

            //participant with token
            if (this.hasToken && !this.isOrator && !this.isModerator)
                shouldLeave = confirm(this.languageData.notOverWithToken);

            //orator
            else if (this.isOrator)
                shouldLeave = confirm(this.languageData.notOverOrator);

            //participant without token or moderator
            else
                shouldLeave = confirm(this.languageData.notOverWithoutToken);

            if (shouldLeave)
                this.close();
        }

        else if (this.lectureStatus === LectureStatus.PENDING) {
            alert(this.languageData.comeBackOnTime);
            this.close();
        }

        else
            this.close();

    }

    /**
     * called to close lecture window
     */
    close() {
        clearInterval(this.timerIntervalId);

        $('#lectureVideo').empty();
        $('#lectureVideoWindow').hide();

        this.eventManager.handleLectureLeft(this.lectureId);

        if (this.video !== undefined) {
            this.video.removeAttribute('src'); // empty source
            this.video.load();
        }
    }

    /**
     * Appends message to lecture chat
     * 
     * @param {Object} message message
     * @param {String} ownUsername current participant's username
     */
    appendMessage(message, ownUsername) {
        var timestamp = new DateParser().parseOnlyTime(new Date(message.timestamp));

        const isOwnParticipant = message.username === ownUsername

        const messageDiv =
            `
                <div class="d-flex flex-column ${isOwnParticipant ? "align-items-end mr-2" : "align-items-start"}">
                    <small style="opacity: 0.3; float: right; padding: 0.3125rem 0rem 0.3125rem 0rem">${timestamp}</small>
                    <div class="${isOwnParticipant ? "allChatMessageBubbleMyself" : "allChatMessageBubbleOthers"}">
                        ${!isOwnParticipant ? `<small><b>${message.username}</b></small><br>` : ``}
                        <small class="wrapword" style="text-align: ${isOwnParticipant ? "right" : "left"};">${message.text}</small>
                    </div>
                </div>
            `

        $('#lectureChatMessages').append(messageDiv);
        $('#lectureChatMessages').scrollTop($('#lectureChatMessages')[0].scrollHeight);
    }

    /**
     * Draws lecture chat on lecture window
     * 
     * @param {Object} lectureChat lecture chat
     * @param {String} ownUsername current participant's username
     */
    drawChat(lectureChat, ownUsername) {
        $('#lectureChatMessages').empty();
        if (lectureChat.length > 0) {
            for (var i = 0; i < lectureChat.length; i++) {
                this.appendMessage(lectureChat[i], ownUsername);
            }
        }
    }

    /**
     * Draws token on lecture window
     * 
     * @param {boolean} hasToken true if has token, otherwise false
     * @param {TokenMessages} message token message
     */
    drawToken(hasToken, message) {
        this.hasToken = hasToken;
        $('#tokenIcon').empty();
        $('#tokenLabel').empty();

        if (this.hasToken) {
            if ($('#lectureChatInputGroup').is(':empty')) {
                $('#lectureChatInputGroup').append(`
                    <textarea id="lectureChatInput" type="text" class="form-control chatInputGroup" autocomplete="off" placeholder="${this.languageData.enterMessage + '...'}" rows="1"></textarea>
                    <div class="input-group-append">
                        <button id="lectureChatButton" class="btn btn-blue" type="button">${this.languageData.send}</button>
                    </div>
                `);
            }

            $('#tokenIcon').append(`
                <i class="fa fa-question-circle fa-4x"></i>
            `);

            $('#tokenLabel').append(this.languageData.tokenMessages[TokenMessages.HASTOKEN]);
        }

        // the input field is emptied if the user does not have a valid token
        else {
            $('#lectureChatInputGroup').empty();

            $('#tokenIcon').append(`
                <i class="fa fa-times-circle fa-4x"></i>
            `);

            $('#tokenLabel').append(this.languageData.tokenMessages[message]);
        }
    };
}
