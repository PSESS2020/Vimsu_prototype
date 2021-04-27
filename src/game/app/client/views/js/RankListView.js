/**
 * The Rank List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class RankListView extends WindowView {

    rankList;
    eventManager

    /**
     * Creates an instance of RankListView
     * 
     * @param {EventManager} eventManager event manager
     */
    constructor(eventManager) {
        super();

        if (!!RankListView.instance) {
            return RankListView.instance;
        }

        RankListView.instance = this;

        this.eventManager = eventManager;
    }

    /**
     * Draws rank list window
     * 
     * @param {Object[]} rankList rank list
     * @param {String} ownUsername current participant username
     * @param {Boolean} emptyRankList true if ranklist should be emptied
     */
    draw(rankList, ownUsername, emptyRankList) {
        $('#ranklistwait').hide();

        if (emptyRankList) {
            $('#rankListModal .modal-body #ranklistrow').empty();
            this.rankList = [];
        }

        if (rankList.length < 1) {
            if (emptyRankList) {
                $('#noranklist').text("There are no participants in this conference yet.");
            }
            
            return;
        }

        const modalBody = $('#rankListModal .modal-body');
        modalBody.data('ready', true);
        
        this.rankList = this.rankList.concat(rankList);

        rankList.forEach(ppant => {

            var color;

            if (ppant.rank == 1)
                color = 'gold';
            else if (ppant.rank == 2)
                color = 'antiquewhite';
            else if (ppant.rank == 3)
                color = '#f79736';
            else
                color = '#A9A9A9';


            $('#rankListModal .modal-body #ranklistrow').append(`
                <div class="col-sm-4 mb-2 mt-2">
                    <div class="card currentLecturesContainer" id="${"rank" + ppant.participantId}" style="border-radius: 0px; border-color: ${color}; color: ${color}; border-style: groove;">
                        <div class="card-body">
                            <div class="card-text" id="${"cardtext" + ppant.participantId}">
                                <div class="row">
                                    <div class="col-md-auto">${ppant.rank}</div>
                                    <div class="col-md-auto">${ppant.username}</div>
                                    <div class="col text-right">${ppant.points + "P"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)

            if (ppant.rank == 1 || ppant.rank == 2 || ppant.rank == 3)
                document.getElementById("cardtext" + ppant.participantId).style.fontWeight = "bold";

            if (ppant.username === ownUsername)
                document.getElementById("rank" + ppant.participantId).style.boxShadow = '0 0 4px 4px ' + color;
        })

        modalBody.data('ready', true).on('scroll', () => {
            if (modalBody.data('ready') == false) return;

            if (modalBody.scrollTop() + modalBody.innerHeight() >= (modalBody[0].scrollHeight)) {    
                modalBody.data('ready', false);
                const lastPpant = this.rankList[this.rankList.length - 1]
                const lastRank = lastPpant.rank;
                const lastPoints = lastPpant.points;
                let lastPointsLength = 1;
                
                for (let i = this.rankList.length - 1; i-- > 0;) {
                    if (this.rankList[i].points !== lastPoints)
                        break;
                        
                    ++lastPointsLength;
                }

                this.eventManager.handleLoadMoreRankList(this.rankList.length, lastRank, lastPoints, lastPointsLength);
            }
        });
    }
}