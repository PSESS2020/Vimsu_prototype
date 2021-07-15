/**
 * The Schedule List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ScheduleListView extends WindowView {

    lectures;
    timeOffset;

    /**
     * Creates an instance of ScheduleListView
     * 
     * @param {json} languageData language data for schedule view
     */
    constructor(languageData) {
        super(languageData);

        if (!!ScheduleListView.instance) {
            return ScheduleListView.instance;
        }

        ScheduleListView.instance = this;

        this.lectures = [];

        $('#scheduleListText').text(this.languageData.scheduleList);
        $('#lectureTitleText').text(this.languageData.lectureTitle);
        $('#oratorNameText').text(this.languageData.oratorName);
        $('#startingTimeText').text(this.languageData.startingTime);
        $('#durationInMinText').text(this.languageData.durationInMin);
        $('#seatAmountText').text(this.languageData.seatAmount);
        $('#remarksText').text(this.languageData.remarks);
        $('#statusText').text(this.languageData.status);
    }

    /**
     * Sorts lecture according to starting time and then draws schedule window every 1 second
     * 
     * @param {Object[]} lectures all lectures
     * @param {number} timeOffset offset if client has different local time than the server
     */
    draw(lectures, timeOffset) {
        $('#scheduleWait').hide();
        $('#noschedule').empty();
        $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();

        if (lectures.length < 1) {
            $('#noschedule').text(this.languageData.noLectureFound);
            return;
        }

        lectures.forEach(lecture => {
            lecture.startingTime = new Date(lecture.startingTime);
        });

        const sortedLectures = lectures.slice().sort((a, b) => a.startingTime - b.startingTime);
        this.lectures = sortedLectures;
        this.timeOffset = timeOffset;

        this.drawSchedule();

        var interval = setInterval(() => {
            this.drawSchedule(interval);
        }, 1000);

        $('#scheduleModal').on('hide.bs.modal', (e) => {
            clearInterval(interval);
        });
    }

    /**
     * draws schedule window
     */
    drawSchedule = function (interval) {
        const scheduleBody = $('#scheduleModal .modal-body #schedule > tbody:last-child');
        scheduleBody.empty();
        
        var count = 0;
        var now = Date.now();

        this.lectures.forEach(lecture => {
            var startingTime = lecture.startingTime.getTime();
            var startToShow = startingTime - Settings.SHOWLECTURE;
            var stopToShow = startingTime + lecture.duration * 1000;

            var currentTimeDifferenceStartingTime = now - startingTime - this.timeOffset;
            var currentTimeDifferenceStartToShow = now - startToShow - this.timeOffset;
            var currentTimeDifferenceStopToShow = now - stopToShow - this.timeOffset;

            if (currentTimeDifferenceStartToShow >= 0 && currentTimeDifferenceStartingTime < 0) {
                var status = this.languageData.states[LectureStatus.OPENED];
                var seconds = (-1) * Math.round(currentTimeDifferenceStartingTime / 1000) + " " + this.languageData.seconds;
            } else if (currentTimeDifferenceStartingTime >= 0 && currentTimeDifferenceStopToShow <= 0) {
                var status = this.languageData.states[LectureStatus.RUNNING];
                var seconds = Math.round(currentTimeDifferenceStartingTime / 1000) + " " + this.languageData.seconds;
            } else if (currentTimeDifferenceStartToShow < 0 && currentTimeDifferenceStartingTime < 0) {
                var status = this.languageData.states[LectureStatus.PENDING];
                var seconds = '';
            } else {
                //expired lectures won't be shown
                return;
            }

            var startingTime = new DateParser().parse(lecture.startingTime);

            scheduleBody.append(`
                <tr id="${"schedulerow" + lecture.id}">
                    <th scope="row">${++count}</th>
                    <td>${lecture.title}</td>
                    <td>${lecture.oratorName}</td>
                    <td>${startingTime}</td>
                    <td>${Math.floor(lecture.duration / 60)}</td>
                    <td>${lecture.maxParticipants}</td>
                    <td>${(lecture.remarks == '' ? '-' : '' + lecture.remarks)}</td>
                    <td>${status}<br><br><small style="opacity: 0.5">${seconds}</small></td>
                </tr>
            `);

            if (status === this.languageData.states[LectureStatus.RUNNING] || status === this.languageData.states[LectureStatus.OPENED]) {
                document.getElementById("schedulerow" + lecture.id).style.backgroundColor = 'rgba(' + 34 + ',' + 43 + ',' + 46 + ',' + 1 + ')';
            }
        });

        if (count === 0) {
            $('#noschedule').text(this.languageData.allExpired);
            clearInterval(interval);
        }
    }
}
