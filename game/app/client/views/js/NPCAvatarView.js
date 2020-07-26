
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
    #frame;

    constructor(npcId, name, position, direction, typeOfRoom) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        TypeChecker.isString(name);
        TypeChecker.isEnumOf(typeOfRoom, TypeOfRoomClient);
        this.#npcId = npcId;
        this.#name = name;
        this.#typeOfRoom = typeOfRoom;

        if (direction === DirectionClient.DOWNLEFT) {
            this.#frame = 5;
        } else if (direction === DirectionClient.UPLEFT) {
            this.#frame = 15;
        } else if (direction === DirectionClient.DOWNRIGHT) {
            this.#frame = 0;
        } else if (direction === DirectionClient.UPRIGHT) {
            this.#frame = 10;
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

        var row = Math.floor(this.#frame / this.#spriteSheet.framesPerRow);
        var col = Math.floor(this.#frame % this.#spriteSheet.framesPerRow);

        ctx_map.drawImage(
            this.#spriteSheet.image, col * this.#spriteSheet.frameWidth, row * this.#spriteSheet.frameHeight,
            this.#spriteSheet.frameWidth, this.#spriteSheet.frameHeight,
            screenX, screenY,
            this.#spriteSheet.frameWidth, this.#spriteSheet.frameHeight);

        ctx_map.drawImage(
            this.#topClothing.image, col * this.#topClothing.frameWidth, row * this.#topClothing.frameHeight,
            this.#topClothing.frameWidth, this.#topClothing.frameHeight,
            screenX, screenY,
            this.#topClothing.frameWidth, this.#topClothing.frameHeight);

        ctx_map.drawImage(
            this.#bottomClothing.image, col * this.#bottomClothing.frameWidth, row * this.#bottomClothing.frameHeight,
            this.#bottomClothing.frameWidth, this.#bottomClothing.frameHeight,
            screenX, screenY,
            this.#bottomClothing.frameWidth, this.#bottomClothing.frameHeight);

        ctx_map.drawImage(
            this.#shoes.image, col * this.#shoes.frameWidth, row * this.#shoes.frameHeight,
            this.#shoes.frameWidth, this.#shoes.frameHeight,
            screenX, screenY,
            this.#shoes.frameWidth, this.#shoes.frameHeight);
    }

    onClick() {
        //TODO
    }
}