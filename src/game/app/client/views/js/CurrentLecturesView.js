/**
 * The Current Lectures Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class CurrentLecturesView extends WindowView {

    eventManager;

    /**
     * Creates an instance of CurrentLecturesView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for currentLectures view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!CurrentLecturesView.instance) {
            return CurrentLecturesView.instance;
        }

        CurrentLecturesView.instance = this;

        this.eventManager = eventManager;

        $('#closeCurrentLecturesButton').off();
        $('#closeCurrentLecturesButton').on('click', () => {
            this.eventManager.handleClearInterval();
            $('#currentLectures').hide();
        });

        $('#currentLecturesText').text(this.languageData.currentLectures);
    }

    /**
     * Draws current lectures window
     * 
     * @param {Object[]} lectures lectures
     */
    draw(lectures) {
        $('#currentLecturesContainer').empty();
        $('#nolecture').empty();

        if (lectures.length < 1) {
            $('#nolecture').text(this.languageData.noLectures);
            $('#currentLectures').show();
            return;
        }

        lectures.forEach(lecture => {
            var startingTime = new DateParser().parseOnlyTime(new Date(lecture.startingTime));

            $('#currentLecturesContainer').append(`
                <div class="currentLecturesContainer d-flex flex-column align-items-start col-5 m-3 p-3">
                    <h5 style="display:inline">${lecture.title} </h5>
                    <div>${lecture.remarks}</div>
                    <div class="small">${this.languageData.by + " " + lecture.oratorName}</div>
                    <br>
                    <div class="small">${this.languageData.start + ": " + startingTime + " || " + this.languageData.duration + ": " + Math.floor(lecture.duration / 60) + " " + 
                                    this.languageData.minutes + " || " + this.languageData.seats + ": " + lecture.maxParticipants + " " + this.languageData.participants}</div>
                    <span id="${"full" + lecture.id}" style="color: red; display:none" class="align-self-end mt-1 p-2">${this.languageData.fullLecture}</span>
                    <button id='${"show" + lecture.id}' class="btn btn-blue m-2 align-self-end mt-auto">${this.languageData.enter}</button>
                </div>
            `);

            $('#show' + lecture.id).on('click', () => {
                $('#show' + lecture.id).hide();
                this.eventManager.handleLectureClicked(lecture.id);
            });
        });

        $('#currentLectures').show();
    }

    /**
     * Draws lecture full on current lectures window
     * 
     * @param {String} lectureId lecture ID
     */
    drawLectureFull(lectureId) {
        $('#show' + lectureId).hide();
        $('#full' + lectureId).show();
    }

}