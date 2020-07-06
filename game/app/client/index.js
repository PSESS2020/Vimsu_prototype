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
  ctx.clearRect(0, 0, 0, 0);

  gameView.update();
  gameView.draw();

}, 50);


document.onkeypress = function(e) {
  if (e.keyCode === 97 || e.keyCode === 37) { // A or left arrow key to turn left
    clientController.handleLeftArrowDown();
  } else if (e.keyCode === 119 || e.keyCode === 38) {
    clientController.handleUpArrowDown();
  } else if (e.keyCode === 100 || e.keyCode === 39) {
    clientController.handleRightArrowDown();
  } else if (e.keyCode === 115 || e.keyCode === 40) {
    clientController.handleDownArrowDown();
  }
};

document.onkeyup = function(e) {
  if (e.keyCode === 65 || e.keyCode === 37) { 
    clientController.handleArrowUp();
  } else if (e.keyCode === 87 || e.keyCode === 38) {
    clientController.handleArrowUp();
  } else if (e.keyCode === 68 || e.keyCode === 39) {
    clientController.handleArrowUp();
  } else if (e.keyCode === 83 || e.keyCode === 40) {
    clientController.handleArrowUp();
  }

}
  /*} else if (e.keyCode === 119 || e.keyCode === 38) {
    clientController.handleArrowUp();
  } else if (e.keyCode === 100 || e.keyCode === 39) {
    clientController.handleArrowUp();
  } else if (e.keyCode === 115 || e.keyCode === 40) {
    clientController.handleArrowUp();
  }
};*/

//requestAnimationFrame(gameLoop);

