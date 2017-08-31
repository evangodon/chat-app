const strToHexColour = (str) => {
	// hash to int
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// int to RGB
	var c = (hash & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return '#' + '00000'.substring(0, 6 - c.length) + c;
}

module.exports = {strToHexColour};