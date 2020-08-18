class CurrentLecturesView extends WindowView {

    constructor() {
        super();

        $(document).ready(() => {
            $('#closeCurrentLecturesButton').off();
            $('#closeCurrentLecturesButton').click(() => {
                new EventManager().handleClearInterval();
                $('#currentLectures').hide();
            })
        })
    }

    draw(lectures) {
        $('#currentLecturesContainer').empty();
        $('#nolecture').empty();

        if (lectures.length < 1) {
            $('#nolecture').text("Lectures will be shown here 10 minutes before the start. Please check the schedule and come back later.")
        }
        lectures.forEach(lecture => {
            var startingTime = new DateParser(new Date(lecture.startingTime)).parseOnlyTime();

            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-5 m-5 pt-3">
                    <h5 style="display:inline">${lecture.title} </h5>
                    <div>${lecture.remarks}</div>
                    <div class="small">${"By " + lecture.oratorName}</div>
                    <br>
                    <div class="small">${"Start: " + startingTime + " || Duration: " + Math.floor(lecture.duration / 60) + " minutes" + " || Seat: " + lecture.maxParticipants + " participants"}</div>
                    <span id="${"full" + lecture.id}" style="color: red; display:none" class="align-self-end mt-1 p-2">Lecture is currently full.</span>
                    <button id='${"show" + lecture.id}' class="btn btn-lecture m-2 align-self-end mt-auto">Show</button>
                </div>

                <script> 
                    $('#show' + '${lecture.id}').on('click', function (event) {
                        $('#show' + '${lecture.id}').hide();
                        new EventManager().handleLectureClicked("${lecture.id}");
                    })
                </script>
            `)
        });

        $('#currentLectures').show(); // TODO: maybe move somewhere else if logic requires it
    }

    drawLectureFull(lectureId) {
        $('#show' + lectureId).hide();
        $('#full' + lectureId).show()
    }

}