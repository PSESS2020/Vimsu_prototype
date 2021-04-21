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
  var scaleFactor = 1;

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

    sharpenCanvas(ctx_map);
    sharpenCanvas(ctx_avatar);

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
   * @param {RenderingContext} context 
   */
  const sharpenCanvas = function(context) {
    context.mozImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
  }

  /**
   * @private Updates game constantly through a game loop
   */
  var gameLoop = function () {

    // Scale canvas conext back
    ctx_avatar.scale(1 / scaleFactor, 1 / scaleFactor);

    // Clear canvas
    ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx_avatar.scale(scaleFactor, scaleFactor);

    // Perform the drawing operation
    clientController.updateGame();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
  }

  /**
   * @private Resizes convas resolution to the ratio 2:1
   * 
   * @param {number} screenWidth
   * @param {number} screenHeight
   */
  const resizeCanvas = (screenWidth, screenHeight) => {
    scaleFactor = 0.20;
    let newWidth;
    let newHeight;

    do
    {
      scaleFactor += 0.20;
      newWidth = screenWidth / scaleFactor;
      newHeight = screenHeight / scaleFactor;

    }
    while(newWidth > GAME_WIDTH || newHeight > GAME_HEIGHT);

    if((newHeight < GAME_HEIGHT || newWidth < GAME_WIDTH) && scaleFactor > 0.4)
    {
      scaleFactor -= 0.20;
      newWidth = screenWidth / scaleFactor;
      newHeight = screenHeight / scaleFactor;
    }

    newWidth = 2 * Math.floor(newWidth / 2);
    newHeight = 2 * Math.floor(newHeight / 2);

    $("#mapCanvas").css({width: newWidth, height: newHeight}).attr({width: newWidth, height: newHeight});
    $("#avatarCanvas").css({width: newWidth, height: newHeight}).attr({width : newWidth, height: newHeight});

    var props = {position: "absolute", top: 0, left: 0, transform: `scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})`, width: newWidth, height: newHeight};
    props["transform-origin"] = `0 0 0`;
    $('#gameDiv').css(props);

    let scale = scaleFactor * 100;
    let style = {};
    style["font-size"] = `${scale}%`;
    $("html").css(style);
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