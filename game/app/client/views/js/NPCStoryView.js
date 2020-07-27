  
class NPCStoryView extends WindowView {
    
    constructor() {
        super();
    }
    
    draw(name, story) {
        $('#npcStoryModal .modal-header').append(`
            <h5 class="modal-title d-inline-block" id="npcStoryTitle">${name + " says..."}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `)
        
        for (var i = 0; i < story.length; i++) {
            $('#npcStoryModal .modal-body').append(`
                <h5 style="background-color: rgba(0, 0, 0, 0); padding: 5px; text-align: left; display:none" id='${"story" + i.toString()}'>${story[i]}</h5>
                <button style="float:left; display: none" class="btn" id='${"backwardStory" + i.toString()}'>
                    <i class="fa fa-arrow-left fa-3x navbarIcons"></i>
                </button>
                <button style="float:right; display: none" class="btn" id='${"forwardStory" + i.toString()}'>
                    <i class="fa fa-arrow-right fa-3x navbarIcons"></i>
                </button>

                <script>
                    $("#backwardStory" + '${i}').on('click', function(event) {
                        $('#story' + '${i}').hide();
                        $('#backwardStory' + '${i}').hide();
                        $('#forwardStory' + '${i}').hide();
                        $('#story' + '${i-1}').show();
                        $('#forwardStory' + '${i-1}').show();

                        if(!${i === 1}) {
                            $('#backwardStory' + '${i-1}').show();
                        }
                    })    
                    $("#forwardStory" + '${i}').on('click', function(event) {
                        $('#story' + '${i}').hide();
                        $('#backwardStory' + '${i}').hide();
                        $('#forwardStory' + '${i}').hide();
                        $('#story' + '${i+1}').show();
                        $('#backwardStory' + '${i+1}').show();

                        if(!${i === story.length - 2}) {
                            $('#forwardStory' + '${i+1}').show();
                        }
                    }) 
                </script>
            `);

            if(i === 0) {
                $('#story' + i).show();
                $('#forwardStory' + i).show();
            };
        }
        

        $('#npcStoryModal').on('hidden.bs.modal', function (e) {
            $('#npcStoryModal .modal-header').empty()
            $('#npcStoryModal .modal-body').empty();
        });
    }
}