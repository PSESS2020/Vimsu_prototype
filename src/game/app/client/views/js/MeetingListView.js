/**
 * The Meeting List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class MeetingListView extends WindowView {

    meetings;
    eventManager;

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

        this.eventManager = eventManager;
    }

    /**
     * Draws jitsi meeting list window
     * 
     * @param {Object[]} meetings meetings
     */
    draw(meetings) {
        $('#nomeeting').empty();
        $('#meetingListModal .modal-body .list-group').empty();

        if (!this.handleEmptyMeetingList(meetings)) return;

        this.meetings = meetings;

        this.meetings.forEach(meeting => {

            // Now we want to append each meeting as a clickable element
            this.appendNewMeeting(meeting);
        })

        $('#meetingListModal').modal('show');
    }

    /**
     * Deletes meeting from meeting list window
     * 
     * @param {String} meetingId meeting ID
     */
    deleteMeeting(meetingId) {
        this.meetings.forEach((meeting, index) => {

            if (meeting.meetingId === meetingId) {
                this.meetings.splice(index, 1);
            }
        });

        $("#meetingEntry" + meetingId).remove()
        if (!this.handleEmptyMeetingList(meetings)) return
    };

    /**
     * Add meeting to meeting list window
     * 
     * @param {Object} meeting meeting
     */
    addNewMeeting(meeting) {
        if (!this.meetings.includes(meeting)) {
            this.meetings.unshift(meeting);
            this.appendNewMeeting(meeting);
        }
    };

    /**
     * Appends new meeting
     * 
     * @param {Object} meeting meeting
     */
    appendNewMeeting(meeting) {
        $('#nomeeting').empty();

        $('#meetingListModal .modal-body .list-group').prepend(`
            <li class="list-group-item bg-transparent meetingthread" id="${"meetingEntry" + meeting.id}">
                <a class="" style="color: antiquewhite" title="Open meeting" id="${"meeting" + meeting.id}" role="button" data-toggle="modal" href="">
                        <div class="row w-100">
                            <div class="col-2 px-0">
                                <i class="fa fa-video fa-5x navbarIcons" style="margin-left: 5px" ></i>
                            </div>
                            <div class="col-10 text-left">
                                <label class="name lead">${meeting.name}</label>
                            </div>  
                        </div>
                </a>
            </li>
        `)

        $('#meeting' + meeting.id).off();
        $('#meeting' + meeting.id).on('click', () => {
            this.eventManager.handleMeetingThreadClicked(meeting.id);
        })
    }

    /**
     * Displays no meeting if there's no meeting
     * 
     * @param {Object[]} meetings meetings
     * @returns false if no meeting
     */
     handleEmptyMeetingList(meetings) {
        if (meetings && meetings.length < 1) {
            $('#nomeeting').text("No meetings found. Let's connect with others!")
            $('#meetingListModal').modal('show');
            return false;
        }

        return true;
    }
}
