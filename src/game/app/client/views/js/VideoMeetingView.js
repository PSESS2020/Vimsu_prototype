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
     * @param {json} languageData language data for videoMeeting view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!VideoMeetingView.instance) {
            return VideoMeetingView.instance;
        }

        VideoMeetingView.instance = this;

        this.eventManager = eventManager;
        this.isMinimized = false;

        document.getElementById("meetingMinimizeBtn").title = this.languageData.tooltips.minimizeMeeting;

        // Close button event, Window gets closed and Meeting is closed
        $('#meetingWindowClose').off();
        $('#meetingWindowClose').on('click', (event) => {
            event.preventDefault();

            this.jitsi.dispose();
            $('#meetingWindow').hide();
        });

        // Minimize button event, Window gets closed but Meeting stays active, so voice chat stays active
        $('#meetingMinimizeBtn').off();
        $('#meetingMinimizeBtn').on('click', (event) => {
            event.preventDefault();

            if (!this.isMinimized) {
                this.minimizeMeeting();
            } else {
                this.maximizeMeeting();
            }
        });
    }

    /**
     * Draws video meeting window
     * 
     * @param {Object} meeting joined meeting
     * @param {String} ownDisplayName own display name that is shown in meeting
     */
    draw(meeting, ownDisplayName) {
        $('#meetingWindowWait').hide();

        if (this.currentMeeting) {
            //Another meeting was minimized before, that should be closed now
            if (this.currentMeeting.id !== meeting.id && this.isMinimized) {
                this.jitsi.dispose();
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
                displayName: ownDisplayName
            },
            configOverwrite: { 
                startWithAudioMuted: true,
                startWithVideoMuted: true
            }
        });
    
        this.currentMeeting = meeting;

        if (this.isMinimized) {
            this.maximizeMeeting();
        }

        // set new password for channel
        this.jitsi.addEventListener('participantRoleChanged', function(event) {
            if (event.role === "moderator") {
                this.executeCommand('password', meeting.password);
            }
        });

        // join a protected channel
        this.jitsi.on('passwordRequired', function () {
            this.executeCommand('password', meeting.password);
        });

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
        if (this.currentMeeting.id === meetingId) {
            this.jitsi.dispose();
            $('#meetingWindow').hide();
        }
    }

    /**
     * Minimizes meeting window
     */
    minimizeMeeting() {
        let meetingWindow = document.getElementById("meetingWindow");
        let meetingContent = document.getElementById("meetingWindowContent");
        let minimizeBtn = document.getElementById("meetingMinimizeBtn");
        let iframe = this.jitsi.getIFrame();
        
        this.isMinimized = true;
        meetingWindow.style.left = '87%';
        meetingWindow.style.top = '65%';
        meetingWindow.style.width = '25%';
        meetingWindow.style.height = '33%';
        meetingContent.style.height = '85%';
        minimizeBtn.title = this.languageData.tooltips.maximizeMeeting;
        iframe.style.height = window.innerHeight * 0.85 * 0.33;
        $('#meetingMinimizeBtnImage').removeClass('fa fa-window-minimize');
        $('#meetingMinimizeBtnImage').addClass('fa fa-window-maximize');
    }
    
    /**
     * Maximizes meeting window
     */
    maximizeMeeting() {
        let meetingWindow = document.getElementById("meetingWindow");
        let meetingContent = document.getElementById("meetingWindowContent");
        let minimizeBtn = document.getElementById("meetingMinimizeBtn");
        let iframe = this.jitsi.getIFrame();

        this.isMinimized = false;
        meetingWindow.style.left = '50%';
        meetingWindow.style.top = '50%';
        meetingWindow.style.width = '100%';
        meetingWindow.style.height = '100%';
        meetingContent.style.height = '90%';
        minimizeBtn.title = this.languageData.tooltips.minimizeMeeting;
        iframe.style.height = window.innerHeight * 0.85;
        $('#meetingMinimizeBtnImage').removeClass('fa fa-window-maximize');
        $('#meetingMinimizeBtnImage').addClass('fa fa-window-minimize');
    }
}