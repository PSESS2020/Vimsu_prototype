const AvatarView = require("./AvatarView");

class NPCAvatarView extends AvatarView {
   
    #npcId;

    constructor(position, direction, npcId) {
        super(position, direction);
        this.#npcId = npcId;
    }

    draw() {
        
    }
}