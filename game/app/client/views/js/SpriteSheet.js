class SpriteSheet {
    constructor(path, frameWidth, frameHeight) {
        this.image = new Image();
        this.path = path;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        var self = this;
        this.image.onload = function() {
            console.log("image loaded")
            self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
        };
 
        this.image.src = path;

    }
}

function Animation(frameRate, firstFrame, lastFrame) {
    var currentFrame = 0;
    var counter = 0;
    var animationSequence = [];

    for (var frameNumber = firstFrame; frameNumber <= lastFrame; frameNumber++)
        animationSequence.push(frameNumber);

    this.update = function() {
 
        // update to the next frame if it is time
        if (counter == (frameRate - 1))
          currentFrame = (currentFrame + 1) % animationSequence.length;
         
        // update the counter
        counter = (counter + 1) % frameRate;
      };


this.draw = function(x, y) {
    // get the row and col of the frame
    var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
    var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
    
    if (!spritesheet.framesPerRow) {
        console.log("can not draw because spritesheet is not loaded")
        return;
    }

    ctx.drawImage(
      spritesheet.image, col * spritesheet.frameWidth, row * spritesheet.frameHeight,
      spritesheet.frameWidth, spritesheet.frameHeight,
      x, y,
      spritesheet.frameWidth, spritesheet.frameHeight);
    };
}
     
function animate() {
    //requestAnimFrame( animate );
    ctx.clearRect(0, 0, 600, 300);
     
    walk.update();
     
    walk.draw(100.5, 100.5);
    
}

spritesheet = new SpriteSheet('CharacterSpriteSheet.png', 64, 128);
walk = new Animation(3, 1, 4);

window.setInterval(function(){
    animate();
  }, 50);