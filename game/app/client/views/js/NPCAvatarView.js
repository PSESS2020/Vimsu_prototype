const AvatarView = require("./AvatarView");
var TypeChecker = require('../../../utils/TypeChecker.js')

module.exports = class NPCAvatarView extends AvatarView {
   
    #npcId;

    constructor(position, direction, npcId) {
        super(position, direction);
        TypeChecker.isInt(npcId);
        this.#npcId = npcId;
    }

    draw() {
        
    }
}