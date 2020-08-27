/**
 * The Schedule Object View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class ScheduleView extends GameMapElementView {
    #clickMap;

    /**
     * @constructor Creates an instance of Schedule View
     * 
     * @param {Image} scheduleImage schedule image
     * @param {PositionClient} position schedule position
     * @param {number} screenPositionOffset schedule screen position offset
     * @param {string} name schedule name
     * @param {number[][]} clickMap schedule clickMap
     */
    constructor(scheduleImage, position, screenPositionOffset, name, clickMap) {
        super(scheduleImage, position, screenPositionOffset, name);
        this.#clickMap = clickMap;
    }

    /**
     * Called if participant clicks the schedule
     * 
     * @param {number} mousePos mouse position
     */
    onclick(mousePos) {
        var screenPos = super.getScreenPosition();

        var clickImgCordX = Math.abs(Math.abs(screenPos.getCordX() - Math.round(mousePos.x)));

        //This coordinate is flipped, so therefore an offset is needed
        var clickImgCordY = Math.abs(screenPos.getCordY() - Math.round(mousePos.y));
        //console.log("mousePos: " + mousePos.x + " " + mousePos.y)
        //console.log("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);

        //for ( var i = 0, n = this.#clickMap.length; i < n; i++) {
        //  for ( var j = 0, m = this.#clickMap[i].length; j < n; j++) {
        if (this.#clickMap[clickImgCordY][clickImgCordX] === 1) {
            alert("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);
        }
        //}
        //}
    }
}