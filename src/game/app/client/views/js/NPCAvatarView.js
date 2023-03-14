/**
 * The NPC Avatar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCAvatarView extends AvatarView {

    npcId;
    name;
    standingUpLeftAnimation;
    standingUpRightAnimation;
    standingDownLeftAnimation;
    standingDownRightAnimation;
    currentAnimation;

    gameEngine;
    eventManager;

    /**
     * Creates an instance of NPCAvatarView
     * 
     * @param {String} npcId NPC ID
     * @param {String} name NPC name
     * @param {PositionClient} position NPC position
     * @param {Direction} direction NPC avatar direction
     * @param {ShirtColor} shirtColor NPC avatar shirt color
     * @param {IsometricEngine} gameEngine game engine instance
     * @param {EventManager} eventManager event manager instance
     */
    constructor(npcId, name, position, direction, shirtColor, gameEngine, eventManager) {
        super(position, direction, shirtColor);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);

        super.setVisibility(true);
        this.initSpriteAnimation();
        this.npcId = npcId;
        this.name = name;

        this.gameEngine = gameEngine;
        this.eventManager = eventManager;

        if (direction === 'UPLEFT') {
            this.currentAnimation = this.standingUpLeftAnimation;
        } else if (direction === 'UPRIGHT') {
            this.currentAnimation = this.standingUpRightAnimation;
        } else if (direction === 'DOWNLEFT') {
            this.currentAnimation = this.standingDownLeftAnimation;
        } else if (direction === 'DOWNRIGHT') {
            this.currentAnimation = this.standingDownRightAnimation;
        }
    }

    /**
     * Draws NPC avatar
     */
    draw() {
        if(!super.isVisible())
            return;

        let cordX = super.getGridPosition().getCordX();
        let cordY = super.getGridPosition().getCordY();

        var screenX = this.gameEngine.calculateScreenPosX(cordX, cordY) + Settings.AVATAR_SCALE_WIDTH * Settings.AVATAR_WIDTH;
        var screenY = this.gameEngine.calculateScreenPosY(cordX, cordY) - Settings.AVATAR_SCALE_HEIGHT * Settings.AVATAR_HEIGHT;

        ctx_avatar.font = Settings.FONT_SIZE + "px sans-serif";
        ctx_avatar.textBaseline = 'top';
        ctx_avatar.fillStyle = Settings.NPC_COLOR;
        ctx_avatar.textAlign = "center";
        ctx_avatar.fillRect(screenX - Settings.AVATAR_WIDTH / 4, screenY - 2, Settings.AVATAR_WIDTH * 1.5, Settings.FONT_SIZE + 2);

        ctx_avatar.fillStyle = Settings.NPC_NAME_COLOR;
        ctx_avatar.fillText(this.name, screenX + Settings.AVATAR_WIDTH / 2, screenY);

        this.currentAnimation.draw(screenX, screenY);
    }

    /**
     * Initializes sprite animation
     */
    initSpriteAnimation() {
        let spriteSheet = super.getSpriteSheet();
        let topClothing = super.getTopClothing();
        let bottomClothing = super.getBottomClothing();
        let shoes = super.getShoes();
        let hair = super.getHair();

        this.standingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 10, 10);
        this.standingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 15, 15);
        this.standingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 5, 5);
        this.standingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 0, 0);
    }

    /**
     * called if npc is clicked
     */
    onClick() {
        if(super.isVisible()) {
            this.eventManager.handleNPCClick(this.npcId);
        }
    }
}