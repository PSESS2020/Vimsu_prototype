  
class NPCStoryView extends WindowView {
    
    constructor() {
        super();
    }
    
    draw(story) {
        story.forEach(line => {
        $('#npcStoryModal .modal-body').append(`
        <h5 style="background-color: rgba(24, 30, 32, 0.699); padding: 5px; text-align: center">${line}</h5>
        </br
        `);
        });

        $('#npcStoryModal').on('hidden.bs.modal', function (e) {
            $('#npcStoryModal .modal-body').empty();
        });
    }
}