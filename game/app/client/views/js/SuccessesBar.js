class SuccessesBar extends Views {

    constructor() {
        super();

        if (!!SuccessesBar.instance) {
            return SuccessesBar.instance;
        }

        SuccessesBar.instance = this;
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