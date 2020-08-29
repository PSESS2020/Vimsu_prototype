/**
 * The main file on client
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */

/**
 * canvas variable
 */
var ctx_map, ctx_avatar;

/* Initializes canvas and ClientController on window onload */
window.onload = new index().init();

/**
 * Holds init() and gameLoop()
 */
function index() {

  const GAME_WIDTH = GameConfig.CTX_WIDTH;
  const GAME_HEIGHT = GameConfig.CTX_HEIGHT;

  var clientController;

  /**
   * Initializes canvas, GameView, and ClientController for the first time.
   * Also calls game loop to update frame constantly
   */
  this.init = function() {
    ctx_map = document.getElementById("mapCanvas").getContext("2d");
    ctx_avatar = document.getElementById("avatarCanvas").getContext("2d");
  
    ctx_map.canvas.width = GAME_WIDTH;
    ctx_map.canvas.height = GAME_HEIGHT;
  
    ctx_avatar.canvas.width = GAME_WIDTH;
    ctx_avatar.canvas.height = GAME_HEIGHT;

    var gameView = new GameView();
    clientController = new ClientController(GameConfig.PORT, gameView);
    
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
  }

  /**
   * @private Updates game constantly through a game loop
   * 
   * @param {number} timeStamp 
   */
  var gameLoop = function(timeStamp) {
    TypeChecker.isNumber(timeStamp);

    // Clear canvas
    ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
    // Perform the drawing operation
    clientController.updateGame(timeStamp);
  
    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
  }
}