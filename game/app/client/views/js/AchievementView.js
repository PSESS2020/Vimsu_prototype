class AchievementView extends WindowView {

    constructor() {
        super()
    }


    draw(achievements) {
        $('#achievementModalContent').empty();

        achievements.forEach(achievement => {
            var level = achievement.currentLevel;
            var maxLevel = achievement.maxLevel;
            var color = achievement.color;
            var blur = (level === 0) ? 'achievement-blur' : '';

            $('#achievementModalContent').append(`
                <div class="col-4 d-flex flex-column align-items-center text-center">
                    <i style="color: ${color} !important; text-shadow: 4px 4px 25px ${color};" class="fas fa-${achievement.icon} achievement-icon ${blur} mb-5 mt-4"></i>
                    
                    <b>${achievement.title} [${level} / ${maxLevel}]</b>
                    <small>${achievement.description}</small>
                </div>
            `)
        })

    }

    onclick() {
        return new EventManager().handleAchievementsClicked();
    }
}