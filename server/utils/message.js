const moment = require('moment');
const swearjar = require('swearjar');

const generateMessage = (from, text, colour) => {
    let cleanText = swearjar.censor(text);
    return {
        from,
        text: cleanText,
        colour,
        createdAt: moment().toISOString(),
    };
};

const generateAdminMessage = (text) => {
    return {
        text,
        createdAt: moment().format('h:mm a, MMMM Do YYYY'),
    }
}

module.exports = {generateMessage, generateAdminMessage};