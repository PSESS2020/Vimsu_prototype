class ScheduleListView extends WindowView {

    #lectures = [];

    constructor() {
        super();
    }

    draw(lectures) {

        $('#scheduleModal .modal-body #noschedule').empty();
        if (lectures.length < 1) {
            $('#scheduleModal .modal-body #noschedule').text("Sorry, no lecture is found.")
        }

        lectures.forEach(lecture => {
            lecture.startingTime = new Date(lecture.startingTime);
        });

        const sortedLectures = lectures.slice().sort((a, b) => a.startingTime - b.startingTime)
        this.#lectures = sortedLectures;
        var count = 1;
        var now = new Date();

        this.#lectures.forEach(lecture => {
            var startingTime = new DateParser(lecture.startingTime).parse();
            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
                <tr id="${"schedulerow" + lecture.id}">
                    <th scope="row">${count++}</th>
                    <td>${lecture.title}</td>
                    <td>${lecture.oratorName}</td>
                    <td>${startingTime}</td>
                    <td>${lecture.maxParticipants}</td>
                    <td>${(lecture.remarks == '' ? '-' : '' + lecture.remarks)}</td>
                </tr>
            `)

            if(lecture.startingTime <= now) {
                $('#schedulerow' + lecture.id)[0].style.opacity = "0.5";
            }
        })

        $('#scheduleModal').on('hidden.bs.modal', function (e) {
            $('#scheduleModal .modal-body #schedule > tbody:last-child').empty()
        })
    }

    onclick() {
        return new EventManager().handleScheduleClicked();
    }
}
