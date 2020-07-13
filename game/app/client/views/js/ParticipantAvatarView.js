/*const AvatarView = require("./AvatarView.js");
var TypeChecker = require('../../../utils/TypeChecker.js')


module.exports = */
class ParticipantAvatarView extends AvatarView {

    #participantId;
    #name;
    #spriteSheet = new SpriteSheet('client/assets/CharacterSpriteSheetBody.png', 64, 128);
    #topClothing = new SpriteSheet('client/assets/TopClothingBlueShirtSpriteSheet.png', 64, 128);
    #bottomClothing = new SpriteSheet('client/assets/BottomBlackTrousersSpriteSheet.png', 64, 128);
    #shoes = new SpriteSheet('client/assets/ShoesBlackSpriteSheet.png', 64, 128);
    #walkingDownRightAnimation;
    #walkingUpRightAnimation;
    #walkingDownLeftAnimation;
    #walkingUpLeftAnimation;
    #standingUpLeftAnimation;
    #standingUpRightAnimation;
    #standingDownLeftAnimation;
    #standingDownRightAnimation;
    #currentAnimation;
    #walking = false;

    constructor(position, direction, participantId) {
        super(position, direction);
        TypeChecker.isString(participantId);
        this.#participantId = participantId;
        console.log(this.#participantId);
        this.#walkingDownRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 3, 1, 4);
        this.#walkingUpRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 3, 11, 14);
        this.#walkingDownLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 3, 6, 9);
        this.#walkingUpLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 3, 16, 19);
        this.#standingUpLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 10, 10); 
        this.#standingDownLeftAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(this.#spriteSheet, this.#topClothing, this.#bottomClothing, this.#shoes, 15, 0, 0);
        this.#currentAnimation = this.#standingDownRightAnimation;


    }
    
    // changed the name here for test-purposes
    // otherwise the whole "finding the index"-routine in the GameView will not work
    getId() {
        return this.#participantId;
    }

    //Is called after server sends participantId
    setId(participantId) {
        this.#participantId = participantId;
    }

    setNickname(nickname) {
        this.#name = name
    }

    update() {
        this.#currentAnimation.update();
    }

    updateCurrentAnimation() {
        var direction = super.getDirection();
        var currPos = super.getPosition();
        if (this.#walking === true) {
            if (direction === 'UPLEFT') {
                this.#currentAnimation = this.#walkingUpLeftAnimation;
            } else if (direction === 'UPRIGHT') {
                this.#currentAnimation = this.#walkingUpRightAnimation;
            } else if (direction === 'DOWNLEFT') {
                this.#currentAnimation = this.#walkingDownLeftAnimation;
            } else if (direction === 'DOWNRIGHT') {
                this.#currentAnimation = this.#walkingDownRightAnimation;
            }
        

        } else {
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
    }

    //only there for testing, TODO: remove
    getPosition() {
        return super.getPosition();
    }

    updateWalking(isMoving) {
        this.#walking = isMoving;
    }

    draw() {
        let cordX = super.getPosition().getCordX();
        let cordY = super.getPosition().getCordY();
        this.updateCurrentAnimation();
    
        //should be done somewhere else, 150 and 419 are room dependent
        let screenX = cordX * 64 / 2 + cordY * 64 / 2 + 150;
        let screenY = cordY * 32 / 2 - cordX * 32 / 2 + 419;

        ctx_avatar.font = "1em Verdana";
        ctx_avatar.fillStyle = "black";
        ctx_avatar.textAlign = "left";
        ctx_avatar.fillText(name, screenX, screenY);

        this.#currentAnimation.draw(screenX, screenY); //TODO pass position of avatar
    }
}
