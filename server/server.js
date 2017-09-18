const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const {generateMessage, generateAdminMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {strToHexColour} = require('./utils/strToHexColour');
const {Users} = require('./utils/Users');
const {Mongo} = require('./utils/Mongo');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const mongo = new Mongo();
const swearjar = require('swearjar');

app.use(express.static(publicPath));


//-------------------- MONGODB ------------------------

mongoose.connect('mongodb://egodon:kiwi123@ds035664.mlab.com:35664/chatapp');
mongoose.Promise = global.Promise;
let db  = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log(err);
});

//-------------------- SOCKET.IO ------------------------

io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        const room = params.room.toLowerCase();
        socket.join(room);
        users.removeUser(socket.id);
        const userColour = strToHexColour(params.name);
        users.addUser(socket.id, params.name, room, userColour);
        mongo.saveRoom(room);

        // Send user colour to client side
        socket.emit('initCanvas', userColour);

        // Add messages to room from DB
        mongo.getMessagesFromRoom(room, 50).then((roomExists) => {
                if (roomExists && roomExists.messages.length > 0) {
                    socket.emit('fillRoomWithMessages', roomExists.messages);
                }
            }).then(() => {
                socket.emit('adminMessage', generateAdminMessage(`Welcome ${params.name} to room '${params.room}'`));
            });

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.broadcast.to(room).emit('adminMessage', generateAdminMessage(`${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message) => {
        const user = users.getUser(socket.id);
        let newMessage;
        if (user && isRealString(message.text)) {
            newMessage = generateMessage(user.name, message.text, user.colour);
            io.to(user.room).emit('newMessage', newMessage);
            mongo.saveMessage(newMessage, user.room);
        }
    });

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('getRooms', () => {
        mongo.getRooms().then(rooms => {
            let roomNames = rooms.map(room => room.name);
            socket.emit('sendRooms', roomNames);
        })
    });
	
	socket.on('printRooms', () => {
		mongo.getRooms().then(rooms => {
			let roomNames = rooms.map(room => room.name);
			socket.emit('roomNames', roomNames);
		});
	});

	socket.on('deleteRoom', (room) => {
        mongo.deleteRoom(room);
    });


    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('adminMessage', generateAdminMessage(`${user.name} has left.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

