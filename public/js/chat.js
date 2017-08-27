const Mustache = require('mustache');
const io = require('socket.io-client');
const client = io();
const {commandsList, commandsPrint} = require('./modules/commands');

// CSS
import '../css/global-styles.css';
import '../css/chat-styles.css';

// JS
import scrollToBottom from './modules/scrollToBottom';
import strToRGB from './modules/strToRGB';
import './libs/deparam';


client.on('connect', () => {
    const params = jQuery.deparam(window.location.search);

    client.emit('join', params, (err) => {
        if (err){
            alert(err);
            window.location.href = '/'
        } else {
            console.log('No errors');
        }
    });

    $('#message-form').on('submit', (e) => {
        e.preventDefault();
        var $messageTextbox = $('[name=message]');
		
		// Checking if message is a command
        if ($messageTextbox.val() in commandsList) {
			var popout = "";			
			if ($messageTextbox.val() == "\commands") {
				popout = commandsPrint;
			}
			else if ($messageTextbox.val() == "\printRooms") {
				client.emit('printRooms'); 
				client.on('roomNames', (roomNames) => {
					popout = roomNames;
					window.alert(popout);
				});
			}
			else {
				popout = commandsList[$messageTextbox.val()];
				// window.alert(popout);
			}
			window.alert(popout);
		}
		else {
			client.emit('createMessage', {
				text: $messageTextbox.val()
			});
		}
		$messageTextbox.val('');
    });

    $('#leave-room-btn').on('click', () => {
        window.location.href = '/';
    });

});

client.on('disconnect', () => {
    console.log('Disconnected from server')
});

client.on('updateUserList', (users) => {
    const ul = $('<ul></ul>');
    users.forEach((user) => {
       ul.append($('<li style="color:#' + strToRGB(user) + '"></li>').text(user));
    });
    $('#users').html(ul);
});

client.on('fillRoomWithMessages', (messages) => {
    const template = $('#message-template').html();
    messages.forEach((message) => {
        const html = Mustache.render(template, {
            from: message.from,
            text: message.text,
            createdAt: message.createdAt
        });

        $('#messages').append(html);
        scrollToBottom();
    })
});

// Admin messages
client.on('adminMessage', (message) => {
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        createdAt: message.createdAt
    });

    $('#messages').append(html);
    scrollToBottom();
});


client.on('newMessage', (message) => {
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: message.createdAt
    });

    $('#messages').append(html);
    scrollToBottom();

});




