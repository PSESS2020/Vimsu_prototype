/**
 * The Achievement Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AchievementView extends WindowView {

    /**
     * Creates an instance of Achievement View
     */
    constructor() {
        super();

        if (!!AchievementView.instance) {
            return AchievementView.instance;
        }

        AchievementView.instance = this;
    }

    /**
     * Draws achievement window
     * 
     * @param {Object[]} achievements achievements
     */
    draw(achievements) {
        $('#achievementWait').hide();
        $('#achievementModalContent').empty();

        achievements.forEach(achievement => {
            var level = achievement.currentLevel;
            var maxLevel = achievement.maxLevel;
            var currentCount = achievement.currentCount;
            var nextTarget = achievement.nextTarget;

            if (nextTarget) {
                var next = "Next target: [" + currentCount + " / " + nextTarget + "]";
            } else {
                var next = "Completed";
            }

            var color = achievement.color;
            var blur = (level === 0) ? 'achievement-blur' : '';

            $('#achievementModalContent').append(`
                <div class="col-4 d-flex flex-column align-items-center text-center">
                    <i style="color: ${color}; text-shadow: 0.25rem 0.25rem 1.5625rem ${color};" class="fas fa-${achievement.icon} fa-5x achievement-icon ${blur} mb-5 mt-4"></i>
                    
                    <small style="opacity: 0.5"><b>${next}</b></small>
                    <small style="opacity: 0.5">Level: [${level} / ${maxLevel}]</small>
                    <br>
                    <b>${achievement.title}</b>
                    <small>${achievement.description}</small>
                    <br><br>
                </div>
            `);
        });
    }
}