const moment = require('moment');
const swearjar = require('swearjar');

const generateMessage = (from, text) => {
    let cleanText = swearjar.censor(text);
    return {
        from,
        text: cleanText,
        createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
    };
};

const generateAdminMessage = (text) => {
    return {
        text,
        createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
    }
}

module.exports = {generateMessage, generateAdminMessage};