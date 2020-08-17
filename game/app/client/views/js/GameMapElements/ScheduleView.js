class ScheduleView extends GameMapElementView {
    #clickMap;

    constructor(scheduleImage, position, screenPositionOffset, name, clickMap) {
        super(scheduleImage, position, screenPositionOffset, name);
        this.#clickMap = clickMap;
    }

    onclick(mousePos) {
        var screenPos = super.getScreenPosition();

        var clickImgCordX = Math.abs( Math.abs(screenPos.getCordX() - Math.round(mousePos.x))) ;
        
        //This coordinate is flipped, so therefore an offset is needed
        var clickImgCordY = Math.abs(  screenPos.getCordY() - Math.round(mousePos.y));
        //console.log("mousePos: " + mousePos.x + " " + mousePos.y)
        //console.log("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);
        
        //for ( var i = 0, n = this.#clickMap.length; i < n; i++) {
          //  for ( var j = 0, m = this.#clickMap[i].length; j < n; j++) {
        if ( this.#clickMap[clickImgCordY][clickImgCordX] === 1 ) {
            alert("image x pos: " + clickImgCordX + "image y pos: " + clickImgCordY);
        }
    //}
//}
    }
}