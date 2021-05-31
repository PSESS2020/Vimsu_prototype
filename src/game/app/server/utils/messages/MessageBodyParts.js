/**
 * Message body parts that can be used in multiple message bodies
 * @module MessageBodyParts
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = Object.freeze({
    unknownUsernamesMessage(unknownUsernames) {
        let usersNotFoundMsg = "";
        if (unknownUsernames.length > 0) {
            usersNotFoundMsg = " Users that were not found: ";
            for (let i = 0; i < unknownUsernames.length; i++) {
                if (i === (unknownUsernames.length - 1)) {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + '.';
                } else {
                    usersNotFoundMsg = usersNotFoundMsg + unknownUsernames[i] + ', ';
                }
            }
        }
        return usersNotFoundMsg;
    }
});