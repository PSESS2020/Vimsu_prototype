/**
 * The Enter Code Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class EnterCodeView extends WindowView {

    eventManager;

    /**
     * Creates an instance of Enter Code Window View
     * 
     * @param {EventManager} eventManager event manager
     * @param {json} languageData language data for enterCode view
     */
    constructor(eventManager, languageData) {
        super(languageData);

        if (!!EnterCodeView.instance) {
            return EnterCodeView.instance;
        }

        EnterCodeView.instance = this;

        this.eventManager = eventManager;

        $('#enterCodeText').text(this.languageData.enterCode);
        $('#sendCodeText').text(this.languageData.sendCode);
        document.getElementById("codeInput").placeholder = this.languageData.enterCode + '...';
        document.getElementById("sendCodeBtn").title = this.languageData.tooltips.sendCode;
    }

    /**
     * Draws EnterCodeWindow for the door with doorId
     * 
     * @param {String} doorId 
     */
    draw(doorId) {
        $('#enteredCode').on('submit', (event) => {
            event.preventDefault();
            let enteredCode = $('#codeInput').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
            if (enteredCode !== '') {
                $('#inputEnterCodeModal').modal('hide');
                this.eventManager.handleCodeEntered(doorId, enteredCode);
                $('#codeInput').val('');
            }
        });

        $('#enteredCode').on('keydown', (event) => {
            event.stopPropagation();
        });

        $('#inputEnterCodeModal').modal('show');
        $('#codeInput').trigger('focus');
    }
}