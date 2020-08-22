class AchievementView extends WindowView {

    constructor() {
        super();

        $('#achievementsModal').on('hidden.bs.modal', function (e) {
            $('#achievementModalContent').empty();
        })
    }


    draw(achievements) {

        achievements.forEach(achievement => {
            var level = achievement.currentLevel;
            var maxLevel = achievement.maxLevel;
            var currentCount = achievement.currentCount;
            var nextTarget = achievement.nextTarget;

            if(nextTarget) {
                var next = "Next target: [" + currentCount + " / " + nextTarget + "]";
            } else {
                var next = "Completed";
            }

            var color = achievement.color;
            var blur = (level === 0) ? 'achievement-blur' : '';

            $('#achievementModalContent').append(`
                <div class="col-4 d-flex flex-column align-items-center text-center">
                    <i style="color: ${color} !important; text-shadow: 4px 4px 25px ${color};" class="fas fa-${achievement.icon} achievement-icon ${blur} mb-5 mt-4"></i>
                    
                    <small style="opacity: 0.5"><b>${next}</b></small>
                    <small style="opacity: 0.5">Level: [${level} / ${maxLevel}]</small>
                    <br>
                    <b>${achievement.title}</b>
                    <small>${achievement.description}</small>
                    <br><br>
                </div>
            `)
        })

        $('#achievementsModal').modal('show');

    }

    onclick() {
        return new EventManager().handleAchievementsClicked();
    }
}