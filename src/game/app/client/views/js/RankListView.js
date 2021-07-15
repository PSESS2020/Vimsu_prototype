/**
 * The Rank List Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class RankListView extends WindowView {

    rankList;
    eventManager;

    /**
     * Creates an instance of RankListView
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for ranklist view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!RankListView.instance) {
            return RankListView.instance;
        }

        RankListView.instance = this;

        this.eventManager = eventManager;

        $('#bestParticipantsText').text(this.languageData.bestParticipants);
    }

    /**
     * Draws rank list window
     * 
     * @param {Object[]} rankList rank list
     * @param {String} ownUsername current participant username
     * @param {Boolean} emptyRankList true if ranklist should be emptied
     */
    draw(rankList, ownUsername, emptyRankList) {
        const rankListModal = $('#rankListModal .modal-body #ranklistrow');
        $('#ranklistwait').hide();

        if (emptyRankList) {
            rankListModal.empty();
            this.rankList = [];
        }

        if (rankList.length < 1) {
            if (emptyRankList) {
                $('#noranklist').text(this.languageData.noParticipants);
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


            rankListModal.append(`
                <div class="col-sm-4 mb-2 mt-2">
                    <div class="card currentLecturesContainer" id="${"rank" + ppant.participantId}" style="border-radius: 0rem; border-color: ${color}; border-style: groove;">
                        <div class="card-body">
                            <div class="card-text" id="${"cardtext" + ppant.participantId}">
                                <div class="row">
                                    <div class="col-1 pr-0 text-nowrap" style="color: ${color}">${ppant.rank}</div>
                                    <div class="col-8 pr-0 text-truncate" style="color: ${color}" title="${ppant.username}" data-toggle="tooltip">${ppant.username}</div>
                                    <div class="col-3 pl-0 text-right text-truncate" style="color: ${color}" title="${ppant.points + "P"}" data-toggle="tooltip">${ppant.points + "P"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            if (ppant.rank == 1 || ppant.rank == 2 || ppant.rank == 3)
                document.getElementById("cardtext" + ppant.participantId).style.fontWeight = "bold";

            if (ppant.username === ownUsername)
                document.getElementById("rank" + ppant.participantId).style.boxShadow = '0 0 0.25rem 0.25rem ' + color;
        });

        modalBody.data('ready', true).on('scroll', () => {
            if (modalBody.data('ready') == false) return;

            if (modalBody.scrollTop() + modalBody.innerHeight() >= (modalBody[0].scrollHeight)) {    
                modalBody.data('ready', false);
                const lastPpant = this.rankList[this.rankList.length - 1];
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