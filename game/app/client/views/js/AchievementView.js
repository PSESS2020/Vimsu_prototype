class AchievementView extends WindowView {

    constructor() {
        super()
    }

    onclick() {
        return new EventManager().handleAchievementsClicked();
    }
}