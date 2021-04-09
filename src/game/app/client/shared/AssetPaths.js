/**
 * @enum The paths of the images corresponding to the different assets
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
 const AssetPaths = Object.freeze({
    // Tiles
    "tile_default": 'client/assets/tiles/tile_default.png',
    "tile_selected": 'client/assets/tiles/tile_selected.png',
    
    // Walls
    "leftwall_default": "client/assets/walls/wall1.png",
    "rightwall_default": "client/assets/walls/wall2.png",

    // Doors
    "leftfoyerdoor_default": "client/assets/doors/door_foyer.png",
    "rightreceptiondoor_default": "client/assets/doors/door_reception.png",
    "leftlecturedoor_default": "client/assets/doors/door_lecturehall.png",
    "rightfoodcourtdoor_default": "client/assets/doors/door_foodcourt.png",
    
    // Schedule
    "leftschedule_default0": "client/assets/walls/schedule1.png",
    "leftschedule_default1": "client/assets/walls/schedule2.png",
    "leftschedule_default2": "client/assets/walls/schedule3.png",
    
    // Windows
    "leftwindow_default0": "client/assets/windows/left_small_window_default0.png",
    "rightwindow_default0": "client/assets/windows/right_small_window_default0.png",
    "leftwindow_default1": "client/assets/windows/left_small_window_default1.png",
    "rightwindow_default1": "client/assets/windows/right_small_window_default1.png",
    
    // Plant & Picture Frames
    "plant_default": "client/assets/plants/plant.png",
    "rightwallframe_default0": "client/assets/frames/wallframe1.png",
    "rightwallframe_default1": "client/assets/frames/wallframe2.png",
    "rightwallframe_default2": "client/assets/frames/wallframe3.png",
    
    // Logo
    "leftconferencelogo_default0": "client/assets/logos/conferencelogo1.png",
    "leftconferencelogo_default1": "client/assets/logos/conferencelogo2.png",
    "leftconferencelogo_default2": "client/assets/logos/conferencelogo3.png",
    "leftconferencelogo_default3": "client/assets/logos/conferencelogo4.png",
    "leftconferencelogo_default4": "client/assets/logos/conferencelogo5.png",
    
    // Seating
    "leftsofa_default": "client/assets/chairs/sofa_left.png",
    "rightsofa_default": "client/assets/chairs/sofa_right.png",
    "leftchair_default": "client/assets/chairs/chair_left.png",
    "rightchair_default": "client/assets/chairs/chair_right.png",
    "leftchairback_default": "client/assets/chairs/chair_left_back.png",
    "rightchairback_default": "client/assets/chairs/chair_right_back.png",
    
    // Tables
    "righttable_default": "client/assets/tables/dinnerTableRight.png",     
    "smalldinnertable_default": "client/assets/tables/smallDinnerTable.png",
    
    // Counters
    "canteencounter_default": "client/assets/other/canteenCounter.png",
    "receptionCounterFrontPart_default": "client/assets/other/ReceptionCounterFrontPart.png",
    "receptionCounterLeftPart_default": "client/assets/other/ReceptionCounterBackPartLeft.png",
    "receptionCounterRightPart_default": "client/assets/other/ReceptionCounterBackPartRight.png",
    
    // Food & Drinks
    "drinks_default": "client/assets/other/Drinks.png",
    "koeriWurst_bothSides": "client/assets/food/koeriWurscht_bothSides.png",
    "koeriWurst_upperSide": "client/assets/food/koeriWurscht_upperSide.png",
    "koeriWurst_lowerSide": "client/assets/food/koeriWurscht_lowerSide.png",
    "tea_default": "client/assets/food/tea.png",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AssetPaths;
}
