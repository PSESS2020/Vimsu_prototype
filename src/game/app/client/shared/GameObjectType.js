/**
 * @enum game object type
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const GameObjectType = Object.freeze({
    SELECTED_TILE: 'SELECTED_TILE',
    BLANK: 'BLANK',
    TILE: 'TILE',
    LEFTWALL: 'LEFTWALL',
    RIGHTWALL: 'RIGHTWALL',
    TABLE: 'TABLE',
    LEFTTILE: 'LEFTTILE',
    RIGHTTILE: 'RIGHTTILE',
    LEFTSCHEDULE: 'LEFTSCHEDULE',
    PLANT: 'PLANT',
    CONFERENCELOGO: 'CONFERENCELOGO',
    LEFTSOFA: 'LEFTSOFA',
    RIGHTSOFA: 'RIGHTSOFA'
});

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = GameObjectType;
}