class GameConfig {

    /*
    *The width of the game context. Determines how broad the game window will be.
    */
   static CTX_WIDTH = 1900;

   /*
   *The height of the game context. Determines how height the game window will be.
   */
   static CTX_HEIGHT = 950;

    /*
   *The name of the game.
   */
  static GAME_NAME = "Vimsu";

  /*
   *The version of the game.
   */
  static GAME_VERSION = "v0.01 (alpha)";

   /*
   *The port at which the game communicates with the server.
   */
  static PORT = 5000;

  /*
   *Number of game views/ frames that are drawn in each second of the game duration.
   */
  static FPS = 30;

/*
* Time in milliseconds to wait after each game loop, that refreshes all
* graphical elements and draws them on screen.
*/
static TIME_DELTA = 1000 / this.FPS;
}