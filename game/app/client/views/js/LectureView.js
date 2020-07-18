class LectureView extends WindowView {

    constructor(){
        super();
    }

    draw(lecture) {
        $('#currentLectures').hide(); // hide the overview of current lectures

        $('#lectureTitleLabel').text(lecture.title);
        $('#lectureSpeakerLabel').text(lecture.oratorName);
        
        $('#lectureVideo').attr('src', lecture.videoUrl);
        $('#lectureVideo').load();
        
        $('#lectureVideoWindow').show();
    }

}