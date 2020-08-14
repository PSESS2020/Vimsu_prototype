
/*const AvatarView = require("./AvatarView.js");
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = */class NPCAvatarView extends AvatarView {

    #npcId;
    #name;
    #spriteSheet = new SpriteSheet('client/assets/CharacterSpriteSheetBody.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #topClothing = new SpriteSheet('client/assets/TopClothingBlueShirtSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #bottomClothing = new SpriteSheet('client/assets/BottomBlackTrousersSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #shoes = new SpriteSheet('client/assets/ShoesBlackSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #standingUpLeftAnimation;
    #standingUpRightAnimation;
    #standingDownLeftAnimation;
    #standingDownRightAnimation;
    #currentAnimation;
    #typeOfRoom;

    #gameEngine;

    constructor(npcId, name, position, direction, typeOfRoom) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoom);
        this.#standingUpLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 10, 10);
        this.#standingDownLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 0, 0);
        this.#npcId = npcId;
        this.#name = name;
        this.#typeOfRoom = typeOfRoom;

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
        let cordX = super.getPosition().getCordX();
        let cordY = super.getPosition().getCordY();
        
        var screenX = this.#gameEngine.calculateScreenPosX(cordX, cordY) + AVATAR_SCALE_WIDTH * AVATAR_WIDTH;
        var screenY = this.#gameEngine.calculateScreenPosY(cordX, cordY) - AVATAR_SCALE_HEIGHT * AVATAR_HEIGHT;

        ctx_map.font = "1em sans-serif";
        ctx_map.textBaseline = 'top';
        ctx_map.fillStyle = "firebrick";
        ctx_map.textAlign = "center";
        ctx_map.fillRect(screenX - AVATAR_WIDTH / 4, screenY - 1, AVATAR_WIDTH * 1.5, parseInt(ctx_map.font, 10));

        ctx_map.fillStyle = "white";
        ctx_map.fillText(this.#name, screenX + AVATAR_WIDTH / 2, screenY);

        this.#currentAnimation.draw(screenX, screenY);
    }

    onClick() {
        $('#npcStoryModal').modal('toggle');
        let eventmanager = new EventManager();
        eventmanager.handleNPCClick(this.#npcId);
    }
}