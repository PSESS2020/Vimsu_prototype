var ctx_map = document.getElementById("mapCanvas").getContext("2d");
var ctx_avatar = document.getElementById("avatarCanvas").getContext("2d");
var ctx_ui = document.getElementById("uiCanvas").getContext("2d");

const GAME_WIDTH = GameConfig.CTX_WIDTH;
const GAME_HEIGHT = GameConfig.CTX_HEIGHT;

this.ctx_map.canvas.width = GAME_WIDTH;
this.ctx_map.canvas.height = GAME_HEIGHT;

this.ctx_avatar.canvas.width = GAME_WIDTH;
this.ctx_avatar.canvas.height = GAME_HEIGHT;

this.ctx_ui.canvas.width = GAME_WIDTH;
this.ctx_ui.canvas.height = GAME_HEIGHT;

//let gameView = new GameView(GAME_WIDTH, GAME_HEIGHT);

let clientController = new ClientController();
clientController.setPort(GameConfig.PORT);
clientController.openSocketConnection();
//clientController.initGameView();

setInterval( function() {
  //let deltaTime = timestamp - lastTime;
  //lastTime = timestamp;

  ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  clientController.updateGame();
  //gameView.update();
  //gameView.draw();  
}, GameConfig.TIME_DELTA);

$('form').submit(function(event) {
    
    event.preventDefault();
    let messageVal = $('#allchatMessageInput').val();
    
    if(messageVal !== '') {
      
      if(messageVal[0] === '/') {
          clientController.sendToServerEvalInput(messageVal.slice(1));
        } else
          clientController.sendToServerAllchatMessage(messageVal);
      
      $('#allchatMessageInput').val('');
      return false;
    }

});

document.getElementById("allchat").onkeydown = function(event) {
    event.stopPropagation();
};

document.getElementById("lectureChatButton").onclick = function(event) {
    let messageVal = $('#lectureChatInput').val();
    if(messageVal !== '') {
      clientController.sendToServerLectureChatMessage($('#lectureChatInput').val());
      $('#lectureChatInput').val('');
    }
};

document.body.onkeydown = function(event) {
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
    default:
      return;
  }
  //event.preventDefault();
};

document.body.onkeyup = function(event) {
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

  //event.preventDefault();
}
