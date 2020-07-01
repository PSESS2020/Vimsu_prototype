//var GameView = require('./views/js/GameView.js')
//var ClientController = require('./controller/ClientController.js')

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 600;
const GAME_HEIGHT = 300;

gameView = new GameView(GAME_WIDTH, GAME_HEIGHT);
/*
let gameView = new GameView(GAME_WIDTH, GAME_HEIGHT);
let clientController = new ClientController(gameView, 1);
clientController.setPort(3000);
clientController.openSocketConnection();*/
/*
//TODO: anpassen
let lastTime = 0;

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  gameView.update(deltaTime);
  gameView.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

*/