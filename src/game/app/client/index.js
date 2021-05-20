/**
 * The main function on client
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
function index() {

  const GAME_WIDTH = GameConfig.CTX_WIDTH;
  const GAME_HEIGHT = GameConfig.CTX_HEIGHT;

  var clientController;

  /**
   * Initializes canvas, GameView, and ClientController for the first time.
   * Also calls game loop to update frame constantly
   */
  this.init = function () {
    ctx_map = document.getElementById("mapCanvas").getContext("2d");
    ctx_avatar = document.getElementById("avatarCanvas").getContext("2d");

    ctx_map.canvas.width = GAME_WIDTH;
    ctx_map.canvas.height = GAME_HEIGHT;

    ctx_avatar.canvas.width = GAME_WIDTH;
    ctx_avatar.canvas.height = GAME_HEIGHT;

    var gameView = new GameView();
    clientController = new ClientController(GameConfig.PORT, gameView);

    // Initialize canvas size
    resizeCanvas(
      window.innerWidth,
      window.innerHeight
    );

    gameView.onResize();

    window.onresize = () => {
      resizeCanvas(
        window.innerWidth,
        window.innerHeight
      );
      gameView.onResize();
    }

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
  }

  /**
   * @private Disables smoothing and bluring of canvas
   * 
   * @param {RenderingContext} canvasContext 
   */
  const setCanvasSharpness = function(canvasContext, enabled) {
    canvasContext.mozImageSmoothingEnabled = enabled;
    canvasContext.msImageSmoothingEnabled = enabled;
    canvasContext.imageSmoothingEnabled = enabled;
    canvasContext.imageSmoothingQuality = "low";
  }

  /**
   * @private Updates game constantly through a game loop
   */
  var gameLoop = function () {

    // Clear canvas
    ctx_avatar.clearRect(0, 0, ctx_avatar.canvas.width, ctx_avatar.canvas.height);

    // Perform the drawing operation
    clientController.updateGame();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
  }

  /**
   * @private Resizes canvas and keeps its aspect ratio
   * 
   * @param {number} screenWidth
   * @param {number} screenHeight
   */
  const resizeCanvas = (screenWidth, screenHeight) => {
    let stepSize = 0.05;
    let newScaleFactor = stepSize;
    let newWidth;
    let newHeight;

    do
    {
      newScaleFactor += stepSize;
      newWidth = screenWidth / newScaleFactor;
      newHeight = screenHeight / newScaleFactor;
    }
    while(newWidth > GAME_WIDTH && newScaleFactor < 1);

    if(screenWidth > 3 * screenHeight)
      return;

    if( screenWidth > 2 * screenHeight)
    {
      let scale = stepSize;
      let tempHeight = 2 * screenHeight;
      let temp = tempHeight * scale;

      while(screenWidth > tempHeight + temp)
      {
        scale += stepSize;
        temp = tempHeight * scale;
      }
      
      newScaleFactor -= scale;
      newWidth = screenWidth / newScaleFactor;
      newHeight = screenHeight / newScaleFactor;
    }

    if(newScaleFactor < 0.3)
      newScaleFactor = 0.3;
      
    newWidth = 2 * Math.floor(newWidth / 2);
    newHeight = 2 * Math.floor(newHeight / 2);

    $("#mapCanvas").css({width: newWidth, height: newHeight}).attr({width: newWidth, height: newHeight});
    $("#avatarCanvas").css({width: newWidth, height: newHeight}).attr({width : newWidth, height: newHeight});

    var props = {position: "absolute", top: 0, left: 0, transform: `scale3d(${newScaleFactor}, ${newScaleFactor}, ${newScaleFactor})`, width: newWidth, height: newHeight};
    props["transform-origin"] = `0 0 0`;
    $('#gameDiv').css(props);

    let style = {};
    style["font-size"] = Math.round(Settings.HUD_FONT_SIZE * newScaleFactor);
    $("html").css(style);

    if(newScaleFactor < 1)
    {
      setCanvasSharpness(ctx_map, true);
      setCanvasSharpness(ctx_avatar, true);
    }
    else
    {
      setCanvasSharpness(ctx_map, false);
      setCanvasSharpness(ctx_avatar, false);
    }
  }
}

/**
 * Map context
 */
var ctx_map

/**
 * Avatar context
 */
var ctx_avatar;

/* Initializes canvas and ClientController on window onload */
window.onload = new index().init();