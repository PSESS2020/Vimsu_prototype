class LectureView extends WindowView {

    constructor(){
        super();
    }

    draw(lecture, hasToken, lectureChat) {
        // hide the overview of current lectures
        $('#currentLectures').hide(); 

        //chat box is emptied to prevent messages from showing in the wrong lecture chat
        $('#lectureChatMessages').empty();

        //chat box is filled with the lecture chat
        if (lectureChat.length > 0) {
            for(var i = 0; i < lectureChat.length; i++) {
                var message = lectureChat[i];
                var messageHeader = message.senderID + ", " + message.timestamp + ":";
                var $newMessageHeader = $( "<div style='font-size: small;'></div>" );
                var $newMessageBody = $( "<div style='font-size: medium;'></div>" );
                $newMessageHeader.text(messageHeader);
                $newMessageBody.text(message.messageText);
                $('#lectureChatMessages').append($newMessageHeader);
                $('#lectureChatMessages').append($newMessageBody);
            }
        } 
        
        //the input field is added if the user has a valif token
        if(hasToken) {
            if ($('#lectureChatInputGroup').is(':empty')) {   
            $('#lectureChatInputGroup').append(`
            <input id="lectureChatInput" type="text" style="background-color: #1b1e24; color: antiquewhite" class="form-control" placeholder="Enter message ...">
            <div class="input-group-append">
                <button id="lectureChatButton" class="btn btn-lecture mr-3" type="button">Send</button>
            </div>
            `)
            }
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-question-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You obtained a question token!')

        // the input field is emptied if the user does not have a valid token
        } else {
            $('#lectureChatInputGroup').empty();
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-times-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You left the lecture for too long. Therefore, you are not able to ask questions in the lecture chat.')
        }
        $('#closeButton').empty();

        $('#closeButton').append(`
        <button id="${lecture.id}" class="ml-auto pl-1 pr-1 closeButton" style="background-color: transparent !important; border-color: transparent !important; color: antiquewhite; box-shadow: 0px 0px 0px transparent;" name="closeLectureVideoButton" type="button"><i class="fa fa-close"></i></button>
        `)

        $('#lectureTitleLabel').text(lecture.title);
        $('#lectureSpeakerLabel').text(lecture.oratorName);
        
        $('#lectureVideo').attr('src', lecture.videoUrl);
        $('#lectureVideo').load();

        $('#lectureVideoWindow').show();
    }   
    
}

$(document).ready(() => {
    $(document).on('click', '#lectureChatButton', function(){ 
        let messageVal = $('#lectureChatInput').val();
        if(messageVal !== '') {
          clientController.sendToServerLectureChatMessage($('#lectureChatInput').val());
          $('#lectureChatInput').val('');
        }
    });
});
