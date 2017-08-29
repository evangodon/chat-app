const io = require('socket.io-client');
const client = io();

export default function() {
    $('body').append($('<audio autoplay><source src="/media/stars.mp3" type="audio/mp3"></audio>'));


    $('.chat__main').css({"background":"url('/media/space.jpg') no-repeat",
                         "background-position": "85% 100%",
                         "background-size": "cover"});
    $('#messages').addClass('room-zoom-out');

    setTimeout(() => {
        window.location.href = '/';
    }, 23000);

    const params = $.deparam(window.location.search);
    client.emit('deleteRoom', params.room.toLowerCase());

}