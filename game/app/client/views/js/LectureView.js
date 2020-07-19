class LectureView extends WindowView {

    constructor(){
        super();
    }

    draw(lecture, hasToken, lectureChat) {
        console.log(lectureChat);
        if (lectureChat.length > 0) {
            for(var i = 0; i < lectureChat.length; i++) {
                var message = lectureChat[i];
                var messageHeader = message.senderID + ", " + timestamp + ":";
                var $newMessageHeader = $( "<div style='font-size: small;'></div>" );
                var $newMessageBody = $( "<div style='font-size: medium;'></div>" );
                $newMessageHeader.text(messageHeader);
                $newMessageBody.text(text);
                $('#lectureChatMessages').append($newMessageHeader);
                $('#lectureChatMessages').append($newMessageBody);
            }
        }
        $('#currentLectures').hide(); // hide the overview of current lectures
        console.log("hastoken" + hasToken);
        $('#lectureChatMessages').empty();
        if(hasToken) {
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-question-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You obtained a question token!')
        } else {
            $('#lectureChatInputGroup').empty();
            $('#tokenIcon').empty();
            $('#tokenIcon').append(`
            <i class="fa fa-times-circle fa-4x"></i>
            `)
            $('#tokenLabel').empty();
            $('#tokenLabel').append('You left the lecture for too long. Therefore you are not able to ask questions in the lecture chat.')
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

document.getElementById("lectureChatButton").onclick = function(event) {
    let messageVal = $('#lectureChatInput').val();
    alert("sending")
    if(messageVal !== '') {
      var lectureChatinput = $('#lectureChatInput').val();
      alert('hello');
      console.log(lectureChatinput);
      clientController.sendToServerLectureChatMessage($('#lectureChatInput').val());
      $('#lectureChatInput').val('');
    }
};