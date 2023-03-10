/**
 * @enum The paths of the images corresponding to the different assets
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
AssetPaths = Object.freeze({
    // Blank
    "blank": "../client/assets/other/blank.png",

    // Tiles
    "tile_default": "../client/assets/tiles/tile.png",
    "tile_selected_default": "../client/assets/tiles/tile_selected_default.png",
    "tile_selected_clickable": "../client/assets/tiles/tile_selected_clickable.png",
    
    // Walls
    "leftwall_default": "../client/assets/walls/wall1.png",
    "rightwall_default": "../client/assets/walls/wall2.png",

    // Doors
    "leftnonedoor_default": "../client/assets/doors/door_none_alt.png",
    "rightnonedoor_default": "../client/assets/doors/door_none.png",
    "leftfoyerdoor_default": "../client/assets/doors/door_foyer.png",
    "rightfoyerdoor_default": "../client/assets/doors/door_foyer_alt.png",
    "leftreceptiondoor_default": "../client/assets/doors/door_reception_alt.png",
    "rightreceptiondoor_default": "../client/assets/doors/door_reception.png",
    "leftlecturedoor_default": "../client/assets/doors/door_lecturehall.png",
    "rightlecturedoor_default": "../client/assets/doors/door_lecturehall_alt.png",
    "leftfoodcourtdoor_default": "../client/assets/doors/door_foodcourt_alt.png",
    "rightfoodcourtdoor_default": "../client/assets/doors/door_foodcourt.png",
    
    // Schedule
    "leftschedule_default0": "../client/assets/walls/schedule1.png",
    "leftschedule_default1": "../client/assets/walls/schedule2.png",
    "leftschedule_default2": "../client/assets/walls/schedule3.png",
    
    // Windows
    "leftwindow_default0": "../client/assets/windows/left_small_window_default0.png",
    "rightwindow_default0": "../client/assets/windows/right_small_window_default0.png",
    "leftwindow_default1": "../client/assets/windows/left_small_window.png",
    "rightwindow_default1": "../client/assets/windows/right_small_window_default1.png",
    
    // Plant & Picture Frames
    "plant_default": "../client/assets/plants/plant.png",
    "rightwallframe_default0": "../client/assets/frames/wallframe1.png",
    "rightwallframe_default1": "../client/assets/frames/wallframe2.png",
    "rightwallframe_default2": "../client/assets/frames/wallframe3.png",
    
    // Logo
    "leftconferencelogo_default0": "../client/assets/logos/conferencelogo1.png",
    "leftconferencelogo_default1": "../client/assets/logos/conferencelogo2.png",
    "leftconferencelogo_default2": "../client/assets/logos/conferencelogo3.png",
    "leftconferencelogo_default3": "../client/assets/logos/conferencelogo4.png",
    "leftconferencelogo_default4": "../client/assets/logos/conferencelogo5.png",
    
    // Seating
    "leftsofa_default": "../client/assets/chairs/sofa_left.png",
    "rightsofa_default": "../client/assets/chairs/sofa_right.png",
    "leftchair_default": "../client/assets/chairs/chair_left.png",
    "rightchair_default": "../client/assets/chairs/chair_right.png",
    "leftchairback_default": "../client/assets/chairs/chair_left_back.png",
    "rightchairback_default": "../client/assets/chairs/chair_right_back.png",
    
    // Tables
    "table_default": "../client/assets/tables/table.png",
    "righttable_default": "../client/assets/tables/dinnerTableRight.png",
    "lefttable_default": "../client/assets/tables/dinnerTableLeft.png",       
    "smalldinnertable_default": "../client/assets/tables/smallDinnerTable.png",
    
    // Counters
    "canteencounter_default": "../client/assets/other/canteenCounter.png",
    "receptionCounterFrontPart_default": "../client/assets/other/ReceptionCounterFrontPart.png",
    "receptionCounterLeftPart_default": "../client/assets/other/ReceptionCounterBackPartLeft.png",
    "receptionCounterRightPart_default": "../client/assets/other/ReceptionCounterBackPartRight.png",
    
    // Food & Drinks
    "drinks_default": "../client/assets/other/Drinks.png",
    "koeriWurst_default": "../client/assets/food/koeriWurscht.png",
    "koeriWurst_bothSides": "../client/assets/food/koeriWurscht_bothSides.png",
    "koeriWurst_upperSide": "../client/assets/food/koeriWurscht_upperSide.png",
    "koeriWurst_lowerSide": "../client/assets/food/koeriWurscht_lowerSide.png",
    "tea_default": "../client/assets/food/tea.png",
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AssetPaths;
}
