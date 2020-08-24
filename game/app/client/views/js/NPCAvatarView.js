class NPCAvatarView extends AvatarView {

    #npcId;
    #name;
    #spriteSheet = new SpriteSheet('client/assets/avatar/CharacterSpriteSheetBody.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
    #topClothing = new SpriteSheet('client/assets/avatar/TopClothingBlueShirtSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
    #bottomClothing = new SpriteSheet('client/assets/avatar/BottomBlackTrousersSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
    #shoes = new SpriteSheet('client/assets/avatar/ShoesBlackSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
    #standingUpLeftAnimation;
    #standingUpRightAnimation;
    #standingDownLeftAnimation;
    #standingDownRightAnimation;
    #currentAnimation;

    #gameEngine;

    constructor(npcId, name, position, direction) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);
        this.#standingUpLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 10, 10);
        this.#standingDownLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 0, 0);
        this.#npcId = npcId;
        this.#name = name;

        this.#gameEngine = new IsometricEngine();

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

    onClick() {
        new EventManager().handleNPCClick(this.#npcId);
    }
}