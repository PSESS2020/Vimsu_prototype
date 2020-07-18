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
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var count = 1;

        this.#lectures.forEach(lecture => {
            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
                <tr>
                    <th scope="row">${count++}</th>
                    <td>${lecture.title}</td>
                    <td>${lecture.oratorName}</td>
                    <td>${days[lecture.startingTime.getDay()] + ", " + (lecture.startingTime.getDate()<10?'0':'') + lecture.startingTime.getDate() + "/" + (lecture.startingTime.getMonth()<10?'0':'') + lecture.startingTime.getMonth() + "/" + lecture.startingTime.getFullYear() 
                    + " " + (lecture.startingTime.getHours()<10?'0':'') + lecture.startingTime.getHours() + ":" + (lecture.startingTime.getMinutes()<10?'0':'') + lecture.startingTime.getMinutes()}</td>
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
