/**
 * This is a temporary solution that is not very good but it will 
 * hopefully make creating a door a bit more user-friendly and flexible.
 * Basically, the reason this is here is so when adding doors while
 * creating a floorplan, the user does not need to give the entire
 * assetPath-key for the logo.
 * @enum All logos that can be placed above a door
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const DoorLogos = Object.freeze({
    [GlobalStrings.DEFAULT]: {
        [GlobalStrings.LEFT]: "leftnonedoor_default",
        [GlobalStrings.RIGHT]: "rightnonedoor_default"
    },
    [GlobalStrings.FOYER]: {
        [GlobalStrings.LEFT]: "leftfoyerdoor_default",
        [GlobalStrings.RIGHT]: "rightfoyerdoor_default"
    },
    [GlobalStrings.RECEPTION]: {
        [GlobalStrings.LEFT]: "leftreceptiondoor_default",
        [GlobalStrings.RIGHT]: "rightreceptiondoor_default"
    },
    [GlobalStrings.LECTURE]: {
        [GlobalStrings.LEFT]: "leftlecturedoor_default",
        [GlobalStrings.RIGHT]: "rightlecturedoor_default"
    },
    [GlobalStrings.FOODCOURT]: {
        [GlobalStrings.LEFT]: "leftfoodcourtdoor_default",
        [GlobalStrings.RIGHT]: "rightfoodcourtdoor_default"
    }
})

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = DoorLogos;
}