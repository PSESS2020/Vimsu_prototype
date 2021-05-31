/**
 * The New Achievement Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NewAchievementView extends WindowView {

    confetti;

    /**
     * Creates an instance of NewAchievementView
     */
    constructor() {
        super();

        if (!!NewAchievementView.instance) {
            return NewAchievementView.instance;
        }

        NewAchievementView.instance = this;

        $("#newAchievementModal").on("hidden.bs.modal", () => {
            $('#confettiCanvas').hide();
            this.confetti.clear();
        });
    }

    /**
     * Draws new achievement window
     * 
     * @param {Object} achievement achievement
     */
    draw(achievement) {
        $('#newAchievementModalContent').empty();

        $('#newAchievementModalContent').append(
            `<div class="col-12 d-flex flex-column align-items-center text-center">
                <i style="color: ${achievement.color} !important; text-shadow: 0.25rem 0.25rem 1.5625rem ${achievement.color}; font-size: 15.625rem;" class="fa fa-${achievement.icon} achievement-icon mb-5 mt-4 animate__animated animate__wobble animate__slow animate__infinite"></i>
                <b style="font-size: 2.1875rem">${achievement.title} Level ${achievement.currentLevel} Now Unlocked!</b>
                <div class="mb-4">You have unlocked a new achievement: ${achievement.description}</div>
            </div>`
        );

        var confettiSettings = { target: 'confettiCanvas' };
        this.confetti = new ConfettiGenerator(confettiSettings);
        this.confetti.render();

        $('#newAchievementModal').modal('show');
        $('#confettiCanvas').show();
    }
}