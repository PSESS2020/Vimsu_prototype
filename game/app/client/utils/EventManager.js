const { isInstanceOf } = require("../../utils/TypeChecker");

class EventManager {

    #clientcontroller;



    /**
     * Handles Events from View and emits it to ClientController
     * 
     * @author Philipp
     * 
     */
    constructor() {

        //works because ClientController is singleton
        this.#clientcontroller = new Clientcontroller();

    }

    /**
     * called from View when door tile is clicked
     * 
     * @param {PositionClient} position
     */
    handleDoorClick(doorType) {
        
        clientController.handleFromViewEnterDoor(doorType);
        
    }




}