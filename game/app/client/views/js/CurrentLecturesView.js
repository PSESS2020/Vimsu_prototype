class CurrentLecturesView extends WindowView {

    constructor() {
        super();
    }

    draw(lectures) {
        $('#currentLecturesContainer').empty();
        $('#nolecture').empty();

        if (lectures.length < 1) {
            $('#nolecture').text("Lectures will be shown here 10 minutes before the start. Please check the schedule and come back later.")
        }
        lectures.forEach(lecture => {
            // this is really messy i know, should move it somewhere else
            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-5 m-5 pt-3">
                    <h5 style="display:inline">${lecture.title} </h5>
                    <div class="small">${lecture.oratorName + " || " + lecture.maxParticipants + " seats"}</div>
                    <div>${lecture.remarks}</div>
                    <span id="waitforlectureload" style="color: antiquewhite; display:none" class="align-self-end mt-1 p-2"><i class="fas fa-spinner fa-pulse navbarIcons"></i> Please wait...</span>
                    <span id="${"full" + lecture.id}" style="color: red; display:none" class="align-self-end mt-1 p-2">Lecture is currently full.</span>
                    <button id='${"show" + lecture.id}' class="btn btn-lecture m-2 align-self-end mt-auto">Show</button>
                </div>

                <script> 
                    $('#show' + '${lecture.id}').on('click', function (event) {
                        $('#show' + '${lecture.id}').hide();
                        $('#waitforlectureload').show(); 
                        new EventManager().handleLectureClicked("${lecture.id}");
                    })
                </script>
            `)
        });

        $('#currentLectures').show(); // TODO: maybe move somewhere else if logic requires it
    }

    drawLectureFull(lectureId) {
        $('#waitforlectureload').hide();
        $('#show' + lectureId).hide();
        $('#full' + lectureId).show()
    }

}