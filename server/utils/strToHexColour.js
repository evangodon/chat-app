const Palette = require('google-material-color-palette-json');

const colours = ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue','lime', 'cyan', 'teal', 'green'
    , 'lightGreen', 'yellow', 'amber', 'orange', 'deepOrange']

const strToHexColour = (str) => {
    // Get color from colours array
    const colour = colours[hashString(str)];
    // Return Hex value from Google material colours
    return  Palette[colour].shade_A400;
}

function hashString(str){
    var hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    // Return positive number between 0 and 15
    return (hash >>> 0)  % 16;
}

module.exports = {strToHexColour};
