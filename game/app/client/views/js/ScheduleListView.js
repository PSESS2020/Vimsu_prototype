class ScheduleListView extends WindowView {

    constructor() {
        super();
    }

    /*draw() {
        throw new Error('draw() has to be implemented!');
    }*/

    onclick() {
        $('#scheduleModal').on('shown.bs.modal', function (event) {
            event.preventDefault();
            $(".modal-body").text('pass your text here');
        })
    }   
}
