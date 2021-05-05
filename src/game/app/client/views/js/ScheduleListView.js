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
     */
    constructor() {
        super();

        if (!!ScheduleListView.instance) {
            return ScheduleListView.instance;
        }

        ScheduleListView.instance = this;

        this.lectures = [];
    }

    /**
     * Sorts lecture according to starting time and then draws schedule window every 1 second
     * 
     * @param {Object[]} lectures all lectures
     * @param {number} timeOffset offset if client has different local time than the server
     */
    draw(lectures, timeOffset) {
        $('#scheduleWait').hide()
        $('#noschedule').empty();
        $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();

        if (lectures.length < 1) {
            $('#noschedule').text("Sorry, no lecture is found.");
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
        })
    }

    /**
     * draws schedule window
     */
    drawSchedule = function (interval) {
        $('#scheduleModal .modal-body #schedule > tbody:last-child').empty();
        
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
                var status = LectureStatus.OPENED;
                var seconds = (-1) * Math.round(currentTimeDifferenceStartingTime / 1000) + " secs";
            } else if (currentTimeDifferenceStartingTime >= 0 && currentTimeDifferenceStopToShow <= 0) {
                var status = LectureStatus.RUNNING;
                var seconds = Math.round(currentTimeDifferenceStartingTime / 1000) + " secs";
            } else if (currentTimeDifferenceStartToShow < 0 && currentTimeDifferenceStartingTime < 0) {
                var status = LectureStatus.PENDING;
                var seconds = '';
            } else {
                //expired lectures won't be shown
                return;
            }

            var startingTime = new DateParser(lecture.startingTime).parse();

            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
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
            `)

            if (status === LectureStatus.RUNNING || status === LectureStatus.OPENED) {
                document.getElementById("schedulerow" + lecture.id).style.backgroundColor = 'rgba(' + 34 + ',' + 43 + ',' + 46 + ',' + 1 + ')';
            }
        })

        if (count === 0) {
            $('#noschedule').text("Sorry, all lectures have expired.");
            clearInterval(interval);
        }
    }
}
