class LectureView extends WindowView {

    constructor(){
        super();
    }

    draw(lecture, hasToken) {
        $('#currentLectures').hide(); // hide the overview of current lectures
        console.log("hastoken" + hasToken);
        if(hasToken) {
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-question-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You obtained a question token!')

            $(document).on('click', ".closeButton" , function() {
                var video = $('#lectureVideo').get(0);
                video.pause();
                if(video.currentTime < video.duration) {
                    var result = confirm('The lecture is not over! When you leave, you have 5 minutes to come back. After that time, your token will expire for this lecture. Are you sure you want to leave?');
                    if(result) {
                        $('#lectureVideoWindow').hide();
                        var eventManager = new EventManager();
                        eventManager.handleLectureLeft(this.id);
                    }
                } else {
                    $('#lectureVideoWindow').hide();
                }
            })
        } else {
            $('#lectureChatInput').empty();
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-times-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You left the lecture for too long. Therefore you are not able to ask questions in the lecture chat.')

            $(document).on('click', ".closeButton" , function() {
                var video = $('#lectureVideo').get(0);
                video.pause();

                if(video.currentTime < video.duration) {
                    var result = confirm('Are you sure you want to leave?');
                    if(result) {
                        $('#lectureVideoWindow').hide();
                        var eventManager = new EventManager();
                        eventManager.handleLectureLeft(this.id);
                    }
                } else {
                    $('#lectureVideoWindow').hide();
                }
            })
        }
        $('#closeButton').empty();

        $('#closeButton').append(`
        <button id="${lecture.id}" class="ml-auto pl-1 pr-1 closeButton" style="background-color: transparent !important; border-color: transparent !important; color: antiquewhite; box-shadow: 0px 0px 0px transparent;" name="closeLectureVideoButton" type="button"><i class="fa fa-close"></i></button>
        `)

        $('#lectureTitleLabel').text(lecture.title);
        $('#lectureSpeakerLabel').text(lecture.oratorName);
        
        $('#lectureVideo').attr('src', lecture.videoUrl);
        $('#lectureVideo').load();

        $('#lectureVideoWindow').show();
    }   
}