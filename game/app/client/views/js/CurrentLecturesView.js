class CurrentLecturesView extends WindowView {

    constructor(){
        super();
    }

    draw(lectures) {
        $('#currentLecturesContainer').empty();
        $('#nolecture').empty();
        
        if(lectures.length < 1) {
            $('#nolecture').text("Lectures will be shown here 10 minutes before the start. Please check the schedule and come back later.")
        }
        lectures.forEach(lecture => {
            // this is really messy i know, should move it somewhere else
            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-5 m-5 pt-3">
                    <h5 style="display:inline">${lecture.title} </h5>
                    <div class="small">${lecture.oratorName + " || " + lecture.maxParticipants + " seats"}</div>
                    <div>${lecture.remarks}</div>
                    <span id="${"full" + lecture.id}" style="color: red; display:none" class="align-self-end mt-1 p-2">Lecture is currently full or you are 5 minutes too late!</span>
                    <button id='${"show" + lecture.id}' class="btn btn-lecture m-2 align-self-end mt-auto" onclick="(new EventManager()).handleLectureClicked('${lecture.id}')">Show</button>
                </div>
            `)
        });

        $('#currentLectures').show(); // TODO: maybe move somewhere else if logic requires it
    }

    drawLectureFull(lectureId) {
        $('#full' + lectureId).show()
        $('#show' + lectureId).hide()
    }

}