/**
 * The NPC Story Window View
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class NPCStoryView extends WindowView {

    #npcId;

    /**
     * Creates an instance of NPCStoryView
     */
    constructor() {
        super();

        if (!!NPCStoryView.instance) {
            return NPCStoryView.instance;
        }

        NPCStoryView.instance = this;
    }

    /**
     * Draws NPC story window
     * 
     * @param {String} name NPC name
     * @param {String[]} story NPC story
     */
    draw(name, story) {
        $('#npcStoryWait' + this.#npcId).hide()
        $(`#npcStoryModal${this.#npcId} .modal-header`).empty()
        $('#npcStory' + this.#npcId).empty();
        
        $(`#npcStoryModal${this.#npcId} .modal-header`).append(`
            <h5 class="modal-title d-inline-block" id="npcStoryTitle">${name + " says..."}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `)

        for (var i = 0; i < story.length; i++) {
            $('#npcStory' + this.#npcId).append(`
                <h5 style="background-color: rgba(0, 0, 0, 0); padding: 5px; text-align: left; display:none" id='${"story" + i.toString()}'>${story[i]}</h5>
                <button style="float:left; display: none; outline: none; box-shadow: none" class="btn" id='${"backwardStory" + i.toString()}'>
                    <i class="fa fa-arrow-left fa-3x navbarIcons"></i>
                </button>
                <button style="float:right; display: none; outline: none; box-shadow: none" class="btn" id='${"forwardStory" + i.toString()}'>
                    <i class="fa fa-arrow-right fa-3x navbarIcons"></i>
                </button>

                <script>
                    $("#backwardStory" + '${i}').on('click', function(event) {
                        $('#story' + '${i}').hide();
                        $('#backwardStory' + '${i}').hide();
                        $('#forwardStory' + '${i}').hide();
                        $('#story' + '${i - 1}').show();
                        $('#forwardStory' + '${i - 1}').show();

                        if(!${i === 1}) {
                            $('#backwardStory' + '${i - 1}').show();
                        }
                    })    
                    $("#forwardStory" + '${i}').on('click', function(event) {
                        $('#story' + '${i}').hide();
                        $('#backwardStory' + '${i}').hide();
                        $('#forwardStory' + '${i}').hide();
                        $('#story' + '${i + 1}').show();
                        $('#backwardStory' + '${i + 1}').show();

                        if(!${i === story.length - 2}) {
                            $('#forwardStory' + '${i + 1}').show();
                        }
                    }) 
                </script>
            `);

            if (i === 0) {
                $('#story' + i).show();
                $('#forwardStory' + i).show();
            };
        }
    }

    addNewNPCStoryWindow(npcId) {
        this.#npcId = npcId;

        if (!($('#npcStoryModal' + npcId).length)) {
            $('#npcStoryModalCollection').append(`
                <div class="modal fade" id="npcStoryModal${npcId}" tabindex="-1" role="dialog" aria-labelledby="npcStoryTitle${npcId}"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered mw-100 w-50" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            </div>
                            <div class="modal-body">
                                <div id="npcStoryWait${npcId}" style="text-align: center;">
                                    <i class="fas fa-circle-notch fa-spin fa-2x"></i>
                                </div>
                                <div id="npcStory${npcId}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        }

        $('#npcStoryModal' + npcId).modal('show');
    }
}