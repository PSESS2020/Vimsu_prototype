
/*const AvatarView = require("./AvatarView.js");
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = */class NPCAvatarView extends AvatarView {
   
    #npcId;
    #name;
    #typeOfRoom;
    #spriteSheet = new SpriteSheet('client/assets/CharacterSpriteSheetBody.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #topClothing = new SpriteSheet('client/assets/TopClothingBlueShirtSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #bottomClothing = new SpriteSheet('client/assets/BottomBlackTrousersSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #shoes = new SpriteSheet('client/assets/ShoesBlackSpriteSheet.png', AVATAR_WIDTH, AVATAR_HEIGHT);
    #standingUpLeftAnimation;
    #standingUpRightAnimation;
    #standingDownLeftAnimation;
    #standingDownRightAnimation;
    #currentAnimation;

    constructor(npcId, name, position, direction, typeOfRoom) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        this.#standingUpLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 10, 10); 
        this.#standingDownLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 0, 0);
        this.#npcId = npcId;
        this.#name = name;
        this.#typeOfRoom = typeOfRoom;

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

        //should be done somewhere else, 150 and 419 are room dependent
        if (this.#typeOfRoom === 'FOYER') {
            var screenX = cordX * 64 / 2 + cordY * 64 / 2 + 150;
            var screenY = cordY * 32 / 2 - cordX * 32 / 2 + 419;
        }
        else if (this.#typeOfRoom === 'FOODCOURT') {
            var screenX = cordX * 64 / 2 + cordY * 64 / 2 + 534;
            var screenY = cordY * 32 / 2 - cordX * 32 / 2 + 419;
        }
        else if (this.#typeOfRoom === 'RECEPTION') {
            var screenX = cordX * 64 / 2 + cordY * 64 / 2 + 534;
            var screenY = cordY * 32 / 2 - cordX * 32 / 2 + 419;
        }

        ctx_map.font = "1em sans-serif";
        ctx_map.textBaseline = 'top';
        ctx_map.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx_map.textAlign = "center";
        ctx_map.fillRect(screenX - AVATAR_WIDTH / 4, screenY - 1, AVATAR_WIDTH * 1.5, parseInt(ctx_map.font, 10));

        ctx_map.fillStyle = "black";
        ctx_map.fillText(this.#name, screenX + AVATAR_WIDTH/2, screenY);

        this.#currentAnimation.draw(screenX, screenY); 
    }

    onClick() {
        console.log('You clicked me');
        $('#npcStoryModal').modal('toggle');
        let eventmanager = new EventManager();
        eventmanager.handleNPCClick(this.#npcId);
    }
}