/**
 * The Achievement Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class AchievementView extends WindowView {

    /**
     * Creates an instance of Achievement View
     * 
     * @param {json} languageData language data for achievement view
     */
    constructor(languageData) {
        super(languageData);

        if (!!AchievementView.instance) {
            return AchievementView.instance;
        }

        AchievementView.instance = this;
        
        $('#yourAchievementsText').text(this.languageData.yourAchievements);
    }

    /**
     * Draws achievement window
     * 
     * @param {Object[]} achievements achievements
     */
    draw(achievements) {
        const achievementsContent = $('#achievementModalContent');

        $('#achievementWait').hide();
        achievementsContent.empty();

        achievements.forEach(achievement => {
            var level = achievement.currentLevel;
            var maxLevel = achievement.maxLevel;
            var currentCount = achievement.currentCount;
            var nextTarget = achievement.nextTarget;

            var next;
            if (nextTarget)
                next = this.languageData.nextTarget.replace('<currentCount>', currentCount).replace('<nextTarget>', nextTarget);
            else
                next = this.languageData.completed;

            var color = achievement.color;
            var blur = (level === 0) ? 'achievement-blur' : '';

            achievementsContent.append(`
                <div class="col-4 d-flex flex-column align-items-center text-center">
                    <i style="color: ${color}; text-shadow: 0.25rem 0.25rem 1.5625rem ${color};" class="fas fa-${achievement.icon} fa-5x achievement-icon ${blur} mb-5 mt-4"></i>
                    
                    <small style="opacity: 0.5"><b>${next}</b></small>
                    <small style="opacity: 0.5"> ${this.languageData.level}: [${level} / ${maxLevel}]</small>
                    <br>
                    <b>${achievement.title}</b>
                    <small>${achievement.description}</small>
                    <br><br>
                </div>
            `);
        });
    }
}