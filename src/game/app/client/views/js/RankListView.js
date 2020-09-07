/**
 * The Rank List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class RankListView extends WindowView {

    #rankList;

    /**
     * Creates an instance of RankListView
     */
    constructor() {
        super();

        if (!!RankListView.instance) {
            return RankListView.instance;
        }

        RankListView.instance = this;
    }

    /**
     * Draws rank list window
     * 
     * @param {Object[]} rankList rank list
     */
    draw(rankList) {
        $('#rankListModal .modal-body .card-columns').empty();
        this.#rankList = rankList;

        this.#rankList.forEach(ppant => {

            var color;

            if (ppant.rank == 1)
                color = 'gold';           
            else if (ppant.rank == 2)
                color = 'antiquewhite';
            else if (ppant.rank == 3)
                color = '#f79736';
            else
                color = '#A9A9A9';
            

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
}