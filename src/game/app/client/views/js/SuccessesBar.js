/**
 * The Successes Bar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class SuccessesBar extends Views {

    /**
     * @constructor Creates an instance of SuccessesBar
     */
    constructor() {
        super();

        if (!!SuccessesBar.instance) {
            return SuccessesBar.instance;
        }

        SuccessesBar.instance = this;
    }

    /**
     * Updates points and rank
     * 
     * @param {?number} points points
     * @param {?number} rank rank
     */
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