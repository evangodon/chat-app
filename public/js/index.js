const io = require('socket.io-client');
const client = io();
const {isRealString} = require('../../server/utils/validation');
const swearJar = require('swearjar');

import '../css/global-styles.css';
import "../css/index-styles.css";


client.on('connect', () => {
   client.emit('getRooms');

    // Client-side validation
    const $formInput = $('#index-form input[type=text]');
    const $validationMessage = $('#validation-message');
    const $joinBtn = $('#join-btn');
    const $createRoomInput = $('#create-room-input');
    const $roomSelect = $('#room-selection');

    // Join Button disabled until input forms are filled
    $joinBtn.click((e) => {
        const nameInput = $('#display-name-input').val().toString();
        const roomInput = $('#create-room-input').val().toString();
        $validationMessage.html('');
        if (!isRealString(nameInput)){
            e.preventDefault();
            $joinBtn.prop('disabled', 'disabled');
            let html = '<div class="validation">You need a name.</div>';
            $validationMessage.append(html);
        }
        if (!isRealString(roomInput) && $roomSelect[0].selectedIndex === 0){
            e.preventDefault();
            $joinBtn.prop('disabled', 'disabled');
            let html = '<div class="validation">You need to create or join an existing room.</div>';
            $validationMessage.append(html);
        }
        $joinBtn.prop('disabled', false);
    });

    // Check for censored words
    $formInput.on('keyup', (e) => {
        const nameInput = $('#display-name-input').val().toString();
        const roomInput = $('#create-room-input').val().toString();
        if (swearJar.profane(nameInput) || swearJar.profane(roomInput)){
            e.target.className = 'invalid-input';
            let html = '<div class="validation">Hey! No bad words.</div>';
            $validationMessage.html(html);
            $joinBtn.prop('disabled', 'disabled');

        } else {
            e.target.className = '';
            $joinBtn.prop('disabled', false);
            $validationMessage.html('');
        }
    });

   // Check for input text in "Create Room" and disable "Current Rooms" selection if needed
    $createRoomInput.change( () => {
        if ($createRoomInput.val()){
            $roomSelect.prop('disabled', 'disabled');
            $roomSelect.css('background','#eee');
            $roomSelect.children()[0].selected = 'selected';
        } else {
            $roomSelect.prop('disabled', false);
            $roomSelect.css('background','#ffffff');
        }
    });
});

client.on('sendRooms', (rooms) => {
    let roomOptions;

    if (rooms.length >= 1){
       roomOptions = '<option selected="selected" disabled>- Select Room -</option>';

       rooms.forEach(roomName => {
           roomName = capitalizeFirstLetters(roomName);
           roomOptions += `<option value="${roomName}">${roomName}</option>`;
       });
   } else {
      roomOptions = '<option selected="selected" disabled> ----- </option>'
   }

   $('#room-selection').html(roomOptions);
});



function capitalizeFirstLetters(word){
    return word.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    });
}
