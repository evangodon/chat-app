const tinycolor = require('tinycolor2');

const strToHexColour = (str) => {
    let hash = hashString(str);
    let hue = Math.floor(hash * 30) * 12;
    return new tinycolor(`hsla(
        ${hue}, 
        0.8,
        0.6,
        1 
    `).toHexString();
}

function hashString(str){
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
        /* hash * 33 + c */
    }
    return '0.' + (hash >>> 0);

}

module.exports = {strToHexColour};
