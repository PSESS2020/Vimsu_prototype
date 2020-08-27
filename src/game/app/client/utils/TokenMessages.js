/**
 * @enum Lecture token messages
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
const TokenMessages = Object.freeze({
    REVOKE: "Your token was revoked by either the orator or a moderator. Therefore, you are no longer able to ask questions in the lecture chat. " +
            "Please remember to follow chat etiquette.",
    TIMEOUT: "You left the lecture for too long. Therefore, you will not be able to ask questions in the lecture chat.",
    HASTOKEN: "You obtained a question token!"
});
