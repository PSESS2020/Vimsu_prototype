class AchievementView extends WindowView {

    constructor() {
        super()
    }

    getLevel(count, levels, maxLevel) {
        var level = 0;
        while (level < maxLevel && count >= levels[level].count) {
            level++;
        }
        return (level < maxLevel) ? level : maxLevel;
    }

    draw(achievements) {
        $('#achievementModalContent').empty();

        Object.keys(achievements).forEach(x => {
            var achievement = achievements[x];
            var levels = Object.keys(achievement.levels).length;
            var level = this.getLevel(achievement.count, achievement.levels, levels);
            var color = (level === 0) ? 'darkslategray' : achievement.levels[level - 1].color;
            var blur = (level === 0) ? 'achievement-blur' : '';

            $('#achievementModalContent').append(`
                <div class="col-4 d-flex flex-column align-items-center text-center">
                    <i style="color: ${color} !important; text-shadow: 4px 4px 25px ${color};" class="fa fa-${achievement.icon} achievement-icon ${blur} mb-5 mt-4"></i>
                    
                    <b>${achievement.title} [${level} / ${levels}]</b>
                    <small>${achievement.description}.</small>
                </div>
            `)
        })
        //alert(JSON.stringify(achievements));
    }

    onclick() {
        return new EventManager().handleAchievementsClicked();
    }
}