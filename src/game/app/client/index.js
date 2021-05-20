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

    var timeout;

    window.onresize = () => {
      if(timeout === undefined)
      {
        timeout = setTimeout(()=>{
          resizeCanvas(
            window.innerWidth,
            window.innerHeight
          );
          gameView.onResize();
          timeout = undefined;
        }, 50);
      }
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
    canvasContext.imageSmoothingQuality = "high";
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
    let newScaleFactor;
    let scaleFactorOffset = 0.02;
    let newWidth;
    let newHeight;

    if(screenWidth > 2 * screenHeight)
    {
      newScaleFactor = Math.floor(((screenHeight / GAME_HEIGHT) + Number.EPSILON) * 100) / 100;
      newScaleFactor -= scaleFactorOffset;
    }
    else
    {
      newScaleFactor = Math.round(((screenWidth / GAME_WIDTH) + Number.EPSILON) * 100) / 100;
      newScaleFactor += scaleFactorOffset;
    }

    if(newScaleFactor < 0.1)
    {
      newScaleFactor = 0.1;
    }
    else
    /* Force best possible resolution */
    if(newScaleFactor < 1 + scaleFactorOffset && newScaleFactor > 1 - scaleFactorOffset)
    { 
      newScaleFactor = 1;
    }

    newWidth = 2 * Math.floor((screenWidth / newScaleFactor) / 2);
    newHeight = 2 * Math.floor((screenHeight / newScaleFactor) / 2);

    $("#mapCanvas").css({width: newWidth, height: newHeight}).attr({width: newWidth, height: newHeight});
    $("#avatarCanvas").css({width: newWidth, height: newHeight}).attr({width : newWidth, height: newHeight});

    var props = {
      position: "absolute",
      top: 0,
      left: 0,
      transform: `scale3d(${newScaleFactor}, ${newScaleFactor}, ${newScaleFactor})`,
      width: newWidth,
      height: newHeight,
      "transform-origin": `0 0 0`
    };

    $('#gameDiv').css(props);

    $("html").css({"font-size": Math.round(Settings.HUD_FONT_SIZE * newScaleFactor)});

    if(newScaleFactor < 0.5)
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