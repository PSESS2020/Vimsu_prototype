class NewAchievementView extends WindowView {

    #confetti;

    constructor() {
        super()
    }

    draw(achievement) {
        $('#confettiCanvas').hide();
        this.#confetti.clear();
        $('#newAchievementModalContent').empty();

        $('#newAchievementModalContent').append(
            `<div class="col-12 d-flex flex-column align-items-center text-center">
                <i style="color: ${achievement.color} !important; text-shadow: 4px 4px 25px ${achievement.color}; font-size: 250px;" class="fa fa-${achievement.icon} achievement-icon mb-5 mt-4 animate__animated animate__wobble animate__slow animate__infinite"></i>
                <b style="font-size: 35px">${achievement.title} Level ${achievement.currentLevel} Now Unlocked!</b>
                <div class="mb-4">You have unlocked a new achievement: ${achievement.description}</div>
            </div>`
        );

        var confettiSettings = { target: 'confettiCanvas' };
        this.#confetti = new ConfettiGenerator(confettiSettings);
        this.#confetti.render();

        $('#newAchievementModal').modal('show');
        $('#confettiCanvas').show();
    }
}