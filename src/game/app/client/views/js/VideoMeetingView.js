/**
 * The Video Meeting View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class VideoMeetingView extends WindowView {

    eventManager;
    jitsi;
    currentMeeting;
    isMinimized;

    /**
     * Creates an instance of VideoMeetingView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!VideoMeetingView.instance) {
            return VideoMeetingView.instance;
        }

        VideoMeetingView.instance = this;

        this.eventManager = eventManager;
        this.isMinimized = false;

        // Close button event, Window gets closed and Meeting is closed
        $('#meetingWindowClose').off();
        $('#meetingWindowClose').on('click', (event) => {
            event.preventDefault();

            this.jitsi.dispose();
            $('#meetingWindow').hide();
            this.eventManager.handleRemoveMinimizedMeetingNotif(this.currentMeeting.id)
        });

        // Minimize button event, Window gets closed but Meeting stays active, so voice chat stays active
        $('#meetingWindowMinimize').off();
        $('#meetingWindowMinimize').on('click', (event) => {
            event.preventDefault();

            this.isMinimized = true;
            $('#meetingWindow').hide();
            this.eventManager.handleAddMinimizedMeetingNotif(this.currentMeeting)
        });
    }

    /**
     * Draws video meeting window
     * 
     * @param {Object} meeting joined meeting
     * @param {String} ownForename own forename that is shown in meeting
     */
    draw(meeting, ownForename) {
        $('#meetingWindowWait').hide();

        if (this.currentMeeting) {
            //Meeting was only minimized
            if (this.currentMeeting.id === meeting.id && this.isMinimized) {
                this.isMinimized = false;
                return;
            }

            //Another meeting was minimized before, that should be closed now
            if (this.currentMeeting.id !== meeting.id && this.isMinimized) {
                this.isMinimized = false;
                this.jitsi.dispose();
                this.eventManager.handleRemoveMinimizedMeetingNotif(this.currentMeeting.id)
            }
        }

        $("#meetingWindowTitle").empty();
        $("#meetingWindowTitle").text(meeting.name);

        this.jitsi = new JitsiMeetExternalAPI(meeting.domain, {
            roomName: meeting.id,
            subject: meeting.name, // will this work?
            width: '100%',
            height: window.innerHeight * 0.85,
            // TODO: Add JWT (maybe)
            parentNode: document.getElementById('meetingWindowBody'),
            userInfo: {
                // email: 'place', ppant has no Email
                displayName: ownForename
            }
        });

        this.currentMeeting = meeting;

        // set new password for channel
        this.jitsi.addEventListener('participantRoleChanged', function(event) {
            if (event.role === "moderator") {
                this.executeCommand('password', meeting.password);
            }
        })

        // join a protected channel
        this.jitsi.on('passwordRequired', function () {
            this.executeCommand('password', meeting.password);
        })

        // When user leaves meeting, then jitsi-object is disposed
        this.jitsi.on('readyToClose', function () {
            this.dispose();
            $('#meetingWindow').hide();
            this.eventManager.handleRemoveMinimizedMeetingNotif(this.currentMeeting.id)
        });
    }

    /**
     * Closes MeetingView if the meeting with the passed meetingID is currently open
     * 
     * @param {String} meetingId if of meeting
     */
    close(meetingId) {
        if (this.currentMeeting.id === meetingId) {
            this.isMinimized = false;
            this.jitsi.dispose();
            $('#meetingWindow').hide();
            this.eventManager.handleRemoveMinimizedMeetingNotif(this.currentMeeting.id)
        }
    }
}