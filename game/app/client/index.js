const GAME_WIDTH = GameConfig.CTX_WIDTH;
const GAME_HEIGHT = GameConfig.CTX_HEIGHT;
let ctx_map, ctx_avatar, ctx_ui;
let clientController;

/* Initializes canvas and ClientController on window onload */
window.onload = this.init();

/**
 * Initializes canvas and ClientController for the first time.
 * Also calls game loop to update frame constantly
 */
function init() {
  ctx_map = document.getElementById("mapCanvas").getContext("2d");
  ctx_avatar = document.getElementById("avatarCanvas").getContext("2d");
  ctx_ui = document.getElementById("uiCanvas").getContext("2d");

  ctx_map.canvas.width = GAME_WIDTH;
  ctx_map.canvas.height = GAME_HEIGHT;

  ctx_avatar.canvas.width = GAME_WIDTH;
  ctx_avatar.canvas.height = GAME_HEIGHT;

  ctx_ui.canvas.width = GAME_WIDTH;
  ctx_ui.canvas.height = GAME_HEIGHT;

  clientController = new ClientController(GameConfig.PORT);

  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

/**
 * Updates game constantly through a game loop
 * 
 * @param {number} timeStamp 
 */
function gameLoop(timeStamp) {
  TypeChecker.isNumber(timeStamp);

  //Clear canvas
  ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Perform the drawing operation
  clientController.updateGame(timeStamp);

  // The loop function has reached it's end. Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}