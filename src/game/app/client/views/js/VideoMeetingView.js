/**
 * The Video Meeting View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class VideoMeetingView extends WindowView {

    eventManager;
    jitsi;
    nameOfLastMeeting;
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
    }

    /**
     * Draws video meeting window
     * 
     * @param {String} meetingDomain domain of joined meeting
     * @param {String} meetingName name of joined meeting
     * @param {String} meetingPassword password of joined meeting
     * @param {String} ownForename own forename that is shown in meeting
     */
    draw(meetingDomain, meetingName, meetingPassword, ownForename) {
        
        $("#meetingModalTitle").empty();
        $("#meetingModalTitle").text(meetingName);

        //Meeting was only minimized
        if (this.nameOfLastMeeting === meetingName && this.isMinimized) {
            $('#meetingModal').modal('show');
        //An other meeting was minimized before, that should be closed now
        } else if (this.nameOfLastMeeting !== meetingName && this.isMinimized) {
            this.jitsi.dispose();
        } 

        if (!(this.nameOfLastMeeting === meetingName && this.isMinimized)) {
            this.jitsi = new JitsiMeetExternalAPI(meetingDomain, {
                roomName: meetingName,
                subject: meetingName, // will this work?
                width: '100%',
                height: window.innerHeight * 0.7,
                // TODO: Add JWT (maybe)
                parentNode: document.getElementById('meetingModal-body'),
                userInfo: {
                    // email: 'place', ppant has no Email
                    displayName: ownForename
                }
            });
        }
        this.nameOfLastMeeting = meetingName;
        this.isMinimized = false;

        // Close button event, Window gets closed and Meeting is closed
        $('#meetingModalClose').off();
        $('#meetingModalClose').on('click', (event) => {
            event.preventDefault();

            this.jitsi.dispose();
            $('#meetingModal').modal('hide');
        });

        // Minimize button event, Window gets closed but Meeting stays active, so voice chat stays active
        $('#meetingModalMinimize').off();
        $('#meetingModalMinimize').on('click', (event) => {
            event.preventDefault();

            this.isMinimized = true;
            $('#meetingModal').modal('hide');
        });
        
        $('#meetingModal').modal('show');

        // This would automatically pass the password used to
        // secure the meeting.
        // However, only moderators can set passwords, and it seems
        // not to be possible to set the password when "setting up" the
        // meeting the way it is currently done.
        this.jitsi.on('passwordRequired', function () {
            this.jitsi.executeCommand('password', meetingPassword);
        })
        
        /* THIS EVENT HAS NO EFFECT AT THIS MOMENT */
        // When user leaves meeting, then jitsi-object is disposed
        this.jitsi.on('readyToClose', function () {
            this.jitsi.dispose();
            $('#meetingModal').modal('hide');
        });
    }
}