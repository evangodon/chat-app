const tinycolor = require('tinycolor2');

const strToHexColour = (str) => {
    let hash = hashString(str);
    let hue = Math.floor(hash * 30) * 16;

    return new tinycolor(`hsla
        (${hue}, 
        0.7, 
        0.6,
        1)`
    ).toHexString();
}

function hashString(str){
    let hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return '0.' + (hash >>> 0);
}

module.exports = {strToHexColour};
