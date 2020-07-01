const ClientController = require("./controller/ClientController");
const GameView = require("./views/js/GameView");

var gameView = new GameView();

var clientController = new ClientController(gameView);
clientController.setPort(3000);
clientController.openSocketConnection();


