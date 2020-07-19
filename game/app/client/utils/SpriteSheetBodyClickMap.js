class SpriteSheetBodyClickMap {

    static clickMap = [];

    static initClickMap() {

        var img = new Image();
        
        img.onload = () => {
        
            ctx_avatar.drawImage(img, 0, 0);
            var imageData = ctx_avatar.getImageData(0, 0, img.width, img.height).data;
        
            for ( var i = 0, n = imageData.length; i < n; i += 4) {
                var row = Math.floor((i / 4) / img.width);
                var col = (i / 4) - (row * img.width);
                if(!this.clickMap[row]) this.clickMap[row] = [];
                this.clickMap[row][col] = imageData[i+3] === 0 ? 0 : 1;
            }
        }     
       img.src = 'client/assets/CharacterSpriteSheetBody.png';
    }
}