var ctx_map = document.getElementById("mapCanvas").getContext("2d");
var ctx_avatar = document.getElementById("avatarCanvas").getContext("2d");
var ctx_ui = document.getElementById("uiCanvas").getContext("2d");
const GAME_WIDTH = this.ctx_map.canvas.width = 1900;
const GAME_HEIGHT = this.ctx_map.canvas.height = 950;

this.ctx_avatar.canvas.width = 1900;
this.ctx_avatar.canvas.height = 950;
let gameView = new GameView(GAME_WIDTH, GAME_HEIGHT);

/* The participantID should not be one (as we want to make sure it is congruent with the
 * server).
 * - (E) */
let clientController = new ClientController(gameView);
clientController.setPort(5000);
clientController.openSocketConnection();
//clientController.initGameView();

setInterval( function() {
  //let deltaTime = timestamp - lastTime;
  //lastTime = timestamp;

  ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  gameView.update();
  gameView.draw();  
}, 1000 / 30);

document.onkeydown = function(event) {
  /* This little code-block (plus the one on the bottom) prevents a single input from being
   * handled twice (according to the mozilla-doc on this function).
   * - (E) */
  if (event.defaultPrevented) {
    return;
  }

  /* In time, it would be cool to replace the key-codes by constant strings
   * that can be modified via a settings-menu.
   * - (E) */
  switch(event.code) {
    case "KeyW":
    case "ArrowUp":
      clientController.handleUpArrowDown();
      break;
    case "KeyS":
    case "ArrowDown":
      clientController.handleDownArrowDown();
      break;
    case "KeyD":
    case "ArrowRight":
      clientController.handleRightArrowDown();
      break;
    case "KeyA":
    case "ArrowLeft":
      clientController.handleLeftArrowDown();
      break;
  }
  
  event.preventDefault();
};

document.onkeyup = function(event) {
  if (event.defaultPrevented) {
    return;
  }

  /* In time, it would be cool to replace the key-codes by constant strings
   * that can be modified via a settings-menu.
   * - (E) */
  switch(event.code) {
    case "KeyW":
    case "ArrowUp":
      clientController.handleArrowUp();
      break;
    case "KeyS":
    case "ArrowDown":
      clientController.handleArrowUp();
      break;
    case "KeyD":
    case "ArrowRight":
      clientController.handleArrowUp();
      break;
    case "KeyA":
    case "ArrowLeft":
      clientController.handleArrowUp();
      break;
  }

  event.preventDefault();
}
