class SuccessesBar extends Views{

    constructor(){
        super();
    }

    update(points, rank) {
        if(points) {
            $('#pointBox').empty()
            $('#pointBox').append(`${points}`)
        }

        if(rank) {
            $('#rankBox').empty()
            $('#rankBox').append(`${rank}`)
        }
    }
}