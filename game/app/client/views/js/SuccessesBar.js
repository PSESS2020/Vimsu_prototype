class SuccessesBar extends Views {

    constructor() {
        super();
    }

    update(points, rank) {
        if (points) {
            $('#pointBox').empty()
            $('#pointBox').text(points);
        }

        if (rank) {
            $('#rankBox').empty()
            $('#rankBox').text(rank);
        }
    }
}