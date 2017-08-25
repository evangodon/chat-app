const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const {generateMessage, generateAdminMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Mongo} = require('./utils/db');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
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
        users.addUser(socket.id, params.name, room);

        mongo.saveRoomToDB(room);

        // Add messages to room from DB
        mongo.getMessagesFromRoom(room).then((roomExists) => {
            if (roomExists && roomExists.messages.length > 0) {
                socket.emit('fillRoomWithMessages', roomExists.messages);
            }
        });

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.emit('adminMessage', generateAdminMessage(`Welcome to room '${params.room}'`));
        socket.broadcast.to(room).emit('adminMessage', generateAdminMessage(`${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message) => {
        const user = users.getUser(socket.id);
        let newMessage;
        if (user && isRealString(message.text)) {
            newMessage = generateMessage(user.name, message.text);
            io.to(user.room).emit('newMessage', newMessage);
            mongo.saveMessageToDB(newMessage, user.room);
        }
		// callback(); // Removed, inefficient way of clearing message box
    });

    socket.on('getRooms', () => {
        mongo.getRoomsFromDB().then(rooms => {
            let roomNames = rooms.map(room => room.name);
            socket.emit('sendRooms', roomNames);
        })
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

