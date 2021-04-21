/**
 * The Game Config
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */

class GameConfig {

   /*
   * The width of the game context. Determines how broad the game window will be.
   */
   static get CTX_WIDTH() { 
      return 1800;
   }

   /*
   * The height of the game context. Determines how height the game window will be.
   */
   static get CTX_HEIGHT() { 
      return 900;
   }

   /*
   * The name of the game.
   */
   static get GAME_NAME() {
      return "Vimsu"
   } 

   /*
   * The version of the game.
   */
   static get GAME_VERSION() {
      return "v1.0.0 (alpha)";
   } 

   /*
   * The port at which the game communicates with the server.
   */
   static get PORT() {
      return 5000;
   } 
}