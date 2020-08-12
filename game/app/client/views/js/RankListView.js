class RankListView extends WindowView {

    #rankList;
    constructor() {
        super()
    }

    draw(rankList) {

        $('#rankListModal .modal-body .card-columns').empty();
        this.#rankList = rankList;

        this.#rankList.forEach(ppant => {
            $('#rankListModal .modal-body .card-columns').append(`
                <div class="card currentLecturesContainer" id="${"rank" + ppant.participantId}" style="border-radius: 0px; border-color: #A9A9A9; color: #A9A9A9; border-style: groove;">
                    <div class="card-body">
                        <div class="row card-text" id="${"cardtext" + ppant.participantId}">
                            <div class="col-lg">${ppant.rank}</div>
                            <div class="col-lg-6">${ppant.username}</div>
                            <div class="col-lg">${ppant.points + "P"}</div>
                        </div>
                    </div>
                </div>
            `)

            if (ppant.rank == 1) {
                $('#rank' + ppant.participantId)[0].style.borderColor = "gold";
                $('#cardtext' + ppant.participantId)[0].style.fontWeight = "bold";
                $('#cardtext' + ppant.participantId)[0].style.color = "gold";
            } else if (ppant.rank == 2) {
                $('#rank' + ppant.participantId)[0].style.borderColor = "antiquewhite";
                $('#cardtext' + ppant.participantId)[0].style.fontWeight = "bold";
                $('#cardtext' + ppant.participantId)[0].style.color = "antiquewhite";
            } else if (ppant.rank == 3) {
                $('#rank' + ppant.participantId)[0].style.borderColor = "#f79736";
                $('#cardtext' + ppant.participantId)[0].style.fontWeight = "bold";
                $('#cardtext' + ppant.participantId)[0].style.color = "#f79736";
            }

            if (ppant.self) {
                $('#rank' + ppant.participantId)[0].style.backgroundColor = 'rgba(' + 39 + ',' + 81 + ',' + 94 + ',' + 0.699 + ')';
            }
        })
    }


    onclick() {
        new EventManager().handleRankListClicked();
    }
}