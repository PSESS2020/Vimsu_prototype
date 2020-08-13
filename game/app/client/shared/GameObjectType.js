const GameObjectType = Object.freeze({
    SELECTED_TILE: 'SELECTED_TILE',
    BLANK: 'BLANK',
    TILE: 'TILE',
    LEFTWALL: 'LEFTWALL',
    RIGHTWALL: 'RIGHTWALL',
    TABLE: 'TABLE',
    LEFTTILE: 'LEFTTILE',
    RIGHTTILE: 'RIGHTTILE',
    SCHEDULE: 'SCHEDULE'
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectType;
}