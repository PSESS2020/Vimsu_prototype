//var GameView = require('./views/js/GameView.js')
//var ClientController = require('./controller/ClientController.js')

var canvas = $('#canvas');
var ctx = canvas[0].getContext("2d");
const GAME_WIDTH = this.ctx.canvas.width = 1900;
const GAME_HEIGHT = this.ctx.canvas.height = 950;

let gameView = new GameView(GAME_WIDTH, GAME_HEIGHT);

let clientController = new ClientController(gameView, 1);
clientController.setPort(5000);
clientController.openSocketConnection();
clientController.initializeGameState();
clientController.initGameView();

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


/*function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  gameView.update(deltaTime);
  gameView.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);*/

