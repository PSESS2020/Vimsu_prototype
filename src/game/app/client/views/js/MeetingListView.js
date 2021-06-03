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
     * @param {json} languageData language data for meetingList view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!MeetingListView.instance) {
            return MeetingListView.instance;
        }

        MeetingListView.instance = this;

        this.eventManager = eventManager;
        this.meetings = [];

        $('#yourMeetingsText').text(this.languageData.yourMeetings);
    }

    /**
     * Draws jitsi meeting list window
     * 
     * @param {Object[]} meetings meetings
     */
    draw(meetings) {
        $('#meetingListWait').hide();
        $('#nomeeting').empty();
        $('#meetingListModal .modal-body .list-group').empty();

        if (!this.handleEmptyMeetingList(meetings)) return;

        this.meetings = meetings;

        this.meetings.forEach(meeting => {
            // Now we want to append each meeting as a clickable element
            this.appendNewMeeting(meeting);
        });
    }

    /**
     * Deletes meeting from meeting list window
     * 
     * @param {String} meetingId meeting ID
     */
    deleteMeeting(meetingId) {
        for (let index = 0; index < this.meetings.length; index++) {
            if (this.meetings[index].id === meetingId) {
                this.meetings.splice(index, 1);
                break;
            }
        };

        $("#meetingEntry" + meetingId).remove();
        if (!this.handleEmptyMeetingList(this.meetings)) return;
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
        this.eventManager.handleRemoveNewMeetingNotif(meeting.id);

        $('#meetingListModal .modal-body .list-group').prepend(`
            <li class="list-group-item bg-transparent chatthread px-0" id="${"meetingEntry" + meeting.id}">
                <a class="" title="${this.languageData.tooltips.openMeeting}" id="${"meeting" + meeting.id}" role="button" data-toggle="modal" href="">
                    <div class="d-flex flex-row align-items-center">
                        <div class="col-1 px-0">
                            <i class="fa fa-video fa-2x navbarIcons" style="margin-left: 0.3125rem" ></i>
                        </div>
                        <div class="d-flex col-11 align-items-center text-left">
                            <span class="name lead text-truncate" title="${meeting.name}" data-toggle="tooltip">${meeting.name}</span>
                        </div>
                    </div>
                </a>
            </li>
        `);

        $('#meeting' + meeting.id).off();
        $('#meeting' + meeting.id).on('click', () => {
            /* TO FIX
            This is not ideal, sensitive information like a password, even though it is not a particularly important, is not good practice */
            $('#meetingWindow').show();
            $('#meetingWindowWait').show();
            this.eventManager.handleMeetingJoined(meeting); 
        });
    }

    /**
     * Displays no meeting if there's no meeting
     * 
     * @param {Object[]} meetings meetings
     * @returns false if no meeting
     */
     handleEmptyMeetingList(meetings) {
        if (meetings && meetings.length < 1) {
            $('#nomeeting').text(this.languageData.noMeetings);
            return false;
        }

        return true;
    }
}
