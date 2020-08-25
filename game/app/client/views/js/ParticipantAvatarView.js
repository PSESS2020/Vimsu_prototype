class ParticipantAvatarView extends AvatarView {

    #participantId;
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
    #isVisible;
    #username;
    #isModerator;
    #isOwnAvatar;

    #gameEngine;
    #eventManager;

    constructor(position, direction, participantId, username, isVisible, isModerator, isOwnAvatar) {
        super(position, direction);
        TypeChecker.isString(participantId);
        this.#participantId = participantId;
        this.#initSpriteAnimation();
        this.#currentAnimation = this.#standingDownRightAnimation;
        this.#username = username;
        this.#isVisible = isVisible;
        this.#isModerator = isModerator;
        this.#isOwnAvatar = isOwnAvatar;

        this.#gameEngine = new IsometricEngine();
        this.#eventManager = new EventManager();
        this.#initMovement();
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

    getVisibility() {
        return this.#isVisible;
    }

    setVisibility(visible) {
        this.#isVisible = visible;
    }

    update() {
        this.#currentAnimation.update();
    }

    updateCurrentAnimation() {
        var direction = super.getDirection();
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
    getGridPosition() {
        return super.getGridPosition();
    }

    updateWalking(isMoving) {
        this.#walking = isMoving;
    }

    draw() {
        if (this.#isVisible) {

            let cordX = super.getGridPosition().getCordX();
            let cordY = super.getGridPosition().getCordY();
            this.updateCurrentAnimation();

            var screenX = this.#gameEngine.calculateScreenPosX(cordX, cordY) + Settings.AVATAR_SCALE_WIDTH * Settings.AVATAR_WIDTH;
            var screenY = this.#gameEngine.calculateScreenPosY(cordX, cordY) - Settings.AVATAR_SCALE_HEIGHT * Settings.AVATAR_HEIGHT;

            ctx_avatar.font = "1em sans-serif";
            ctx_avatar.textBaseline = 'top';

            var arrowColor;
            if (this.#isModerator) {
                ctx_avatar.fillStyle = arrowColor = Settings.MODERATOR_COLOR;
            } else {
                ctx_avatar.fillStyle = arrowColor = Settings.PARTICIPANT_COLOR;
            }

            if (this.#isOwnAvatar) {
                this.#drawArrow(ctx_avatar, screenX + Settings.AVATAR_WIDTH / 2, screenY - 15 - Settings.ARROW_LENGTH, screenX + Settings.AVATAR_WIDTH / 2, screenY - 15, Settings.ARROW_WIDTH, arrowColor);
            }

            ctx_avatar.textAlign = "center";
            ctx_avatar.fillRect(screenX - Settings.AVATAR_WIDTH / 4, screenY - 1, Settings.AVATAR_WIDTH * 1.5, parseInt(ctx_avatar.font, 10));

            ctx_avatar.fillStyle = "black";
            ctx_avatar.fillText(this.#username, screenX + Settings.AVATAR_WIDTH / 2, screenY);

            this.#currentAnimation.draw(screenX, screenY); //TODO pass position of avatar
        }
    }

    onClick(/*mousePos*/) {

        /*
        //Needed for calculating the correct position of 
        //sprite animation in the spritesheet body click map.
        var clickMapOffsetX;
        var clickMapOffsetY;

        //Getting the row and column at which the animation frame was taken of the body sprite sheet.
        //Calc the actual offset of animation frame.
        clickMapOffsetX = this.#currentAnimation.getCol() * AVATAR_WIDTH;
        clickMapOffsetY = this.#currentAnimation.getRow() * AVATAR_HEIGHT;

        var clickImgCordX = Math.abs( this.#screenX - Math.round(mousePos.x) ) + clickMapOffsetX;
        var clickImgCordY = Math.abs( this.#screenY - Math.round(mousePos.y) ) + clickMapOffsetY;

        console.log("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);
        
        if ( SpriteSheetBodyClickMap.clickMap[clickImgCordY][clickImgCordX] === 1 ) {
            //alert("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);
            */
        if (this.#isVisible) {

            $('#businessCardModal').modal('toggle');
            this.#eventManager.handleAvatarClick(this.#participantId);
        }
        //}
    }

    //draws an arrow from (fromCordX, fromCordY) to (toCordX, toCordY)
    #drawArrow = function (ctx, fromCordX, fromCordY, toCordX, toCordY, arrowWidth, color) {
        //variables to be used when creating the arrow
        var headlen = 5;
        var angle = Math.atan2(toCordY - fromCordY, toCordX - fromCordX);

        ctx.save();

        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;

        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromCordX, fromCordY);
        ctx.lineTo(toCordX, toCordY);
        ctx.lineWidth = arrowWidth;
        ctx.stroke();

        //starting a new path from the head of the arrow to one of the sides of
        //the point
        ctx.beginPath();
        ctx.moveTo(toCordX, toCordY);
        ctx.lineTo(toCordX - headlen * Math.cos(angle - Math.PI / 7),
            toCordY - headlen * Math.sin(angle - Math.PI / 7));

        //path from the side point of the arrow, to the other side point
        ctx.lineTo(toCordX - headlen * Math.cos(angle + Math.PI / 7),
            toCordY - headlen * Math.sin(angle + Math.PI / 7));

        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx.lineTo(toCordX, toCordY);
        ctx.lineTo(toCordX - headlen * Math.cos(angle - Math.PI / 7),
            toCordY - headlen * Math.sin(angle - Math.PI / 7));

        //draws the paths created above
        ctx.stroke();
        ctx.restore();
    }

    #initSpriteAnimation = function () {
        var spriteSheet = new SpriteSheet('client/assets/avatar/CharacterSpriteSheetBody.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var topClothing = new SpriteSheet('client/assets/avatar/TopClothingBlueShirtSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var bottomClothing = new SpriteSheet('client/assets/avatar/BottomBlackTrousersSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        var shoes = new SpriteSheet('client/assets/avatar/ShoesBlackSpriteSheet.png', Settings.AVATAR_WIDTH, Settings.AVATAR_HEIGHT);
        this.#walkingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 9, 1, 4);
        this.#walkingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 9, 11, 14);
        this.#walkingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 9, 6, 9);
        this.#walkingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 9, 16, 19);
        this.#standingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 15, 15);
        this.#standingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 10, 10);
        this.#standingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 5, 5);
        this.#standingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, 15, 0, 0);
    }

    #initMovement = function () {
        document.body.onkeydown = (event) => {

            if (event.defaultPrevented) {
                return;
            }

            switch (event.code) {
                case "KeyW": case "ArrowUp":
                    event.preventDefault();
                    this.#eventManager.handleUpArrowDown();
                    break;
                case "KeyS": case "ArrowDown":
                    event.preventDefault();
                    this.#eventManager.handleDownArrowDown();
                    break;
                case "KeyD": case "ArrowRight":
                    event.preventDefault();
                    this.#eventManager.handleRightArrowDown();
                    break;
                case "KeyA": case "ArrowLeft":
                    event.preventDefault();
                    this.#eventManager.handleLeftArrowDown();
                    break;
                default:
                    return;
            }
        };

        document.body.onkeyup = (event) => {

            if (event.defaultPrevented) {
                return;
            }

            switch (event.code) {
                case "KeyW": case "KeyS": case "KeyD": case "KeyA":
                case "ArrowUp": case "ArrowDown": case "ArrowRight": case "ArrowLeft":
                    this.#eventManager.handleArrowUp();
                    break;
            }
        }
    }
}
