/**
 * The Successes Bar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class SuccessesBar extends AbstractView {

    /**
     * Creates an instance of SuccessesBar
     */
    constructor() {
        super();

        if (!!SuccessesBar.instance) {
            return SuccessesBar.instance;
        }

        SuccessesBar.instance = this;
    }

    /**
     * Updates points
     * 
     * @param {number} points points
     */
    updatePoints(points) {
        $('#pointBox').empty();
        $('#pointBox').text(points);

    }

    /**
     * Updates rank
     * 
     * @param {?number} rank rank
     */
    updateRank(rank) {
        $('#rankBox').empty();

        if (rank)
            $('#rankBox').text(rank);
        else
            $('#rankBox').text("-");
    }
}