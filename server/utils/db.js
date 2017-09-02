const {Room, Message} = require('../../models/room');

class Mongo {
    saveRoom (room) {
        Room.findOne({name: room}, (err, roomExists) => {
            if (err) {
                return console.log(err);
            }
            if (!roomExists) {
                let newRoom = new Room({
                    name: room
                });

                newRoom.save((err) => {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log(`Room ${room} has been added to MongoDB.`);
                    }
                });
            }
        });
    }
    saveMessage (message, room) {
        Room.findOne({name: room}, (err, toThisRoom) => {
            if (err){
                return console.log(err);
            }

            if (message){
                let addThisMessage = new Message({
                    from: message.from,
                    text:  message.text,
                    colour: message.colour,
                    createdAt:  message.createdAt
                });

                toThisRoom.messages.push(addThisMessage);
                toThisRoom.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        });
    }
	
    getRooms () {
		const query = Room.find({});
        return query.exec((err) => {
            if (err) {
                return console.log(err);
            }
        });
    }
    getMessagesFromRoom (fromThisRoom) {
        const query = Room.findOne({name: fromThisRoom});
        return query.exec((err, room) => {
            if (err) {
                return console.log(err)
            }
            if (room) {
                return room.messages
            }
        });
    }
    deleteRoom (room) {
        Room.remove({name: room}, (err, removed) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Room ${room} has been deleted.`)
        });
    }
}

module.exports = {Mongo};