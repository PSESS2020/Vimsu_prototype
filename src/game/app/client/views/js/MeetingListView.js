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

        this.#meetings = meetings;

        this.#meetings.forEach(meeting => {

            // Now we want to append each meeting as a clickable element
            $('#meetingListModal .modal-body .list-group').append(`
                <li class="list-group-item bg-transparent meetingthread">
                    <a class="" style="color: antiquewhite" title="Open meeting" id="${"meeting" + meeting.id}" role="button" data-toggle="modal" href="">
                            <div class="row w-100">
                                <div class="col-12 col-sm-2 px-0">
                                    <i class="fa fa-video fa-5x navbarIcons" style="margin-left: 5px" ></i>
                                </div>
                                <div class="col-12 col-md-10 text-center text-sm-left">
                                    <label class="name lead">${meeting.name}</label>
                                </div>  
                            </div>
                    </a>
                </li>
            `)

            $('#meeting' + meeting.id).off();
            $('#meeting' + meeting.id).on('click', (event) => {
                this.#eventManager.handleMeetingThreadClicked(meeting.id);
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

}