/**
 * The Participant Avatar View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ParticipantAvatarView extends AvatarView {

    participantId;
    walkingDownRightAnimation;
    walkingUpRightAnimation;
    walkingDownLeftAnimation;
    walkingUpLeftAnimation;
    standingUpLeftAnimation;
    standingUpRightAnimation;
    standingDownLeftAnimation;
    standingDownRightAnimation;
    currentAnimation;
    walking = false;
    displayName;
    isModerator;
    isOwnAvatar;

    gameEngine;
    eventManager;

    /**
     * Creates an instance of ParticipantAvatarView
     * 
     * @param {PositionClient} position avatar position
     * @param {Direction} direction avatar direction
     * @param {ShirtColor} shirtColor avatar shirt color
     * @param {String} participantId participant ID
     * @param {String} displayName name that is displayed above avatar
     * @param {boolean} isVisible true if visible, otherwise false
     * @param {boolean} isModerator true if moderator, otherwise false
     * @param {boolean} isOwnAvatar true if own avatar, otherwise false
     * @param {IsometricEngine} gameEngine game engine instance
     * @param {EventManager} eventManager event manager instance
     */
    constructor(position, direction, shirtColor, participantId, displayName, isVisible, isModerator, isOwnAvatar, gameEngine, eventManager) {
        super(position, direction, shirtColor);
        TypeChecker.isString(participantId);

        this.participantId = participantId;
        this.initSpriteAnimation();

        this.currentAnimation = this.standingDownRightAnimation;

        //calculate maximum number of displayName characters that can be drawn without being to big for rectangle
        ctx_avatar.font = Settings.FONT_SIZE + "px sans-serif";
        let maxNameLength = displayName.length;
        while (ctx_avatar.measureText(displayName.slice(0, maxNameLength)).width > Settings.AVATAR_WIDTH * 1.5) 
        maxNameLength--;

        this.displayName = displayName.length > maxNameLength ? displayName.slice(0, maxNameLength - 1) + ".." : displayName;
            
        super.setVisibility(isVisible);
        this.isModerator = isModerator;
        this.isOwnAvatar = isOwnAvatar;

        this.gameEngine = gameEngine;
        this.eventManager = eventManager;
        this.initMovement();
    }

    /**
     * Gets participant ID
     * 
     * @return {String} participantId
     */
    getId() {
        return this.participantId;
    }

    /**
     * Sets participant ID
     * 
     * @param {String} participantId participant ID
     */
    setId(participantId) {
        this.participantId = participantId;
    }

    /**
     * Sets moderator state
     * 
     * @param {boolean} isModerator true if moderator, otherwise false
     */
    setIsModerator(isModerator) {
        this.isModerator = isModerator;
    }


    /**
     * Updates current animation
     */
    update() {
        this.currentAnimation.update();
    }

    /**
     * Updates currentAnimation based on the direction
     */
    updateCurrentAnimation() {
        var direction = super.getDirection();
        if (this.walking === true) {
            if (direction === 'UPLEFT') {
                this.currentAnimation = this.walkingUpLeftAnimation;
            } else if (direction === 'UPRIGHT') {
                this.currentAnimation = this.walkingUpRightAnimation;
            } else if (direction === 'DOWNLEFT') {
                this.currentAnimation = this.walkingDownLeftAnimation;
            } else if (direction === 'DOWNRIGHT') {
                this.currentAnimation = this.walkingDownRightAnimation;
            }


        } else {
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
    }

    /**
     * Update walking status
     * 
     * @param {boolean} isMoving true if moving, otherwise false
     */
    updateWalking(isMoving) {
        this.walking = isMoving;
    }

    /**
     * Draws participant avatar
     */
    draw() {
        if (super.isVisible()) {

            let cordX = super.getGridPosition().getCordX();
            let cordY = super.getGridPosition().getCordY();
            this.updateCurrentAnimation();

            var screenX = this.gameEngine.calculateScreenPosX(cordX, cordY) + Settings.AVATAR_SCALE_WIDTH * Settings.AVATAR_WIDTH;
            var screenY = this.gameEngine.calculateScreenPosY(cordX, cordY) - Settings.AVATAR_SCALE_HEIGHT * Settings.AVATAR_HEIGHT;

            ctx_avatar.font = Settings.FONT_SIZE + "px sans-serif";
            ctx_avatar.textBaseline = 'top';

            var arrowColor;
            if (this.isModerator) {
                ctx_avatar.fillStyle = arrowColor = Settings.MODERATOR_COLOR;
            } else {
                ctx_avatar.fillStyle = arrowColor = Settings.PARTICIPANT_COLOR;
            }

            if (this.isOwnAvatar) {
                this.drawArrow(screenX + Settings.AVATAR_WIDTH / 2, screenY - 15 - Settings.ARROW_LENGTH, screenX + Settings.AVATAR_WIDTH / 2, screenY - 15, Settings.ARROW_WIDTH, arrowColor);
            }

            ctx_avatar.textAlign = "center";
            ctx_avatar.fillRect(screenX - Settings.AVATAR_WIDTH / 4, screenY - 2, Settings.AVATAR_WIDTH * 1.5, Settings.FONT_SIZE + 2);

            if (this.isModerator) {
                ctx_avatar.fillStyle = Settings.MODERATOR_NAME_COLOR;
            } else {
                ctx_avatar.fillStyle = Settings.PARTICIPANT_NAME_COLOR;
            }

            ctx_avatar.fillText(this.displayName, screenX + Settings.AVATAR_WIDTH / 2, screenY);

            this.currentAnimation.draw(screenX, screenY); //TODO pass position of avatar
        }
    }

    /**
     * Called if participant avatar is clicked
     */
    onClick() {
        if (super.isVisible()) {
            $('#businessCardModal').modal('show');
            $('#businessCardModal .modal-body').append(`
                <div id=${"businessCardWait" + this.participantId} style="text-align: center;">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            `);
            this.eventManager.handleAvatarClick(this.participantId);
        }
    }

    /**
     * draws an arrow from (fromCordX, fromCordY) to (toCordX, toCordY)
     * 
     * @param {number} fromCordX origin x coordinate
     * @param {number} fromCordY origin y coordinate
     * @param {number} toCordX end x coordinate
     * @param {number} toCordY end y coordinate
     * @param {number} arrowWidth arrow width
     * @param {String} color arrow color
     */
    drawArrow = function (fromCordX, fromCordY, toCordX, toCordY, arrowWidth, color) {
        //variables to be used when creating the arrow
        var headlen = 5;
        var angle = Math.atan2(toCordY - fromCordY, toCordX - fromCordX);

        ctx_avatar.save();

        ctx_avatar.strokeStyle = color;
        ctx_avatar.shadowColor = color;
        ctx_avatar.shadowBlur = 15;

        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        ctx_avatar.beginPath();
        ctx_avatar.moveTo(fromCordX, fromCordY);
        ctx_avatar.lineTo(toCordX, toCordY);
        ctx_avatar.lineWidth = arrowWidth;
        ctx_avatar.stroke();

        //starting a new path from the head of the arrow to one of the sides of
        //the point
        ctx_avatar.beginPath();
        ctx_avatar.moveTo(toCordX, toCordY);
        ctx_avatar.lineTo(toCordX - headlen * Math.cos(angle - Math.PI / 7),
            toCordY - headlen * Math.sin(angle - Math.PI / 7));

        //path from the side point of the arrow, to the other side point
        ctx_avatar.lineTo(toCordX - headlen * Math.cos(angle + Math.PI / 7),
            toCordY - headlen * Math.sin(angle + Math.PI / 7));

        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx_avatar.lineTo(toCordX, toCordY);
        ctx_avatar.lineTo(toCordX - headlen * Math.cos(angle - Math.PI / 7),
            toCordY - headlen * Math.sin(angle - Math.PI / 7));

        //draws the paths created above
        ctx_avatar.stroke();
        ctx_avatar.restore();
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

        this.walkingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 9, 1, 4);
        this.walkingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 9, 16, 19);
        this.walkingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 9, 6, 9);
        this.walkingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 9, 11, 14);
        this.standingUpLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 10, 10);
        this.standingUpRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 15, 15);
        this.standingDownLeftAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 5, 5);
        this.standingDownRightAnimation = new SpriteAnimation(spriteSheet, topClothing, bottomClothing, shoes, hair, 15, 0, 0);
    }

    /**
     * initializes keyboard events for movement
     */
    initMovement = function () {
        document.body.onkeydown = (event) => {

            if (event.defaultPrevented) {
                return;
            }

            switch (event.code) {
                case "KeyW":
                    this.eventManager.handleUpArrowDown();
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    this.eventManager.handleUpArrowDown();
                    break;
                case "KeyS":
                    this.eventManager.handleDownArrowDown();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this.eventManager.handleDownArrowDown();
                    break;
                case "KeyD":
                    this.eventManager.handleRightArrowDown();
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    this.eventManager.handleRightArrowDown();
                    break;
                case "KeyA":
                    this.eventManager.handleLeftArrowDown();
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    this.eventManager.handleLeftArrowDown();
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
                    this.eventManager.handleArrowUp();
                    break;
            }
        }
    }
}
