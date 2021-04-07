/**
 * The Video Meeting View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 class VideoMeetingView extends WindowView {

    eventManager;

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
        
        /* TODO:
         * - When closing the modal, only video gets muted
         * - That is unless the modal gets hidden because
         *   we hung up the call
         * - When the meeting-modal is opened, it should
         *   be checked whether or not a jitsi-object already
         *   exists (?)*/

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
        
        // This would automatically pass the password used to
        // secure the meeting.
        // However, only moderators can set passwords, and it seems
        // not to be possible to set the password when "setting up" the
        // meeting the way it is currently done.
        this.jitsi.on('passwordRequired', function () {
            this.jitsi.executeCommand('password', meetingPassword);
        })
        
        // When user leaves meeting, then jitsi-object is disposed
        this.jitsi.on('readyToClose', function () {
            this.jitsi.dispose();
            $('#meetingModal').modal('hide');
        });
        
        $('#meetingModal').modal('show');
        
        $('#meetingModal').on('hidden.bs.modal', function() { 
            this.jitsi.executeCommand('toggleVideo');
        }.bind(this));
    }
}