/* Import Models */
const Room = require('../models/Room.js');
const Conference = require('../models/Conference.js');
const TypeOfRoom = require('../../utils/TypeOfRoom');

/* Import Controller */
const RoomController = require('./RoomController.js');


/* Import Utils */
const Settings = require('../../utils/Settings.js');
const TypeChecker = require('../../../../config/TypeChecker.js');

module.exports = class ConferenceController {

    #conference
    #listOfRoomConts
    
    #listOfLegalMods
    #listOfLegalOras
    #listOfLegalAudis
    
    // Should these list contains controllers or models?
    #listOfSignedInMods
    #listOfSignedInOras
    #listOfSignedInAudis
    
    constructor(conference) {
        
        // TODO: implement type-checking
        
        // Set ConfCont to belong to conf
        this.#conference = conference;
        // TODO: set controller saved in conf to this
        
        this.#listOfLegalMods = [];
        this.#listOfLegalOras = [];
        this.#listOfLegalAudis = [];
        
        this.#listOfSignedInMods = new Map();
        this.#listOfSignedInOras = new Map();
        this.#listOfSignedInAudis = new Map();
        
        
        // this.#initConfPPants()
        
        this.#listOfRoomConts = new Map();
        
        // this.#initConfRooms()
        
    }
    
    /* Calls the #isLegal()-function with the id of the passed argument and adds the ppant
     * to the proper list (or his controller). Has the ppant not signed up for the conference
     * belonging to this controller, the #isLegal() returns the string 'ERROR'. If this happens
     * this function returns an error-Code which the client needs to handle (by passing it to
     * the view which will then display the error-message in a pop-up window), s.t. the client
     * knows why joining the conference failed.
     * This also needs to add the ppants-socket to the right channel.
     * - (E) */
    enterConference(ppant) {
    
    }
    
    exitConference(ppantID) {
    
    }
    
    /* Loads the different ppant-list - just the ids - from the DB
     * and saves them into the listOfLegal<X>-arrays
     * - (E) */
    /*#initConfPPants = function() {
    
    }*/
    
    #initConfRooms = function() {
        
        // can we do this with an forEach-Loop?
        /*
        for (const [name, string] of Object.entries(TypeOfRoom)) {
            
            // Generate roomID here
            // Create a new room of type <string> with the just generated id
            // Create a corresponding roomController
        
        }
        */
        /* Do these need to be added to a list in the conference-class?
         * - (E) */ 
        var roomReception = new Room(1001, TypeOfRoom.RECEPTION);
        var roomFoyer = new Room(1002, TypeOfRoom.FOYER);
        var roomFoodCourt = new Room(1003, TypeOfRoom.FOODCOURT);
        
        this.#listOfRoomConts.set(1001, new RoomController(roomReception));
        this.#listOfRoomConts.set(1002, new RoomController(roomFoyer));
        this.#listOfRoomConts.set(1003, new RoomController(roomFoodCourt));
           
    }   
    
    /* Takes an ID, checks it against the lists and returns the access-status of that ppant.
     * The return-value is a string from a enum, similiar to the TypeOfRoom-thing
     * - (E) */
    /*
    #isLegal = function(ppantID) {
    
    
    
    }
    */       

}
