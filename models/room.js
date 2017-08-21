const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const messageSchema = new Schema({

    from: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
});

const roomSchema = new Schema({
    name: String,
    messages: [messageSchema]
});


module.exports.Message = mongoose.model('Message', messageSchema);
module.exports.Room = mongoose.model('Room', roomSchema);

