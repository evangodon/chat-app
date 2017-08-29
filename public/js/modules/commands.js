const io = require('socket.io-client');
const client = io();

const commandsList = { // Testing /commands
	"/help": "What do you need help with?",
	"/commands": "Commands:",
	"/banana": "banana",
	"/cheese": "cheese",
	"/test": "test",
	"/printRooms": client.emit('printRooms'),
	"/deleteRoom": "deleteRoom"
};

const commandsPrint = (
		"Commands: " +
	"/help\n" +
	"/commands\n" +
	"/banana\n" +
	"/cheese\n" +
	"/test\n" + 
	"/printRooms"
);

module.exports = {commandsList, commandsPrint};