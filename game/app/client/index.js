//var GameView = require('./views/js/GameView.js')
//var ClientController = require('./controller/ClientController.js')

var canvas = $('#canvas');
var ctx = canvas[0].getContext("2d");
this.ctx.canvas.width = 1900;
this.ctx.canvas.height = 950;

const GAME_WIDTH = 0;
const GAME_HEIGHT = 0;

let gameView = new GameView(GAME_WIDTH, GAME_HEIGHT, canvas, ctx);

/* The participantID can not be one (as we want to make sure it is congruent with the
 * server).
 * - (E) */
let clientController = new ClientController(gameView, 1);
clientController.setPort(5000);
clientController.openSocketConnection();

//TODO: anpassen
let lastTime = 0;

/*function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  gameView.update(deltaTime);
  gameView.draw(ctx);

  //requestAnimationFrame(gameLoop);
}*/

/*var keyCodes = {
  38: 'up',
  37: 'left',
  39: 'right',
  40: 'down',
}*/


window.setInterval(function(){
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  gameView.update();
  gameView.draw();
  
  // As a part of the gameplay loop, the client does emit on each frame
  // whether he is moving and in which direction (E)
  // This will probably be removed in my next proper commit.
  clientController.sendMovementToServer();

// is this meant to be "update every 50 ms" or "update 50 times per second" (in which case it should be 20) (E)?
}, 50); // can we replace this by a global constant in a settings file somewhere (E)?


document.onkeydown = function(event) {
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
      clientController.handleUpArrowUp();
      break;
    case "KeyS":
    case "ArrowDown":
      clientController.handleDownArrowUp();
      break;
    case "KeyD":
    case "ArrowRight":
      clientController.handleRightArrowUp();
      break;
    case "KeyA":
    case "ArrowLeft":
      clientController.handleLeftArrowUp();
      break;
  }

  event.preventDefault();
}
