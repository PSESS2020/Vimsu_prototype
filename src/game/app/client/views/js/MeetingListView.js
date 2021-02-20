/**
 * The Meeting List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class MeetingListView extends WindowView {

    #meetings;
    #eventManager;

    /**
     * Creates an instance of MeetingListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!MeetingListView.instance) {
            return MeetingListView.instance;
        }

        MeetingListView.instance = this;

        this.#eventManager = eventManager;
    }

    /**
     * Draws jitsi meeting list window
     * 
     * @param {Object[]} meetings meetings
     */
    draw(meetings) {
        $('#meetingListModal .modal-body #nomeeting').empty();
        $('#meetingListModal .modal-body .list-group').empty();

        if (meetings.length < 1) {
            $('#meetingListModal .modal-body #nomeeting').text("No meetings found. Let's connect with others!")
            $('#meetingListModal').modal('show');
            return;
        }

        meetings.forEach(meeting => {
            if (meeting.timestamp) {
                meeting.timestamp = new Date(meeting.timestamp);
            }
        });

        this.#meetings = meetings.sort((meetingA, meetingB) => meetingB.timestamp - meetingA.timestamp);

        this.#meetings.forEach(meeting => {
            var timestamp, previewMessage;

            if (meeting.timestamp && meeting.timestamp instanceof Date) {
                timestamp = new DateParser(meeting.timestamp).parse();
            } else {
                timestamp = 'no messages';
            }

            if (meeting.previewUsername) {
                previewMessage = meeting.previewUsername + ": " + meeting.previewMessage;
            } else {
                previewMessage = meeting.previewMessage;
            }

            // Now we want to append each meeting as a clickable element
            $('#meetingListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent meetingthread">
                    <a class="" style="color: antiquewhite" title="Open meeting" id="${"meeting" + meeting.meetingId}" role="button" data-toggle="modal" href="">
                            <div class="row w-100">
                                <div class="col-12 col-sm-2 px-0">
                                    <i class="fa fa-user fa-5x navbarIcons" style="margin-left: 5px" ></i>
                                </div>
                                <div class="col-12 col-md-10 text-center text-sm-left">
                                    <label class="name lead">${meeting.title}</label>
                                    <br>
                                    <span class="small p-0" style="opacity: 0.3">${timestamp}</span>
                                    <br>
                                    <span class ="small p-0 wrapword" style="opacity: 0.8">${previewMessage}</span>                                
                                </div>  
                            </div>
                    </a>
                </li>
            `)

            $('#meeting' + meeting.meetingId).off();
            $('#meeting' + meeting.meetingId).click((event) => {
                this.#eventManager.handleMeetingThreadClicked(meeting.meetingId);
            })
        })

        $('#meetingListModal').modal('show');
    }

    /**
     * Deletes meeting from meeting list window
     * 
     * @param {String} meetingId meeting ID
     */
    deleteMeeting(meetingId) {
        this.#meetings.forEach(meeting => {

            if (meeting.meetingId === meetingId) {
                let index = this.#meetings.indexOf(meeting);
                this.#meetings.splice(index, 1);
            }
        });

        this.draw(this.#meetings);
    };

    /**
     * Add meeting to meeting list window
     * 
     * @param {Object} meeting meeting
     */
    addNewMeeting(meeting) {
        if (!this.#meetings.includes(meeting)) {
            this.#meetings.push(meeting);
            this.draw(this.#meetings);
        }
    };

    /**
     * Add new message to meeting list window
     * 
     * @param {String} meetingID meeting ID
     * @param {Object} message meeting message
     */
    addNewMessage(meetingID, message) {
        this.#meetings.forEach(meeting => {
            if (meeting.meetingId === meetingID) {
                if (message.msgText.length > 35) {
                    var msgText = message.msgText.slice(0, 35) + "...";
                } else {
                    var msgText = message.msgText;
                }
                meeting.timestamp = message.timestamp;
                meeting.previewUsername = message.senderUsername;
                meeting.previewMessage = msgText;
                this.draw(this.#meetings);
            }
        })
    };
}
