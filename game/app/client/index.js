
const GAME_WIDTH = GameConfig.CTX_WIDTH;
const GAME_HEIGHT = GameConfig.CTX_HEIGHT;
let ctx_map;
let ctx_avatar;
let ctx_ui;

let clientController;

window.onload = this.init();

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

  clientController = new ClientController();
  clientController.setPort(GameConfig.PORT);
  clientController.openSocketConnection();

  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

let secondsPassed;
let oldTimeStamp;
let fps;

function gameLoop(timeStamp) {
  
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    //Clear canvas
    ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Perform the drawing operation
    clientController.updateGame();

    // Draw number to the screen
    ctx_avatar.fillStyle = 'white';
    ctx_avatar.fillRect(GAME_WIDTH - 50, 0, 50, 50);
    ctx_avatar.font = '25px Arial';
    ctx_avatar.fillStyle = 'black';
    ctx_avatar.fillText("FPS: " + fps, GAME_WIDTH - 50, 0);
    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}
/*
setInterval(function () {
  //let deltaTime = timestamp - lastTime;
  //lastTime = timestamp;

  ctx_avatar.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  clientController.updateGame();
  //gameView.update();
  //gameView.draw();  
}, GameConfig.TIME_DELTA);*/

$('#allchat').submit(function (event) {

  event.preventDefault();
  let messageVal = $('#allchatMessageInput').val();

  if (messageVal !== '') {

    if (messageVal[0] === '/') {
      clientController.sendToServerEvalInput(messageVal.slice(1));
    } else
      clientController.sendToServerAllchatMessage(messageVal);

    $('#allchatMessageInput').val('');
    return false;
  }

});

$('#groupName').submit(function (event) {
  event.preventDefault();
  let groupName = $('#groupNameInput').val();
  if (groupName.length > 20) {
    return false;
  }

  if (groupName !== '') {
    $('#inputGroupNameModal').modal('hide');
    $('#inviteFriendsModal').modal('toggle');
    clientController.handleFromViewShowInviteFriends(groupName, "");
    $('#groupNameInput').val('');
  }
});


document.getElementById("allchat").onkeydown = function (event) {
  event.stopPropagation();
};

document.getElementById("groupName").onkeydown = function (event) {
  event.stopPropagation();
};

document.getElementById("chatMessageInput").onkeydown = function (event) {
  event.stopPropagation();
};

document.body.onkeydown = function (event) {

  /* This little code-block (plus the one on the bottom) prevents a single input from being
   * handled twice (according to the mozilla-doc on this function).
   * - (E) */
  if (event.defaultPrevented) {
    return;
  }

  /* In time, it would be cool to replace the key-codes by constant strings
   * that can be modified via a settings-menu.
   * - (E) */
  switch (event.code) {
    case "KeyW":
      clientController.handleUpArrowDown();
      break;
    case "ArrowUp":
      event.preventDefault();
      clientController.handleUpArrowDown();
      break;
    case "KeyS":
      clientController.handleDownArrowDown();
      break;
    case "ArrowDown":
      event.preventDefault();
      clientController.handleDownArrowDown();
      break;
    case "KeyD":
      clientController.handleRightArrowDown();
      break;
    case "ArrowRight":
      event.preventDefault();
      clientController.handleRightArrowDown();
      break;
    case "KeyA":
      clientController.handleLeftArrowDown();
      break;
    case "ArrowLeft":
      event.preventDefault();
      clientController.handleLeftArrowDown();
      break;
    default:
      return;
  }
};

document.body.onkeyup = function (event) {
  if (event.defaultPrevented) {
    return;
  }

  /* In time, it would be cool to replace the key-codes by constant strings
   * that can be modified via a settings-menu.
   * - (E) */
  switch (event.code) {
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
