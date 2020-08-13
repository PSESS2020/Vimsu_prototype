const GameObjectType = Object.freeze({
    SELECTED_TILE: -1,
    BLANK: 0,
    TILE: 1,
    LEFTWALL: 2,
    RIGHTWALL: 3,
    LECTUREDOOR: 4,
    FOODCOURTDOOR: 5,
    RECEPTIONDOOR: 6,
    TABLE: 7,
    LEFTTILE: 8,
    RIGHTTILE: 9,
    FOYERDOOR: 10,
    SCHEDULE: 11,
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectType;
}