class ScheduleListView extends WindowView {

    #lectures = [];

    constructor() {
        super();
    }

    draw(lectures) {
        $('#scheduleModal .modal-body #noschedule').empty();

        if (lectures.length < 1) {
            $('#scheduleModal .modal-body #noschedule').text("Sorry, no lecture is found.")
        } else {
            lectures.forEach(lecture => {
                lecture.startingTime = new Date(lecture.startingTime);
            });

            const sortedLectures = lectures.slice().sort((a, b) => a.startingTime - b.startingTime);
            this.#lectures = sortedLectures;

            this.drawSchedule();
            
            var interval = setInterval(() => {
                this.drawSchedule();
            }, 1000);

            $('#scheduleModal').on('hidden.bs.modal', function (e) {
                clearInterval(interval);
            })
        }
    }

    drawSchedule() {
        $('#scheduleModal .modal-body #schedule > tbody:last-child').empty()

        var count = 1;
        var now = new Date().getTime();

        this.#lectures.forEach(lecture => {
            var startingTime = lecture.startingTime.getTime();
            var startToShow = startingTime - Settings.SHOWLECTURE;
            var stopToShow = startingTime + lecture.duration * 1000;
            if (startToShow <= now && now < startingTime) {
                var status = LectureStatus.OPENED;
            } else if (stopToShow < now) {
                var status = LectureStatus.OVER;
            } else if (now < startToShow) {
                var status = LectureStatus.PENDING;
            } else if (now >= startingTime && now <= stopToShow) {
                var status = LectureStatus.RUNNING;
            }

            var startingTime = new DateParser(lecture.startingTime).parse();
            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
                <tr id="${"schedulerow" + lecture.id}">
                    <th scope="row">${count++}</th>
                    <td>${lecture.title}</td>
                    <td>${lecture.oratorName}</td>
                    <td>${startingTime}</td>
                    <td>${Math.floor(lecture.duration / 60)}</td>
                    <td>${lecture.maxParticipants}</td>
                    <td>${(lecture.remarks == '' ? '-' : '' + lecture.remarks)}</td>
                    <td>${status}</td>
                </tr>
            `)

            if (status === LectureStatus.OVER) {
                $('#schedulerow' + lecture.id)[0].style.opacity = "0.5";
            } else if (status === LectureStatus.RUNNING || status === LectureStatus.OPENED) {
                $('#schedulerow' + lecture.id)[0].style.backgroundColor = 'rgba(' + 34 + ',' + 43 + ',' + 46 + ',' + 1 + ')';
            }
        })
    }

    onclick() {
        return new EventManager().handleScheduleClicked();
    }
}
