const NORMAL = '#A9A9A9';
const FIRST = 'gold';
const SECOND = 'antiquewhite';
const THIRD = '#f79736'

class RankListView extends WindowView {

    #rankList;
    constructor() {
        super()
    }

    draw(rankList) {

        $('#rankListModal .modal-body .card-columns').empty();
        this.#rankList = rankList;

        this.#rankList.forEach(ppant => {

            var color;

            if (ppant.rank == 1) {
                color = FIRST;           
            } else if (ppant.rank == 2) {
                color = SECOND;
            } else if (ppant.rank == 3) {
                color = THIRD;
            } else {
                color = NORMAL;
            }

            $('#rankListModal .modal-body .card-columns').append(`
                <div class="card currentLecturesContainer" id="${"rank" + ppant.participantId}" style="border-radius: 0px; border-color: ${color}; color: ${color}; border-style: groove;">
                    <div class="card-body">
                        <div class="row card-text" id="${"cardtext" + ppant.participantId}">
                            <div class="col-lg">${ppant.rank}</div>
                            <div class="col-lg-6">${ppant.username}</div>
                            <div class="col-lg">${ppant.points + "P"}</div>
                        </div>
                    </div>
                </div>
            `)

            if (ppant.rank == 1 || ppant.rank == 2 || ppant.rank == 3) 
                $('#cardtext' + ppant.participantId)[0].style.fontWeight = "bold";

            if (ppant.self) {
                $('#rank' + ppant.participantId)[0].style.boxShadow = '0 0 4px 4px ' + color;
            }
        })
    }


    onclick() {
        new EventManager().handleRankListClicked();
    }
}