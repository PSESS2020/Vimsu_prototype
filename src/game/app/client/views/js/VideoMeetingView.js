/**
 * The Video Meeting View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class VideoMeetingView extends WindowView {

    eventManager;
    jitsi;
    currentMeetingId;
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
        });

        // Minimize button event, Window gets closed but Meeting stays active, so voice chat stays active
        $('#meetingWindowMinimize').off();
        $('#meetingWindowMinimize').on('click', (event) => {
            event.preventDefault();

            this.isMinimized = true;
            $('#meetingWindow').hide();
        });
    }

    /**
     * Draws video meeting window
     * 
     * @param {String} meetingId id of joined meeting
     * @param {String} meetingDomain domain of joined meeting
     * @param {String} meetingName name of joined meeting
     * @param {String} meetingPassword password of joined meeting
     * @param {String} ownForename own forename that is shown in meeting
     */
    draw(meetingId, meetingDomain, meetingName, meetingPassword, ownForename) {
        $('#meetingWindowWait').hide();

        //Meeting was only minimized
        if (this.currentMeetingId === meetingId && this.isMinimized) {
            this.isMinimized = false;
            return;
        }

        //Another meeting was minimized before, that should be closed now
        if (this.currentMeetingId !== meetingId && this.isMinimized) {
            this.isMinimized = false;
            this.jitsi.dispose();
        }

        $("#meetingWindowTitle").empty();
        $("#meetingWindowTitle").text(meetingName);

        this.jitsi = new JitsiMeetExternalAPI(meetingDomain, {
            roomName: meetingName,
            subject: meetingName, // will this work?
            width: '100%',
            height: window.innerHeight * 0.85,
            // TODO: Add JWT (maybe)
            parentNode: document.getElementById('meetingWindowBody'),
            userInfo: {
                // email: 'place', ppant has no Email
                displayName: ownForename
            }
        });

        this.currentMeetingId = meetingId;

        // This would automatically pass the password used to
        // secure the meeting.
        // However, only moderators can set passwords, and it seems
        // not to be possible to set the password when "setting up" the
        // meeting the way it is currently done.
        this.jitsi.on('passwordRequired', function () {
            this.executeCommand('password', meetingPassword);
        })

        // When user leaves meeting, then jitsi-object is disposed
        this.jitsi.on('readyToClose', function () {
            this.dispose();
            $('#meetingWindow').hide();
        });
    }

    /**
     * Closes MeetingView if the meeting with the passed meetingID is currently open
     * 
     * @param {String} meetingId if of meeting
     */
    close(meetingId) {
        if (this.currentMeetingId === meetingId) {
            this.isMinimized = false;
            this.jitsi.dispose();
            $('#meetingWindow').hide();
        }
    }
}