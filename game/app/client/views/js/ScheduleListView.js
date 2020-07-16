class ScheduleListView extends WindowView {

    #lectures = [];

    constructor() {
        super();
    }

    draw(lectures) {
        for (var i = 0; i < lectures.length; i++) {
            lectures[i].startingTime = new Date(lectures[i].startingTime);
            console.log(lectures[i].startingTime)
        }

        const sortedLectures = lectures.slice().sort((a, b) => a.startingTime.getTime() - b.startingTime.getTime())
        for (var i = 0; i < sortedLectures.length; i++) {
            console.log(sortedLectures[i].startingTime)
        }
        this.#lectures = sortedLectures;

        for (var i = 0; i < this.#lectures.length; i++) {

            var startingTime = this.#lectures[i].startingTime;
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var orator = this.#lectures[i].accountsData[0];
            $('#scheduleModal .modal-body #schedule > tbody:last-child').append(`
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>${this.#lectures[i].title}</td>
                    <td>${this.#lectures[i].maxParticipants}</td>
                    <td>${orator.title + " " + orator.forename + " " + orator.surname}</td>
                    <td>${days[startingTime.getDay()] + ", " + startingTime.getDate() + "/" + startingTime.getMonth() + "/" + startingTime.getFullYear() 
                    + " " + startingTime.getHours() + ":" + (startingTime.getMinutes()<10?'0':'') + startingTime.getMinutes()}</td>
                    <td>${(this.#lectures[i].remarks == ''?'-':'' + this.#lectures[i].remarks)}</td>
                </tr>
            `)
        }

        $('#scheduleModal').on('hidden.bs.modal', function (e) {
            $('#scheduleModal .modal-body #schedule > tbody:last-child').empty()
        })
    }   

    onclick() {
        return new EventManager().handleScheduleClicked();
    }
}
