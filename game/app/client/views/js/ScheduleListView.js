class ScheduleListView extends WindowView {

    #lectures = [];

    constructor() {
        super();
    }

    draw(lectures) {
        lectures.forEach(lecture => {
            lecture.startingTime = new Date(lecture.startingTime);
        });

        const sortedLectures = lectures.slice().sort((a, b) => a.startingTime - b.startingTime)
        this.#lectures = sortedLectures;
        var startingTime = new DateParser(lecture.startingTime).parse();
        var count = 1;

        this.#lectures.forEach(lecture => {
            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
                <tr>
                    <th scope="row">${count++}</th>
                    <td>${lecture.title}</td>
                    <td>${lecture.oratorName}</td>
                    <td>${startingTime}</td>
                    <td>${lecture.maxParticipants}</td>
                    <td>${(lecture.remarks == ''?'-':'' + lecture.remarks)}</td>
                </tr>
            `)
        })

        $('#scheduleModal').on('hidden.bs.modal', function (e) {
            $('#scheduleModal .modal-body #schedule > tbody:last-child').empty()
        })
    }   

    onclick() {
        return new EventManager().handleScheduleClicked();
    }
}
