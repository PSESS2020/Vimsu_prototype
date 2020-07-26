class RankListView extends WindowView {

    #rankList;
    constructor() {
        super()
    }

    draw(rankList) {

        $('#rankListModal .modal-body .card-columns').empty();
        this.#rankList = rankList;

        this.#rankList.forEach(ppant => {
            if(ppant.self) {
                $('#rankListModal .modal-body .card-columns').append(`
                <div class="card currentLecturesContainer" style="border-color: gold">
                    <div class="card-body">
                        <div class="row card-text">
                            <div class="col-lg">${ppant.rank}</div>
                            <div class="col-lg-6">${ppant.username}</div>
                            <div class="col-lg">${ppant.points + "P"}</div>
                        </div>
                    </div>
                </div>
            `)
            } else {
                $('#rankListModal .modal-body .card-columns').append(`
                    <div class="card currentLecturesContainer">
                        <div class="card-body">
                            <div class="row card-text">
                                <div class="col-lg">${ppant.rank}</div>
                                <div class="col-lg-6">${ppant.username}</div>
                                <div class="col-lg">${ppant.points + "P"}</div>
                            </div>
                        </div>
                    </div>
                `)
            }
        })
    }


    onclick() {
        new EventManager().handleRankListClicked();
    }
}