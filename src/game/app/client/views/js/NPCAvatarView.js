/**
 * The NPC Avatar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCAvatarView extends AvatarView {

    #npcId;
    #name;
    #standingUpLeftAnimation;
    #standingUpRightAnimation;
    #standingDownLeftAnimation;
    #standingDownRightAnimation;
    #currentAnimation;

    #gameEngine;
    #eventManager;

    /**
     * @constructor Creates an instance of NPCAvatarView
     * 
     * @param {String} npcId NPC ID
     * @param {String} name NPC name
     * @param {PositionClient} position NPC position
     * @param {Direction} direction NPC avatar direction
     * @param {IsometricEngine} gameEngine game engine instance
     * @param {EventManager} eventManager event manager instance
     */
    constructor(npcId, name, position, direction, gameEngine, eventManager) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);
        this.#initSpriteAnimation();
        this.#npcId = npcId;
        this.#name = name;

        this.#gameEngine = gameEngine;
        this.#eventManager = eventManager;

        if (direction === 'UPLEFT') {
            this.#currentAnimation = this.#standingUpLeftAnimation;
        } else if (direction === 'UPRIGHT') {
            this.#currentAnimation = this.#standingUpRightAnimation;
        } else if (direction === 'DOWNLEFT') {
            this.#currentAnimation = this.#standingDownLeftAnimation;
        } else if (direction === 'DOWNRIGHT') {
            this.#currentAnimation = this.#standingDownRightAnimation;
        }
    }

    /**
     * Draws NPC avatar
     */
    draw() {
        let cordX = super.getGridPosition().getCordX();
        let cordY = super.getGridPosition().getCordY();

        var screenX = this.#gameEngine.calculateScreenPosX(cordX, cordY) + Settings.AVATAR_SCALE_WIDTH * Settings.AVATAR_WIDTH;
        var screenY = this.#gameEngine.calculateScreenPosY(cordX, cordY) - Settings.AVATAR_SCALE_HEIGHT * Settings.AVATAR_HEIGHT;

        ctx_avatar.font = "1em sans-serif";
        ctx_avatar.textBaseline = 'top';
        ctx_avatar.fillStyle = "firebrick";
        ctx_avatar.textAlign = "center";
        ctx_avatar.fillRect(screenX - Settings.AVATAR_WIDTH / 4, screenY - 1, Settings.AVATAR_WIDTH * 1.5, parseInt(ctx_avatar.font, 10));

        ctx_avatar.fillStyle = "white";
        ctx_avatar.fillText(this.#name, screenX + Settings.AVATAR_WIDTH / 2, screenY);

        this.#currentAnimation.draw(screenX, screenY);
    }

    /**
     * @private initializes sprite animation
     */
    #initSpriteAnimation = function () {
        var spriteSheet = new SpriteSheet('client/assets/avatar/CharacterSpriteSheetBody.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var topClothing = new SpriteSheet('client/assets/avatar/TopClothingRedShirtSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var bottomClothing = new SpriteSheet('client/assets/avatar/BottomBlackTrousersSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var shoes = new SpriteSheet('client/assets/avatar/ShoesBlackSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.#standingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 10, 10);
        this.#standingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 0, 0);
    }

    /**
     * called if npc is clicked
     */
    onClick() {
        this.#eventManager.handleNPCClick(this.#npcId);
    }
}