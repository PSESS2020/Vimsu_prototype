class CurrentLecturesView extends WindowView {

    constructor(){
        super();
    }

    draw(lectures) {
        $('#currentLecturesContainer').empty();
        
        lectures.forEach(lecture => {
            // this is really messy i know, should move it somewhere else
            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-4 m-1 pt-2">
                    <h5>${lecture.title}</h5>
                    <div class="small">${lecture.oratorName + " || " + lecture.maxParticipants + " seats"}</div>
                    <div>${lecture.remarks}</div>
                    <button id=('${lecture.id}') class="btn btn-lecture m-2 align-self-end mt-auto" onclick="(new EventManager()).handleLectureClicked('${lecture.id}')">Show</button>
                </div>
            `)
        });

        $('#currentLectures').show(); // TODO: maybe move somewhere else if logic requires it
    }

}